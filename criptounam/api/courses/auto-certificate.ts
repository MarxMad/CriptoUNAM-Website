/**
 * Vercel Function: auto-emisión de certificado NFT al completar un curso.
 *
 * POST /api/courses/auto-certificate
 *   body: { wallet: 0x..., cursoId, cursoTitulo, cohorteRef, totalLecciones }
 *
 * Flujo:
 *   1. Valida progreso en Supabase (todas las lecciones completadas).
 *   2. Verifica que no se ha emitido el certificado (idempotente).
 *   3. Acuña NFT soulbound en CriptoUNAMBadges (kind=CourseCompletion).
 *   4. Opcional: mintea CERT_PUMA_REWARD en PUMAToken como drop.
 *   5. Registra en curso_certificados con tokenId y txHash.
 *
 * Variables de entorno (configurar en Vercel, NUNCA con prefijo VITE_):
 *   MINTER_PRIVATE_KEY        — wallet con MINTER_ROLE (Badges) + REWARD_MANAGER_ROLE (PUMA)
 *   ARBITRUM_RPC_URL          — RPC de Arbitrum One
 *   BADGES_CONTRACT           — dirección de CriptoUNAMBadges
 *   PUMA_TOKEN                — dirección de PUMAToken
 *   SUPABASE_URL              — URL del proyecto Supabase
 *   SUPABASE_SERVICE_ROLE_KEY — service role key (bypassa RLS)
 *   BADGES_METADATA_BASE      — base URL para metadata (ej. ipfs://CID/ o https://criptounam.xyz/badges/)
 *   CERT_PUMA_REWARD          — opcional, cantidad de PUMA a entregar (ej. "100"). Default: 0.
 */

import { createWalletClient, createPublicClient, http, parseEther, isAddress, decodeEventLog } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { arbitrum } from 'viem/chains'
import { createClient } from '@supabase/supabase-js'

const BADGE_KIND_COURSE = 0 // CourseCompletion en CriptoUNAMBadges

// ABI mínima de los métodos que usamos
const badgesAbi = [
  {
    type: 'function',
    name: 'mint',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'kind', type: 'uint8' },
      { name: 'ref', type: 'string' },
      { name: 'uri', type: 'string' },
    ],
    outputs: [{ name: 'tokenId', type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'BadgeMinted',
    inputs: [
      { name: 'to', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true },
      { name: 'kind', type: 'uint8', indexed: true },
      { name: 'ref', type: 'string', indexed: false },
    ],
    anonymous: false,
  },
] as const

const pumaAbi = [
  {
    type: 'function',
    name: 'mintReward',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'reason', type: 'string' },
    ],
    outputs: [],
  },
] as const

type Body = {
  wallet?: string
  cursoId?: string
  cursoTitulo?: string
  cohorteRef?: string
  totalLecciones?: number
}

