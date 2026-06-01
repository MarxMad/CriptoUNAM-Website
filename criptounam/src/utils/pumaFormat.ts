import { formatEther } from 'viem'

/** Muestra PUMA legible (sin redondear 5000 → 5000.00 mal). */
export function formatPumaAmount(wei: bigint | undefined | null): string {
  if (wei === undefined || wei === null) return '—'
  const raw = formatEther(wei)
  const n = Number(raw)
  if (!Number.isFinite(n)) return raw
  if (Math.abs(n) < 1e-9) return '0'
  if (Math.abs(n - Math.round(n)) < 1e-6) {
    return Math.round(n).toLocaleString('es-MX')
  }
  return n.toLocaleString('es-MX', { maximumFractionDigits: 4 })
}