function jsonError(res: any, status: number, error: string, detail?: unknown) {
  res.status(status).json({ error, detail })
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return jsonError(res, 405, 'Method not allowed')
  }

  // ---- 0. parse body ----
  const body = (req.body || {}) as Body
  const wallet = (body.wallet || '').toLowerCase()
  const cursoId = String(body.cursoId || '').trim()
  const cohorteRef = (body.cohorteRef || 'v1').trim() || 'v1'
  const cursoTitulo = (body.cursoTitulo || '').trim()
  const totalLecciones = Number(body.totalLecciones || 0)

  if (!isAddress(wallet)) return jsonError(res, 400, 'wallet inválida')
  if (!cursoId) return jsonError(res, 400, 'cursoId requerido')
  if (totalLecciones <= 0) return jsonError(res, 400, 'totalLecciones inválido')

  // ---- 1. env vars ----
  const {
    MINTER_PRIVATE_KEY,
    ARBITRUM_RPC_URL,
    BADGES_CONTRACT,
    PUMA_TOKEN,
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    BADGES_METADATA_BASE,
    CERT_PUMA_REWARD,
  } = process.env

  if (!MINTER_PRIVATE_KEY || !ARBITRUM_RPC_URL || !BADGES_CONTRACT || !PUMA_TOKEN) {
    return jsonError(res, 500, 'Backend mal configurado (faltan envs on-chain)')
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return jsonError(res, 500, 'Backend mal configurado (faltan envs Supabase)')
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  })

  const badgeRef = `course-${cursoId}-${cohorteRef}`

  // ---- 2. Validar progreso en Supabase ----
  const { data: progresoRows, error: progresoErr } = await supabase
    .from('curso_progreso')
    .select('leccion_index')
    .eq('wallet_address', wallet)
    .eq('curso_id', cursoId)

  if (progresoErr) {
    return jsonError(res, 500, 'Error consultando progreso', progresoErr.message)
  }

  const completadas = new Set((progresoRows || []).map((r: any) => r.leccion_index))
  if (completadas.size < totalLecciones) {
    return jsonError(res, 403, 'Curso no completado todavía', {
      completadas: completadas.size,
      requeridas: totalLecciones,
    })
  }

  // ---- 3. Idempotencia: ¿ya existe el certificado? ----
  const { data: existingCert } = await supabase
    .from('curso_certificados')
    .select('token_id, tx_hash')
    .eq('wallet_address', wallet)
    .eq('badge_ref', badgeRef)
    .maybeSingle()

  if (existingCert) {
    return res.status(200).json({
      ok: true,
      alreadyClaimed: true,
      tokenId: existingCert.token_id,
      txHash: existingCert.tx_hash,
    })
  }

  // ---- 4. Mint on-chain ----
  const account = privateKeyToAccount(MINTER_PRIVATE_KEY as `0x${string}`)
  const transport = http(ARBITRUM_RPC_URL)
  const walletClient = createWalletClient({ account, chain: arbitrum, transport })
  const publicClient = createPublicClient({ chain: arbitrum, transport })

  const tokenUri = BADGES_METADATA_BASE
    ? `${BADGES_METADATA_BASE.replace(/\/$/, '')}/${badgeRef}.json`
    : `${badgeRef}.json`

  let txHash: `0x${string}`
  try {
    txHash = await walletClient.writeContract({
      address: BADGES_CONTRACT as `0x${string}`,
      abi: badgesAbi,
      functionName: 'mint',
      args: [wallet as `0x${string}`, BADGE_KIND_COURSE, badgeRef, tokenUri],
    })
  } catch (e: any) {
    return jsonError(res, 500, 'Mint del badge falló', e?.shortMessage || e?.message)
  }

  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash })
  if (receipt.status !== 'success') {
    return jsonError(res, 500, 'Transacción del badge falló on-chain', { txHash })
  }

  // ---- 5. Sacar tokenId del evento BadgeMinted ----
  let tokenId: string | null = null
  for (const log of receipt.logs) {
    if (log.address.toLowerCase() !== (BADGES_CONTRACT as string).toLowerCase()) continue
    try {
      const decoded = decodeEventLog({ abi: badgesAbi, data: log.data, topics: log.topics })
      if (decoded.eventName === 'BadgeMinted') {
        tokenId = String(decoded.args.tokenId)
        break
      }
    } catch {
      /* no-op */
    }
  }

  // ---- 6. Drop opcional de PUMA ----
  let pumaTxHash: `0x${string}` | null = null
  const pumaRewardAmount = CERT_PUMA_REWARD || '0'
  try {
    const wei = parseEther(pumaRewardAmount)
    if (wei > 0n) {
      pumaTxHash = await walletClient.writeContract({
        address: PUMA_TOKEN as `0x${string}`,
        abi: pumaAbi,
        functionName: 'mintReward',
        args: [wallet as `0x${string}`, wei, `Certificado: ${cursoTitulo || cursoId}`],
      })
      await publicClient.waitForTransactionReceipt({ hash: pumaTxHash })
    }
  } catch (e: any) {
    // No bloqueamos: el NFT ya se emitió. Sólo registramos.
    console.error('PUMA drop opcional falló:', e?.shortMessage || e?.message)
  }

  // ---- 7. Persistir en Supabase ----
  const { error: upsertErr } = await supabase.from('curso_certificados').upsert(
    {
      wallet_address: wallet,
      curso_id: cursoId,
      badge_ref: badgeRef,
      token_id: tokenId,
      tx_hash: txHash,
      claimed_at: new Date().toISOString(),
    },
    { onConflict: 'wallet_address,badge_ref' }
  )
  if (upsertErr) {
    console.error('Error guardando certificado:', upsertErr.message)
    // No fallamos la response, el NFT ya está on-chain.
  }

  return res.status(200).json({
    ok: true,
    tokenId,
    txHash,
    pumaTxHash,
    badgeRef,
  })
}
