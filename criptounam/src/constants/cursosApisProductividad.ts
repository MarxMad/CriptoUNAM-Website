import type { Curso } from './cursosData'
import { IMAGES } from './images'

/**
 * Tanda 2 · APIs financieras + productividad dev
 * 6 cursos: Bitso API, Etherfuse API, Criptografía aplicada,
 * Arquitectura de sistemas Web3, Claude para devs, Vibecoding.
 * Cada curso tiene 3 lecciones con guía + cuestionario.
 * Los videos son placeholders (reemplazar por contenido oficial CriptoUNAM).
 */

const VIDEO_PLACEHOLDER = 'https://www.youtube.com/embed/SSo_EIwHSd4'

/* ============================================================
   CURSO · API de Bitso (on/off-ramp MX)
   ============================================================ */
const cursoBitsoApi: Curso = {
  id: 'bitso-api',
  titulo: 'API de Bitso: trading y on/off-ramp MX',
  nivel: 'Intermedio',
  duracion: '2 semanas',
  imagen: IMAGES.CURSOS.BITSO,
  descripcion:
    'Conecta tu app al exchange mexicano de cripto líder. Autenticación HMAC, libro de órdenes, place_order y SPEI para mover MXN ↔ cripto.',
  precio: 0,
  precioPuma: 1500,
  cohorteRef: 'v1',
  estudiantes: 0,
  rating: 5,
  categorias: ['Bitso', 'APIs', 'Trading', 'Finanzas', 'México'],
  requisitos: 'Programación básica (Node.js o Python), entender qué es un exchange.',
  lecciones: [
    {
      id: 1,
      titulo: 'Cuenta, API keys y firma HMAC',
      descripcion: 'Crear credenciales y firmar requests autenticados.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 1. Autenticación en Bitso

La API REST de Bitso vive en \`https://api.bitso.com/v3\`. Hay endpoints **públicos** (libro, ticker, trades) y **privados** (balances, órdenes, retiros). Los privados se firman con **HMAC-SHA256**.

### Crear tus keys

1. En tu cuenta Bitso → **Perfil → API**.
2. Crea una **API Key** con scopes mínimos (principio de menor privilegio): solo \`view\` y \`orders\` si no necesitas retiros.
3. Guardas **api_key** y **api_secret**. El secret solo se ve una vez.

### Firma del request

\`\`\`js
import crypto from 'crypto'

function sign(method, path, body, secret) {
  const nonce = Date.now()
  const message = \`\${nonce}\${method}\${path}\${body ?? ''}\`
  const signature = crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex')
  return { nonce, signature }
}

const { nonce, signature } = sign('GET', '/v3/balance/', '', SECRET)
const auth = \`Bitso \${API_KEY}:\${nonce}:\${signature}\`
\`\`\`

Pones \`auth\` en el header \`Authorization\`. Si la firma o el nonce no coinciden, recibes 401.

### Errores comunes

- **0301**: nonce inválido. Usa \`Date.now()\` y no recicles.
- **0303**: firma inválida. Revisa que firmes \`method + path + body\` en ese orden, sin espacios.
- **0102**: scope insuficiente. Habilita el permiso desde el panel.`,
      cuestionario: [
        {
          pregunta: '¿Qué algoritmo se usa para firmar los requests privados de Bitso?',
          opciones: ['HMAC-SHA256', 'RSA-2048', 'ECDSA secp256k1', 'AES-256'],
          correcta: 0,
        },
        {
          pregunta: '¿Qué campos forman el mensaje a firmar?',
          opciones: [
            'Solo el path',
            'nonce + method + path + body',
            'api_key + secret',
            'Solo el body',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué error indica "scope insuficiente" en la API key?',
          opciones: ['0301', '0303', '0102', '0500'],
          correcta: 2,
        },
        {
          pregunta: '¿Por qué Date.now() es típicamente válido como nonce?',
          opciones: [
            'Porque es secreto',
            'Porque crece monotónicamente y no se repite entre requests',
            'Porque el servidor lo ignora',
            'No lo es; hay que usar UUID',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Dónde NUNCA deberías exponer tu api_secret?',
          opciones: [
            'En el front (cualquier código que ejecute el navegador del usuario)',
            'En el backend',
            'En variables de entorno del servidor',
            'En un secret manager',
          ],
          correcta: 0,
        },
      ],
    },
    {
      id: 2,
      titulo: 'Endpoints de trading: book, trades, place_order',
      descripcion: 'Leer mercado y ejecutar órdenes desde tu código.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 2. Trading

### Order book

\`\`\`http
GET /v3/order_book/?book=btc_mxn&aggregate=true
\`\`\`

Devuelve \`bids\` y \`asks\`. Cada nivel tiene \`price\`, \`amount\` y (sin agregar) \`oid\`.

### Trades recientes

\`\`\`http
GET /v3/trades/?book=btc_mxn&limit=25
\`\`\`

Útil para reconstruir series para gráficas, calcular VWAP, etc.

### Colocar orden

\`\`\`js
const body = JSON.stringify({
  book: 'btc_mxn',
  side: 'buy',         // 'buy' | 'sell'
  type: 'limit',       // 'market' | 'limit'
  major: '0.001',      // cantidad en BTC
  price: '1200000',    // MXN por BTC (limit)
})

await fetch('https://api.bitso.com/v3/orders/', {
  method: 'POST',
  headers: {
    Authorization: auth,
    'Content-Type': 'application/json',
  },
  body,
})
\`\`\`

Respuesta: \`{ oid }\` que puedes usar para cancelar (\`DELETE /v3/orders/<oid>\`) o consultar (\`GET /v3/orders/<oid>\`).

### Rate limits

Por default: **60 req/min** en privados, **240** en públicos. Si excedes, recibes \`429\`. Implementa **backoff exponencial** y respeta el header \`X-RateLimit-Remaining\`.`,
      cuestionario: [
        {
          pregunta: '¿Qué endpoint devuelve el libro de órdenes en Bitso?',
          opciones: [
            'GET /v3/orders',
            'GET /v3/order_book/?book=btc_mxn',
            'POST /v3/book',
            'GET /v3/depth',
          ],
          correcta: 1,
        },
        {
          pregunta: 'Para una orden tipo `market`, ¿qué campo se vuelve opcional?',
          opciones: ['side', 'book', 'price', 'major'],
          correcta: 2,
        },
        {
          pregunta: '¿Qué status HTTP indica que te pasaste del rate limit?',
          opciones: ['401', '404', '429', '500'],
          correcta: 2,
        },
        {
          pregunta: '¿Qué campo de la respuesta del POST /v3/orders identifica la orden creada?',
          opciones: ['order_id', 'oid', 'tx_hash', 'cid'],
          correcta: 1,
        },
        {
          pregunta: '¿Cuál es una práctica adecuada al recibir un 429 (rate limit)?',
          opciones: [
            'Reintentar inmediatamente sin esperar',
            'Implementar backoff exponencial y respetar el header X-RateLimit-Remaining',
            'Cambiar de API key',
            'Llamar al endpoint en otro región',
          ],
          correcta: 1,
        },
      ],
    },
    {
      id: 3,
      titulo: 'Funding: SPEI in/out, retiros cripto y webhooks',
      descripcion: 'Cómo mover MXN ↔ cripto desde tu integración.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 3. Funding

### Depósito MXN vía SPEI

Cuando un usuario quiere depositar pesos:

1. Llamas a \`GET /v3/funding_destination/?fund_currency=mxn\` → recibes **CLABE + concepto**.
2. El usuario hace la transferencia SPEI con ese concepto.
3. En cuanto Bitso lo concilia, tu balance MXN sube.

### Retiro SPEI

\`\`\`js
POST /v3/spei_withdrawal/
{
  "amount": "5000.00",
  "recipient_given_names": "Juan",
  "recipient_family_names": "Pérez",
  "clabe": "002180078901234567",
  "notes_ref": "Pago factura 123",
  "numeric_ref": "9999"
}
\`\`\`

### Retiro cripto

\`\`\`js
POST /v3/crypto_withdrawal/
{ "currency": "btc", "amount": "0.002", "address": "bc1q..." }
\`\`\`

Bitso aplica un check **AML/Travel Rule**: si la dirección no está KYC-verificada y el monto supera cierto umbral, el retiro queda pendiente.

### Webhooks

Para no hacer polling, configura un **webhook URL**. Bitso te firma callbacks de:

- \`trade_executed\`
- \`funding\` (depósito completado)
- \`withdrawal\` (retiro completado)

Verifica la firma del callback igual que la del request (HMAC sobre el body con tu secret).`,
      cuestionario: [
        {
          pregunta: '¿Qué información te devuelve `GET /v3/funding_destination`?',
          opciones: [
            'Tu balance disponible',
            'Una CLABE y concepto para que el usuario haga SPEI',
            'El libro de órdenes',
            'Las tarifas vigentes',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Por qué un retiro cripto puede quedar pendiente?',
          opciones: [
            'Por mal humor del API',
            'Por chequeo AML / Travel Rule',
            'Por falta de gas',
            'Porque Bitso no opera cripto',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Para qué sirven los webhooks de Bitso?',
          opciones: [
            'Para enviar SMS',
            'Para recibir notificaciones de eventos sin hacer polling',
            'Para autenticarte',
            'Para encriptar mensajes',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Cómo verificas que un callback de webhook viene realmente de Bitso?',
          opciones: [
            'Validando la firma HMAC sobre el body con tu secret',
            'Confiando en el header User-Agent',
            'Mirando la IP origen',
            'No se puede verificar',
          ],
          correcta: 0,
        },
        {
          pregunta: '¿Qué endpoint dispara un retiro fiat por SPEI?',
          opciones: [
            'POST /v3/spei_withdrawal/',
            'POST /v3/crypto_withdrawal/',
            'POST /v3/withdrawal',
            'POST /v3/fiat_send',
          ],
          correcta: 0,
        },
      ],
    },
  ],
  examenFinal: [
    {
      pregunta: '¿Qué autoriza al cliente a llamar a un endpoint privado de Bitso?',
      opciones: [
        'Un token Bearer estático',
        'El header Authorization con api_key + nonce + signature HMAC',
        'OAuth 2.0',
        'Una cookie de sesión',
      ],
      correcta: 1,
    },
    {
      pregunta: 'Si te equivocas en el orden de los campos al firmar, ¿qué error verás?',
      opciones: ['0102 (scope)', '0303 (firma inválida)', '0301 (nonce)', '0500 (server)'],
      correcta: 1,
    },
    {
      pregunta: '¿Por qué tu api_secret debe vivir en backend, no en front?',
      opciones: [
        'Por moda',
        'Porque exponerlo permite a cualquiera firmar requests con tu cuenta',
        'Para reducir gas',
        'No hace falta, es público',
      ],
      correcta: 1,
    },
    {
      pregunta: '¿Qué libro consultarías para tradear BTC contra pesos?',
      opciones: ['btc_usd', 'btc_mxn', 'eth_mxn', 'usd_mxn'],
      correcta: 1,
    },
    {
      pregunta: 'En un POST /v3/orders limit buy, ¿qué representa `price`?',
      opciones: [
        'El máximo que aceptas pagar por unidad del asset major',
        'La cantidad de fondos en quote',
        'El nonce',
        'El fee',
      ],
      correcta: 0,
    },
    {
      pregunta: '¿Qué hace Bitso después de que el usuario hace su SPEI con el concepto que te dieron?',
      opciones: [
        'Lo manda a un humano para conciliar',
        'Concilia automáticamente y acredita MXN al balance de tu cuenta',
        'Pide otro KYC',
        'Convierte a USD',
      ],
      correcta: 1,
    },
    {
      pregunta: '¿Cuál es la diferencia entre /spei_withdrawal y /crypto_withdrawal?',
      opciones: [
        'Una es fiat MXN, la otra es retiro de cripto a una dirección externa',
        'Ninguna, son alias',
        'Uno es público y otro privado',
        'Uno usa GET y otro POST',
      ],
      correcta: 0,
    },
    {
      pregunta: '¿Qué pasa si la dirección destino de un retiro cripto no está verificada vía KYC?',
      opciones: [
        'Se envía igual',
        'Puede quedar pendiente o bloqueado por chequeos AML/Travel Rule',
        'Se duplica',
        'Se devuelve a tu wallet local',
      ],
      correcta: 1,
    },
    {
      pregunta: '¿Para qué configuras webhooks en producción?',
      opciones: [
        'Para no hacer polling y enterarte de trade_executed, funding y withdrawal en tiempo real',
        'Para autenticar',
        'Para reducir latencia de orden',
        'Para evitar 429',
      ],
      correcta: 0,
    },
    {
      pregunta: '¿Cuál es un buen patrón para manejar el rate limit de Bitso?',
      opciones: [
        'Reintentar al instante hasta que pase',
        'Backoff exponencial con jitter y respetar X-RateLimit-Remaining',
        'Cambiar de IP',
        'Usar más threads',
      ],
      correcta: 1,
    },
  ],
}

/* ============================================================
   CURSO · API de Etherfuse (CETES tokenizados)
   ============================================================ */
const cursoEtherfuseApi: Curso = {
  id: 'etherfuse-api',
  titulo: 'API de Etherfuse: CETES tokenizados',
  nivel: 'Intermedio',
  duracion: '2 semanas',
  imagen: IMAGES.CURSOS.ETHERFUSE,
  descripcion:
    'Integra Stablebonds (CETES en cadena) en tu app. Comprar, redimir y mostrar yield real en pesos para tus usuarios.',
  precio: 0,
  precioPuma: 1500,
  cohorteRef: 'v1',
  estudiantes: 0,
  rating: 5,
  categorias: ['Etherfuse', 'APIs', 'Stablecoins', 'CETES', 'Finanzas', 'México'],
  requisitos: 'JavaScript/TypeScript. Si usas Solana, lo de la tanda anterior ayuda.',
  lecciones: [
    {
      id: 1,
      titulo: 'Stablebonds: CETES tokenizados',
      descripcion: 'Qué son MXNB, USTB y cómo funcionan los bonos en cadena.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 1. ¿Qué son los Stablebonds?

**Etherfuse** emite tokens respaldados por instrumentos de **deuda gubernamental** (CETES, Treasury Bills):

- **MXNB**: CETES mexicanos tokenizados en Solana. Acumula yield diariamente.
- **USTB**: T-Bills estadounidenses tokenizados.
- **CETES** se redimen 1:1 a MXN con Etherfuse como custodio regulado.

### Flujo conceptual

1. Tu usuario deposita MXN (vía Bitso, banco, etc.) → tú lo conviertes a MXNB.
2. MXNB **gana yield** automáticamente (rebasing o token-share según el modelo).
3. Cuando el usuario quiere salir, redimes MXNB → MXN.

### ¿Por qué importa?

- **Yield real**: ~9–11 % anual (depende de la subasta de CETES) sin riesgo de smart contract DeFi.
- **Composability**: usas MXNB como cualquier SPL token en Solana — collateral, swaps, pagos.
- **Regulado**: Etherfuse opera con licencia mexicana y custodia bancaria.

### Comparativa rápida

| Token  | Subyacente | Yield | Custodio |
|--------|------------|------:|----------|
| MXNB   | CETES MX   | ~10 % | Etherfuse |
| USTB   | T-Bills US |  ~5 % | Etherfuse |
| USDC   | Reservas USD | 0 %  | Circle    |`,
      cuestionario: [
        {
          pregunta: '¿Qué respalda al token MXNB?',
          opciones: ['Oro', 'CETES mexicanos', 'Bitcoin', 'Ethereum stakeado'],
          correcta: 1,
        },
        {
          pregunta: '¿En qué red corre principalmente MXNB?',
          opciones: ['Ethereum mainnet', 'Solana', 'Arbitrum', 'Polygon'],
          correcta: 1,
        },
        {
          pregunta: '¿Cómo se redime un Stablebond?',
          opciones: [
            'Pasando la wallet a otro usuario',
            '1:1 a la moneda fiat respaldo, con Etherfuse como custodio',
            'Tradeando en un DEX por USDC',
            'No se puede redimir',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué subyacente tiene USTB?',
          opciones: ['CETES mexicanos', 'T-Bills estadounidenses', 'BTC', 'Oro'],
          correcta: 1,
        },
        {
          pregunta: '¿Por qué MXNB suele ser preferible a USDC para usuarios mexicanos que ahorran?',
          opciones: [
            'Es más barato',
            'Devenga yield real (~9–11 %) y elimina riesgo cambiario MXN/USD',
            'Tiene mejor logo',
            'Es ilegal',
          ],
          correcta: 1,
        },
      ],
    },
    {
      id: 2,
      titulo: 'La SDK de Etherfuse: comprar y redimir',
      descripcion: 'Setup, KYC y operaciones básicas con el SDK JS.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 2. Etherfuse SDK

### Setup

\`\`\`bash
npm install @etherfuse/sdk
\`\`\`

\`\`\`ts
import { EtherfuseClient } from '@etherfuse/sdk'

const client = new EtherfuseClient({
  apiKey: process.env.ETHERFUSE_KEY!,
  env: 'production', // o 'sandbox'
})
\`\`\`

### KYC del usuario

Para que un usuario pueda comprar Stablebonds, primero pasa KYC:

\`\`\`ts
const session = await client.kyc.createSession({
  userId: 'user_123',
  redirectUrl: 'https://miapp.mx/callback',
})
window.location.href = session.url
\`\`\`

El usuario completa el flujo en hosted UI. Tu callback recibe \`{ userId, status }\`.

### Comprar MXNB

\`\`\`ts
const tx = await client.purchase.create({
  userId: 'user_123',
  token: 'MXNB',
  amount: 5000,         // en MXN
  destination: 'WALLET_PUBKEY',
})
// El usuario paga vía SPEI; al confirmarse, MXNB llega a su wallet.
\`\`\`

### Redimir

\`\`\`ts
const redemption = await client.redemption.create({
  userId: 'user_123',
  token: 'MXNB',
  amount: 2000,
  destination: { clabe: '002180078901234567', name: 'Juan Pérez' },
})
\`\`\``,
      cuestionario: [
        {
          pregunta: '¿Qué hace `client.kyc.createSession`?',
          opciones: [
            'Devuelve el balance del usuario',
            'Crea una sesión hosted para que el usuario complete KYC',
            'Quema tokens MXNB',
            'Manda un SMS',
          ],
          correcta: 1,
        },
        {
          pregunta: 'En `client.purchase.create`, ¿qué representa `amount`?',
          opciones: [
            'La cantidad en MXNB',
            'La cantidad en MXN que el usuario va a depositar',
            'El precio de mercado',
            'El nonce',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué entorno usas durante desarrollo?',
          opciones: ['production', 'sandbox', 'demo', 'devnet'],
          correcta: 1,
        },
      ],
    },
    {
      id: 3,
      titulo: 'Caso de uso: app de ahorro en pesos con yield',
      descripcion: 'Pieza por pieza: front + backend + Etherfuse + Bitso.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 3. App "AhorroMX"

Imaginemos una app que ofrece a un usuario mexicano:

> Deposita MXN, gana ~10 % anual, retira cuando quieras.

### Componentes

1. **Front (Next.js)**: login con email/wallet, dashboard con balance y yield.
2. **Backend (Node/Bun)**: hosting de keys de Etherfuse + Bitso (¡nunca expuestas al cliente!).
3. **Etherfuse**: para convertir MXN → MXNB y redimir.
4. **Bitso (opcional)**: si quieres además aceptar depósitos cripto y convertir a MXN antes.

### Flujo de depósito

1. Usuario aprieta "Depositar 1 000 MXN".
2. Front llama a tu backend → \`POST /deposit\`.
3. Backend llama a Etherfuse \`purchase.create\`.
4. Etherfuse devuelve datos SPEI (CLABE/concepto).
5. Backend los manda al front; usuario hace la transferencia desde su banca.
6. Webhook de Etherfuse confirma → backend marca depósito como exitoso → MXNB en la wallet custodial del user.

### Mostrar yield

MXNB tiene **rebasing**: el balance crece solo. En tu UI:

\`\`\`ts
const balance = await connection.getTokenAccountBalance(ATA)
// Calcula yield comparando con el snapshot inicial guardado en tu DB.
\`\`\`

### Riesgos a comunicar

- **No es FDIC/IPAB** clásico (aunque tiene custodia regulada).
- **El yield depende** de la tasa de CETES vigente.
- **Tiempos SPEI**: instantáneo en horario hábil, hasta 24 h fuera.`,
      cuestionario: [
        {
          pregunta: '¿Dónde deben vivir las API keys de Etherfuse y Bitso?',
          opciones: [
            'En el front, dentro de variables `NEXT_PUBLIC_*`',
            'En el backend, nunca expuestas al cliente',
            'En el contrato',
            'En el localStorage del usuario',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Cómo refleja MXNB el yield acumulado?',
          opciones: [
            'Mandando un airdrop semanal',
            'Mediante rebasing: el balance crece automáticamente',
            'Hay que reclamar manual cada mes',
            'No genera yield',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué evento detecta que el SPEI del usuario llegó?',
          opciones: [
            'Polling cada segundo a Etherfuse',
            'El webhook de Etherfuse que confirma el depósito',
            'Un push notification de Bitso',
            'Un email manual',
          ],
          correcta: 1,
        },
      ],
    },
  ],
}

/* ============================================================
   CURSO · Criptografía aplicada
   ============================================================ */
const cursoCriptografia: Curso = {
  id: 'criptografia-aplicada',
  titulo: 'Criptografía aplicada para Web3',
  nivel: 'Intermedio',
  duracion: '4 semanas',
  imagen: IMAGES.CURSOS.CRIPTOGRAFIA,
  descripcion:
    'Las primitivas detrás de toda blockchain: hashes, árboles de Merkle, firmas digitales (ECDSA, Ed25519) y una intro práctica a zero-knowledge proofs.',
  precio: 0,
  precioPuma: 1500,
  cohorteRef: 'v1',
  estudiantes: 0,
  rating: 5,
  categorias: ['Criptografía', 'Fundamentos', 'Seguridad', 'Tecnología'],
  requisitos: 'Programación básica. Algunas matemáticas (mod, exponentes) ayudan pero no son obligatorias.',
  lecciones: [
    {
      id: 1,
      titulo: 'Funciones hash y árboles de Merkle',
      descripcion: 'La pieza central de bloques, integridad y airdrops.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 1. Hashes y Merkle

Una **función hash criptográfica** mapea cualquier entrada a una salida de tamaño fijo. Las propiedades clave:

- **Determinista**: misma entrada → mismo hash.
- **Resistente a pre-imagen**: dado h, no se puede obtener x tal que H(x) = h.
- **Resistente a colisiones**: no es factible encontrar x ≠ y con H(x) = H(y).
- **Efecto avalancha**: cambiar 1 bit cambia ~50 % de la salida.

Los más usados:

- **SHA-256**: Bitcoin, Ethereum (block headers).
- **Keccak-256**: Ethereum (smart contracts, EVM, addresses).
- **Blake2/3**: Solana, Filecoin.

### Árbol de Merkle

Combina N hashes en uno solo en \`log(N)\` pasos:

\`\`\`
     root
    /    \\
   h12    h34
  /  \\   /  \\
 h1  h2 h3  h4
\`\`\`

Útil porque puedes **probar** que un elemento está en el conjunto sin enseñar el conjunto completo: solo das el camino de hermanos (Merkle proof). Ejemplos:

- **Airdrops**: en lugar de subir 100 000 addresses al contrato (caro), subes la root y cada usuario prueba su inclusión.
- **Bitcoin**: los block headers contienen el Merkle root de todas las tx del bloque.`,
      cuestionario: [
        {
          pregunta: '¿Qué propiedad asegura que cambiar 1 bit cambia mucho la salida?',
          opciones: [
            'Determinismo',
            'Efecto avalancha',
            'Resistencia a colisiones',
            'Pre-imagen',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué hash usa Ethereum para direcciones y EVM?',
          opciones: ['SHA-256', 'Keccak-256', 'MD5', 'Blake2'],
          correcta: 1,
        },
        {
          pregunta: 'En un airdrop con Merkle, ¿qué publica el contrato?',
          opciones: [
            'La lista completa de addresses',
            'Solo el root del árbol',
            'Las firmas de todos los usuarios',
            'Nada',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué prueba aporta cada usuario en un airdrop con Merkle?',
          opciones: [
            'Su clave privada',
            'El camino de hashes de hermanos (Merkle proof) desde su address hasta el root',
            'Una firma digital',
            'Nada, basta su address',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Cuál NO es propiedad de una función hash criptográfica?',
          opciones: [
            'Determinismo',
            'Resistencia a colisiones',
            'Reversibilidad eficiente (recuperar entrada desde el hash)',
            'Efecto avalancha',
          ],
          correcta: 2,
        },
      ],
    },
    {
      id: 2,
      titulo: 'Firmas digitales: ECDSA y Ed25519',
      descripcion: 'Cómo prueba una wallet que controla una address.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 2. Firmas

Una **firma digital** te permite probar autoría de un mensaje sin revelar la clave privada.

### El esquema básico

1. **Clave privada (sk)**: número secreto.
2. **Clave pública (pk)**: derivada de sk en una curva elíptica.
3. **Firmar(m, sk)** → \`(r, s)\` (ECDSA) o \`(R, s)\` (EdDSA).
4. **Verificar(m, sig, pk)** → true/false.

### ECDSA (secp256k1)

- Usado por **Bitcoin** y **Ethereum**.
- Curva: \`y² = x³ + 7\`.
- En Ethereum, la **address** es los últimos 20 bytes de \`Keccak-256(pk_no_prefix)\`.
- Vulnerabilidad clásica: si reusas el mismo nonce en dos firmas, **se extrae sk**. (Sí, le pasó a Sony con la PS3.)

### Ed25519

- Usado por **Solana**, **Stellar**, **Sui**, **Cosmos**.
- Curva edwards25519.
- Determinístico (no requiere RNG seguro al firmar) → más resistente a fallos de implementación.

### En Solidity

\`\`\`solidity
// Verifica firma de un mensaje EIP-191
address signer = ecrecover(
  keccak256(abi.encodePacked("\\x19Ethereum Signed Message:\\n32", hash)),
  v, r, s
);
require(signer == expectedSigner, "bad sig");
\`\`\`

Esa es la base de **EIP-712** (firmas tipadas usadas en Permit, OpenSea, etc.).`,
      cuestionario: [
        {
          pregunta: '¿Qué curva usa Ethereum?',
          opciones: ['edwards25519', 'secp256k1', 'P-256', 'BLS12-381'],
          correcta: 1,
        },
        {
          pregunta: 'En Ethereum, la address de un EOA es:',
          opciones: [
            'La clave pública completa',
            'Los últimos 20 bytes de keccak256(pubkey)',
            'El hash SHA-256 del email',
            'Una UUID asignada',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué ventaja práctica tiene Ed25519 sobre ECDSA?',
          opciones: [
            'Es más rápido siempre, sin trade-offs',
            'Es determinístico al firmar, menos propenso a fallos de RNG',
            'Tiene firmas más cortas',
            'Permite firmar a la vez varios mensajes con la misma firma',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué pasa si reusas el mismo nonce en dos firmas ECDSA distintas?',
          opciones: [
            'Nada, el protocolo lo soporta',
            'Se puede recuperar la clave privada a partir de las dos firmas',
            'Te bloquean la wallet',
            'Falla la verificación',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué redes usan principalmente Ed25519 para sus firmas?',
          opciones: [
            'Bitcoin y Ethereum',
            'Solana, Stellar, Sui, Cosmos',
            'Solo Bitcoin',
            'Polygon y Arbitrum',
          ],
          correcta: 1,
        },
      ],
    },
    {
      id: 3,
      titulo: 'Zero-knowledge proofs: zk-SNARK intuitivo',
      descripcion: 'Probar algo sin revelarlo: la magia detrás de zkSync, Aztec y Tornado Cash.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 3. Zero-Knowledge

Un **ZK proof** te deja probar que **sabes** algo (o que un cómputo se ejecutó correctamente) **sin revelar** los datos sensibles. Tres propiedades:

- **Completeness**: si el statement es cierto, el verificador acepta.
- **Soundness**: si es falso, no puedes engañar al verificador (salvo probabilidad despreciable).
- **Zero-knowledge**: el verificador no aprende nada más allá del statement.

### zk-SNARK

**Succinct Non-interactive Argument of Knowledge**. La prueba es pequeña (~200 bytes) y se verifica rápido, aunque generarla es caro. Usos:

- **Rollups (zkSync, Scroll, Polygon zkEVM)**: prueban que una batch de tx es válida.
- **Privacidad (Aztec, Tornado Cash)**: prueban "tengo derecho a retirar X" sin enseñar la cuenta.
- **Identidad (Worldcoin, zkPassport)**: prueban "soy humano" sin revelar quién.

### Flujo conceptual

1. Escribes tu lógica como un **circuito** (en Circom, Cairo, Noir, Halo2).
2. Compilas el circuito → \`prover key\` y \`verifier key\`.
3. Generas la prueba con \`prover key + witness (datos privados)\`.
4. Verificas con \`verifier key + public inputs\` → boolean.

### Trade-offs

| Sistema  | Trusted setup | Tamaño prueba | Tiempo prove | Tiempo verify |
|----------|:-------------:|---------------:|-------------:|--------------:|
| Groth16  | Sí (por circuito) | ~200 B  | medio | super rápido |
| PLONK    | Sí (universal) | ~500 B | lento | rápido |
| STARK    | No            | ~50 KB  | lento | medio |

### Hola mundo (Circom)

\`\`\`circom
template Multiplier() {
  signal input a;
  signal input b;
  signal output c;
  c <== a * b;
}
component main = Multiplier();
\`\`\`

Si revelas \`c = 35\` pero quieres ocultar que \`a = 5, b = 7\`, el circuito te genera una prueba de que conoces \`a, b\` con \`a*b = c\`.`,
      cuestionario: [
        {
          pregunta: '¿Qué propiedad garantiza que NO puedes engañar al verificador con una afirmación falsa?',
          opciones: ['Completeness', 'Soundness', 'Zero-knowledge', 'Determinism'],
          correcta: 1,
        },
        {
          pregunta: '¿Qué sistema NO requiere trusted setup?',
          opciones: ['Groth16', 'PLONK', 'STARK', 'BLS12-381'],
          correcta: 2,
        },
        {
          pregunta: '¿Para qué se usan los zk-SNARKs en rollups?',
          opciones: [
            'Para mining',
            'Para probar que un batch de tx es válido sin re-ejecutarlas en L1',
            'Para encriptar transacciones',
            'Para gobernanza',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué significa que una prueba sea "succinct" en un SNARK?',
          opciones: [
            'Es de tamaño pequeño y rápida de verificar',
            'Está cifrada',
            'No es interactiva',
            'Es opcional',
          ],
          correcta: 0,
        },
        {
          pregunta: 'En el flujo de un circuito ZK (Circom/Noir), ¿qué representa el "witness"?',
          opciones: [
            'La prueba pública',
            'Los datos privados conocidos por el prover que satisfacen el circuito',
            'El verifier key',
            'El gas pagado',
          ],
          correcta: 1,
        },
      ],
    },
  ],
  examenFinal: [
    {
      pregunta: '¿Qué propiedad asegura que dos entradas no produzcan el mismo hash con probabilidad razonable?',
      opciones: ['Determinismo', 'Resistencia a colisiones', 'Pre-imagen', 'Efecto avalancha'],
      correcta: 1,
    },
    {
      pregunta: '¿Por qué Bitcoin usa SHA-256 dos veces en muchos lugares en lugar de una?',
      opciones: [
        'Para reducir la latencia',
        'Como defensa adicional contra ataques de extensión y para robustez',
        'Por moda',
        'Para reducir el tamaño',
      ],
      correcta: 1,
    },
    {
      pregunta: '¿Qué guarda el block header de Bitcoin para verificar las tx del bloque?',
      opciones: ['La lista completa de tx', 'Solo el Merkle root de las tx', 'Solo el coinbase', 'Nada'],
      correcta: 1,
    },
    {
      pregunta: '¿Cómo se relaciona la clave pública con la address en Ethereum?',
      opciones: [
        'Es idéntica',
        'address = últimos 20 bytes de keccak256(pubkey sin prefijo)',
        'address = SHA256(pubkey)',
        'Es una UUID aleatoria',
      ],
      correcta: 1,
    },
    {
      pregunta: '¿Cuál es el riesgo de un RNG débil al firmar con ECDSA?',
      opciones: [
        'No hay riesgo',
        'Nonces predecibles o repetidos pueden filtrar la clave privada',
        'Más gas',
        'Falla la verificación',
      ],
      correcta: 1,
    },
    {
      pregunta: '¿Qué red usa principalmente Ed25519 en lugar de secp256k1?',
      opciones: ['Ethereum', 'Solana', 'Bitcoin', 'Polygon'],
      correcta: 1,
    },
    {
      pregunta: '¿Para qué sirve EIP-712 en Ethereum?',
      opciones: [
        'Estandarizar firmas tipadas seguras y legibles para los usuarios',
        'Cambiar el algoritmo de hash',
        'Reducir gas',
        'Verificar contratos',
      ],
      correcta: 0,
    },
    {
      pregunta: '¿Qué propiedad ZK te permite probar algo sin revelar los datos privados?',
      opciones: ['Soundness', 'Completeness', 'Zero-knowledge', 'Determinismo'],
      correcta: 2,
    },
    {
      pregunta: 'Entre estos sistemas, ¿cuál tiene prueba más grande y NO requiere trusted setup?',
      opciones: ['Groth16', 'PLONK', 'STARK', 'BLS12-381 signature'],
      correcta: 2,
    },
    {
      pregunta: '¿Para qué cuál de estos casos NO se usaría un ZK proof?',
      opciones: [
        'Probar inclusión de una address en un airdrop privado',
        'Validar un batch entero de tx (rollup zk)',
        'Calcular más rápido un hash SHA-256',
        'Probar que eres humano sin revelar identidad',
      ],
      correcta: 2,
    },
  ],
}

/* ============================================================
   CURSO · Arquitectura de sistemas Web3
   ============================================================ */
const cursoArquitectura: Curso = {
  id: 'arquitectura-sistemas-web3',
  titulo: 'Arquitectura de sistemas Web3',
  nivel: 'Avanzado',
  duracion: '4 semanas',
  imagen: IMAGES.CURSOS.ARQUITECTURA,
  descripcion:
    'Diseñar un sistema Web3 real: front, contratos, indexer, oráculos, RPC redundante y monitoreo. Lo que separa un demo de una app en producción.',
  precio: 0,
  precioPuma: 5000,
  cohorteRef: 'v1',
  estudiantes: 0,
  rating: 5,
  categorias: ['Arquitectura', 'Backend', 'Indexers', 'Oráculos', 'Desarrollo'],
  requisitos: 'Haber construido una dApp básica. Saber qué es una API REST.',
  lecciones: [
    {
      id: 1,
      titulo: 'Anatomía de una dApp en producción',
      descripcion: 'Más allá del contrato: front, backend, RPC, monitoreo.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 1. Anatomía completa

Una dApp seria casi nunca es **solo** un contrato más un front. La arquitectura típica:

\`\`\`
[ Front (Next.js) ] ── via wagmi/viem ──► [ Smart Contract ]
        │                                       │
        ▼                                       ▼
[ Backend / API ]                       [ Indexer (Graph/Ponder) ]
        │                                       │
        └────────► [ DB (Postgres) ] ◄──────────┘
                          │
                          ▼
                  [ Cache (Redis) ]
\`\`\`

### Responsabilidades

- **Smart contract**: lógica autoritativa de estado y dinero.
- **Indexer**: traduce eventos on-chain en queries rápidas (lo que un \`getLogs\` no escala).
- **Backend**: orquesta KYC, integraciones (Bitso, Etherfuse, Stripe), notificaciones, lógica que no debe vivir on-chain.
- **Front**: UX, firmas, lecturas rápidas.
- **DB/Cache**: para todo lo que el indexer ya dejó listo + datos off-chain del usuario.

### RPC: nunca uno solo

El RPC público de Infura/Alchemy a veces falla. En producción usa **al menos 2** y un health check. Tools: \`viem\` permite \`fallback([http(infura), http(alchemy)])\`.`,
      cuestionario: [
        {
          pregunta: '¿Cuál es la responsabilidad principal de un indexer?',
          opciones: [
            'Firmar transacciones',
            'Traducir eventos on-chain a queries rápidas',
            'Almacenar las claves privadas',
            'Hacer mining',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Por qué usar más de un RPC en producción?',
          opciones: [
            'Por marketing',
            'Para tener fallback si uno se cae o limita',
            'Para que el contrato firme más rápido',
            'Para bajar fees',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué lógica NO debería vivir on-chain?',
          opciones: [
            'Transferencias del token nativo del protocolo',
            'KYC del usuario o credenciales de APIs',
            'Reglas de gobernanza',
            'Custody del fondo',
          ],
          correcta: 1,
        },
      ],
    },
    {
      id: 2,
      titulo: 'Indexers: The Graph, Ponder, Subsquid',
      descripcion: 'Cómo modelar entidades y exponer queries GraphQL/SQL.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 2. Indexers

### The Graph

El más conocido. Defines un **subgraph**:

\`\`\`yaml
# subgraph.yaml
dataSources:
  - kind: ethereum/contract
    name: MyToken
    network: arbitrum-one
    source:
      address: '0x...'
      abi: MyToken
      startBlock: 12345678
    mapping:
      eventHandlers:
        - event: Transfer(indexed address,indexed address,uint256)
          handler: handleTransfer
\`\`\`

\`\`\`ts
// mapping.ts
export function handleTransfer(event: Transfer): void {
  let balance = Balance.load(event.params.to.toHexString())
  if (!balance) balance = new Balance(event.params.to.toHexString())
  balance.amount = balance.amount.plus(event.params.value)
  balance.save()
}
\`\`\`

Consultas:

\`\`\`graphql
{ balances(first: 10, orderBy: amount, orderDirection: desc) { id amount } }
\`\`\`

### Ponder

Alternativa moderna, full TypeScript, postgres en lugar de IPFS:

\`\`\`ts
import { ponder } from '@/generated'
ponder.on('MyToken:Transfer', async ({ event, context }) => {
  await context.db.Balance.upsert({
    id: event.args.to,
    create: { amount: event.args.value },
    update: ({ current }) => ({ amount: current.amount + event.args.value }),
  })
})
\`\`\`

### Cuándo usar cuál

- **Subgraph hosted**: rápido empezar, descentralización gradual, paga por queries.
- **Ponder**: prefiere TS, manejas tu propio infra, queries SQL/REST a Postgres.
- **Subsquid**: similar a Ponder, foco en performance para chains exóticas.`,
      cuestionario: [
        {
          pregunta: '¿En qué lenguaje se escriben las mappings de The Graph?',
          opciones: ['JavaScript puro', 'AssemblyScript', 'Python', 'Rust'],
          correcta: 1,
        },
        {
          pregunta: '¿Qué ventaja ofrece Ponder vs The Graph?',
          opciones: [
            'Solo soporta Ethereum L1',
            'Full TypeScript y Postgres con queries SQL/REST',
            'No necesita ABI',
            'Es gratis siempre',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué le pasa a tu app si NO usas un indexer y consultas eventos directo al RPC?',
          opciones: [
            'Nada, es igual de rápido',
            'Eventualmente te bloquean por límites y queries lentas con rangos grandes',
            'Pierdes la firma',
            'No puedes leer balances',
          ],
          correcta: 1,
        },
      ],
    },
    {
      id: 3,
      titulo: 'Oráculos y mensajería cross-chain',
      descripcion: 'Chainlink, Pyth, LayerZero, CCIP y cuándo elegir cada uno.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 3. Oráculos + cross-chain

Tu contrato es **determinista** y vive aislado. Si necesita el precio de ETH o ejecutar acciones en otra chain, no puede consultar URLs por sí mismo. Para eso existen los oráculos.

### Oráculos de precio

- **Chainlink**: el más usado. Modelo pull: tú lees \`AggregatorV3Interface.latestRoundData()\` y obtienes el último precio publicado por validadores.
- **Pyth**: pull-based pero el usuario manda el price update en la misma tx (más fresco). Usado intensamente en Solana y EVM modernos.
- **Redstone**: similar a Pyth, modelo lazy.

\`\`\`solidity
AggregatorV3Interface priceFeed =
  AggregatorV3Interface(0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419); // ETH/USD mainnet
(, int price, , , ) = priceFeed.latestRoundData();
\`\`\`

### Mensajería cross-chain

Cuando necesitas mover **datos o tokens** entre chains:

- **LayerZero**: lighter, modelo de DVNs (Decentralized Verifier Networks).
- **Chainlink CCIP**: foco en enterprise y bancos.
- **Wormhole**: muy usado por Solana ↔ EVM.
- **Axelar**: general purpose, GMP (General Message Passing).

### Trade-offs

Cada bridge añade **superficie de ataque**: los grandes hacks de cripto (Ronin, Wormhole, Nomad) fueron bridges. Reglas:

1. **No confíes en un solo bridge** para movimientos grandes.
2. **Limita el daño** con rate limits y guardians.
3. **Audita** cada nueva integración cross-chain igual que un contrato.`,
      cuestionario: [
        {
          pregunta: '¿Por qué un contrato no puede consultar APIs por sí mismo?',
          opciones: [
            'Porque sería caro',
            'Porque rompe el determinismo y la verificabilidad',
            'Porque Solidity no lo soporta',
            'Sí puede, sin restricciones',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Cuál es la diferencia entre Chainlink y Pyth?',
          opciones: [
            'Chainlink es para Solana, Pyth para EVM',
            'Pyth usa pull on-tx (precio fresco enviado en la tx), Chainlink usa pull con precio ya publicado',
            'Pyth es centralizado, Chainlink no',
            'No hay diferencia',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué riesgo principal añade un bridge a tu sistema?',
          opciones: [
            'Mayor superficie de ataque y dependencia de su seguridad',
            'Bajo throughput',
            'Mayor latencia DNS',
            'Necesita Solidity ≥ 0.9',
          ],
          correcta: 0,
        },
      ],
    },
  ],
}

/* ============================================================
   CURSO · Claude para desarrolladores
   ============================================================ */
const cursoClaude: Curso = {
  id: 'claude-para-devs',
  titulo: 'Claude para desarrolladores',
  nivel: 'Intermedio',
  duracion: '3 semanas',
  imagen: IMAGES.CURSOS.CLAUDE,
  descripcion:
    'API de Claude (Anthropic), tool use, prompt caching, batches y el SDK de agentes. Desde el primer call hasta agentes que ejecutan código.',
  precio: 0,
  precioPuma: 1500,
  cohorteRef: 'v1',
  estudiantes: 0,
  rating: 5,
  categorias: ['Claude', 'IA', 'Anthropic', 'APIs', 'Desarrollo'],
  requisitos: 'JavaScript/TypeScript o Python. Familiaridad con APIs REST.',
  lecciones: [
    {
      id: 1,
      titulo: 'Claude API: tu primer mensaje',
      descripcion: 'Setup, llamadas básicas y modelos disponibles.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 1. Primer call

### Setup

\`\`\`bash
npm install @anthropic-ai/sdk
# o
pip install anthropic
\`\`\`

Variable de entorno: \`ANTHROPIC_API_KEY\`. La obtienes en [console.anthropic.com](https://console.anthropic.com).

### Mensaje básico

\`\`\`ts
import Anthropic from '@anthropic-ai/sdk'
const client = new Anthropic()

const msg = await client.messages.create({
  model: 'claude-opus-4-7',
  max_tokens: 1024,
  messages: [
    { role: 'user', content: 'Explícame qué es un Merkle tree en 3 frases.' },
  ],
})
console.log(msg.content[0].type === 'text' ? msg.content[0].text : '')
\`\`\`

### Modelos vigentes

| Modelo                       | Foco                              | Costo relativo |
|------------------------------|-----------------------------------|---------------:|
| \`claude-opus-4-7\`         | Razonamiento, código complejo      | 💰💰💰       |
| \`claude-sonnet-4-6\`       | Balance calidad/precio             | 💰💰         |
| \`claude-haiku-4-5-20251001\` | Rápido, barato, latencia baja    | 💰           |

### Tips iniciales

- **\`max_tokens\`** es **output**. La entrada se cobra aparte.
- **\`system\`**: instrucciones de alto nivel (rol, formato).
- **Streaming**: \`client.messages.stream(...)\` para UI tipo chat.`,
      cuestionario: [
        {
          pregunta: '¿En qué variable de entorno espera el SDK encontrar la API key?',
          opciones: ['CLAUDE_KEY', 'ANTHROPIC_API_KEY', 'AI_KEY', 'OPENAI_API_KEY'],
          correcta: 1,
        },
        {
          pregunta: '¿Qué representa `max_tokens` en `messages.create`?',
          opciones: [
            'Tokens totales (input + output)',
            'Solo tokens de salida (output)',
            'Solo tokens de entrada',
            'Número de mensajes en el historial',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué modelo elegirías para latencia baja y costo bajo?',
          opciones: ['claude-opus-4-7', 'claude-sonnet-4-6', 'claude-haiku-4-5-20251001', 'gpt-4'],
          correcta: 2,
        },
      ],
    },
    {
      id: 2,
      titulo: 'Tool use, prompt caching y batches',
      descripcion: 'Cómo conectar Claude a tu mundo y bajar costos drásticamente.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 2. Features clave

### Tool use

Le das a Claude la lista de funciones que puede llamar. Él decide cuándo invocarlas.

\`\`\`ts
const msg = await client.messages.create({
  model: 'claude-opus-4-7',
  max_tokens: 1024,
  tools: [
    {
      name: 'get_price',
      description: 'Devuelve el precio actual de un token',
      input_schema: {
        type: 'object',
        properties: { symbol: { type: 'string' } },
        required: ['symbol'],
      },
    },
  ],
  messages: [{ role: 'user', content: '¿A cuánto está SOL?' }],
})
// Claude responde con un \`tool_use\`. Tú ejecutas, le devuelves el resultado, y sigue la conversación.
\`\`\`

### Prompt caching

Cachea bloques grandes (system prompts, documentos) y paga **90 % menos** en los hits.

\`\`\`ts
messages: [
  { role: 'user', content: [
    { type: 'text', text: BIG_CONTEXT, cache_control: { type: 'ephemeral' } },
    { type: 'text', text: 'Pregunta del usuario' },
  ]},
]
\`\`\`

Mínimo 1024 tokens cacheables (haiku) o 2048 (sonnet/opus). TTL: 5 minutos.

### Batches

Si tienes 10 000 prompts no urgentes, mándalos en batch: **50 % de descuento**, respuesta en < 24 h.

\`\`\`ts
await client.messages.batches.create({
  requests: [
    { custom_id: 'q1', params: { model: 'claude-sonnet-4-6', max_tokens: 512, messages: [...] }},
    // ...
  ],
})
\`\`\``,
      cuestionario: [
        {
          pregunta: '¿Para qué sirve `tools` en una request a Claude?',
          opciones: [
            'Cobra extra',
            'Le permite a Claude pedir que se ejecute una función externa',
            'Hace el modelo más rápido',
            'Encripta la respuesta',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué descuento aproximado da el prompt caching en cache hits?',
          opciones: ['10 %', '50 %', '90 %', '100 %'],
          correcta: 2,
        },
        {
          pregunta: '¿Cuándo usar la API de batches?',
          opciones: [
            'Cuando necesitas respuesta inmediata',
            'Cuando tienes muchos prompts no urgentes y quieres mitad de precio',
            'Cuando quieres usar streaming',
            'Nunca en producción',
          ],
          correcta: 1,
        },
      ],
    },
    {
      id: 3,
      titulo: 'Claude Code y Agent SDK',
      descripcion: 'De API a agente que edita repos y corre comandos.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 3. Claude Code + Agent SDK

### Claude Code (CLI)

Herramienta oficial que corre en tu terminal y opera tu repo: edita archivos, corre tests, hace commits, abre PRs.

\`\`\`bash
npm install -g @anthropic-ai/claude-code
cd mi-proyecto
claude
\`\`\`

Te abre un chat donde puedes pedir cosas como:

> "Implementa el endpoint POST /api/courses, agrega tests y un changelog."

Claude Code lee tu código, propone cambios, te pide permiso y aplica. Soporta:

- **Hooks**: scripts que se ejecutan en eventos (pre-commit, post-edit).
- **Slash commands**: comandos personalizados por proyecto en \`.claude/commands/\`.
- **MCP servers**: extensiones (Notion, Linear, Figma, etc.).

### Agent SDK

Si quieres tu propio agente con herramientas custom desde código:

\`\`\`ts
import { query } from '@anthropic-ai/claude-agent-sdk'

for await (const msg of query({
  prompt: 'Refactoriza este componente para usar wagmi v2.',
  options: { allowedTools: ['Read', 'Edit', 'Bash'] },
})) {
  console.log(msg)
}
\`\`\`

El Agent SDK encapsula:

- Bucle de tool use.
- Permisos por herramienta.
- Compactación automática de contexto cuando se llena.

### Buenas prácticas

- **Empieza con scope acotado** (un archivo o feature). Los agentes mejoran su salida si entienden el alcance.
- **Tests primero**: si los hay, el agente itera contra ellos. Mucho más confiable.
- **Permisos mínimos**: no le des \`Bash\` libre en producción.`,
      cuestionario: [
        {
          pregunta: '¿Qué hace Claude Code?',
          opciones: [
            'Es un IDE web',
            'Es una CLI oficial que opera tu repo: edita, corre tests, hace commits',
            'Es un browser extension',
            'Es un compilador',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué son los MCP servers?',
          opciones: [
            'Servidores RPC de Ethereum',
            'Extensiones que añaden herramientas a Claude Code (Notion, Linear, Figma…)',
            'Modelos de inferencia',
            'Servidores de email',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué herramienta limita las acciones que el agente puede hacer?',
          opciones: [
            'maxTokens',
            'allowedTools (en options del Agent SDK)',
            'apiVersion',
            'system prompt',
          ],
          correcta: 1,
        },
      ],
    },
  ],
}

/* ============================================================
   CURSO · Vibecoding
   ============================================================ */
const cursoVibecoding: Curso = {
  id: 'vibecoding',
  titulo: 'Vibecoding: programar con IA sin perder control',
  nivel: 'Principiante',
  duracion: '3 semanas',
  imagen: IMAGES.CURSOS.VIBECODING,
  descripcion:
    'Filosofía y práctica de programar con asistentes IA. Cómo describir intención, iterar y mantener calidad sin entender todo cada línea — pero sí lo importante.',
  precio: 0,
  precioPuma: 500,
  cohorteRef: 'v1',
  estudiantes: 0,
  rating: 5,
  categorias: ['Vibecoding', 'IA', 'Productividad', 'Desarrollo'],
  requisitos: 'Saber leer código básico. Curiosidad y disposición a iterar.',
  lecciones: [
    {
      id: 1,
      titulo: '¿Qué es vibecoding y por qué importa?',
      descripcion: 'El cambio mental: de teclear cada char a dirigir un colaborador.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 1. El nuevo loop

**Vibecoding** (acuñado por Andrej Karpathy) describe un estilo de desarrollo donde:

> "Veo cosas, digo cosas, copio-pego cosas. Apenas miro el código que produce. Le encanta hacer cosas."

No es magia ni reemplazo de pensar — es un **cambio de capa**. Pasas de escribir cada token a:

1. **Describir intención** (idealmente en una iteración o test).
2. **Revisar diff** que produce el asistente.
3. **Validar comportamiento** (correr, probar, ver).
4. **Refinar prompt** si el diff no convence.

### Cuándo vibecoding brilla

- Prototipos rápidos donde la idea es móvil.
- Lenguajes/frameworks que no dominas.
- Boilerplate masivo (CRUDs, tests unitarios).

### Cuándo NO vibecodear ciegamente

- Código que toca **dinero** o **identidad** del usuario.
- **Smart contracts** auditables.
- **Producción** sin tests existentes que validen comportamiento.

### El skill clave: discernimiento

El programador vibecoder competente no es el que entiende menos código — es el que **sabe cuándo pedirle al agente que se detenga, qué leer línea por línea y qué archivar**. Ese skill lo cubrimos en las lecciones siguientes.`,
      cuestionario: [
        {
          pregunta: '¿Cuál es la idea central de vibecoding?',
          opciones: [
            'No revisar nunca el código generado',
            'Dirigir al asistente con intención, revisar diff y validar comportamiento',
            'Programar sin tests',
            'Reemplazar al programador',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿En qué caso es peligroso vibecodear ciegamente?',
          opciones: [
            'Tirar un script de prueba',
            'Generar un blog estático',
            'Smart contracts que custodian fondos en producción',
            'Tests unitarios',
          ],
          correcta: 2,
        },
        {
          pregunta: '¿Qué skill central distingue al vibecoder competente?',
          opciones: [
            'Escribir prompts en inglés',
            'Discernimiento: saber qué leer, qué confiar y cuándo parar',
            'Memorizar APIs',
            'Tipear rápido',
          ],
          correcta: 1,
        },
      ],
    },
    {
      id: 2,
      titulo: 'Prompts efectivos para tareas de código',
      descripcion: 'Estructura, contexto y restricciones para obtener mejor output.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 2. Anatomía de un buen prompt

### Estructura clásica

\`\`\`
[Contexto del proyecto]
Estoy trabajando en una app Next.js 15 con wagmi 2 y supabase.

[Lo que ya hay]
Existe el archivo src/lib/db.ts con el cliente supabase.

[Lo que quiero]
Crea src/lib/users.ts con funciones getUser(walletAddress) y upsertUser({address, name}).
Sigue el patrón existente de db.ts (mismo manejo de errores).

[Restricciones]
- TypeScript estricto, sin any.
- No agregues dependencias.
- Devuelve tipos explícitos.
\`\`\`

### Patrones que funcionan

- **"Sigue el patrón de X"**: el agente lee X y se calibra.
- **"NO hagas Y"**: las negaciones específicas son potentes.
- **"Si hay ambigüedad, pregúntame en lugar de inventar"**: reduce alucinaciones.
- **Mostrar un ejemplo**: 1 ejemplo concreto vale más que 3 párrafos de descripción.

### Anti-patrones

- "Hazlo bonito y rápido" → vago, output errático.
- Pedirle 5 cosas en un solo prompt → mejor dividir.
- No proveer la API/SDK que debe usar → inventa funciones inexistentes.

### Ejercicio mental

Antes de pegar un prompt, hazte la pregunta: **¿podría un humano nuevo en el equipo entenderlo sin más contexto?** Si no, falta info.`,
      cuestionario: [
        {
          pregunta: '¿Cuál es el problema de "hazlo bonito y rápido" como prompt?',
          opciones: [
            'Es ofensivo',
            'Es vago: no especifica lenguaje, librería, formato ni criterios',
            'El modelo no entiende español',
            'Es ilegal',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Por qué incluir "sigue el patrón de X" en un prompt?',
          opciones: [
            'Reduce tokens cobrados',
            'Hace que el agente lea X y se calibre al estilo del proyecto',
            'Es decorativo',
            'No tiene efecto',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué hacer cuando le pides al agente 5 cosas distintas a la vez?',
          opciones: [
            'Funciona perfecto',
            'Tiende a hacer todo a medias; mejor dividir en tareas',
            'Cobra el doble',
            'No las puede hacer en absoluto',
          ],
          correcta: 1,
        },
      ],
    },
    {
      id: 3,
      titulo: 'El loop build → review → ship',
      descripcion: 'Cómo no caer en código que no entiendes ni mantienes.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 3. El loop sano

El vibecoder maduro tiene un ritmo:

### 1. Build (delegar)

Le pides al agente un trozo acotado. Idealmente **un cambio que cabe en un commit**.

### 2. Review (humano)

Lees el diff completo. Tres categorías mentales:

- **Verde**: lo entiendo y luce bien → aceptar.
- **Amarillo**: no entiendo del todo, pero los tests pasan → marca para revisar en frío.
- **Rojo**: no entiendo y no convence → reverte, ajusta el prompt o pídele que lo simplifique.

### 3. Probar comportamiento

Para todo cambio:

- Si hay test: corre el test.
- Si no hay: úsalo manualmente (UI, request, etc.).
- Para cambios de UI: **abre el navegador** y haz el flujo end-to-end.

### 4. Decidir: ship o iterar

Si todo verde → commit + push. Si algo amarillo + crítico → no shippeas, pides explicación al agente o lo lees tú.

### Heurísticas para no romperse

- **Backup frecuente** (commits pequeños, ramas separadas).
- **Tests automatizados** desde el día 1 si es algo serio.
- **Snapshot del producto funcionando** antes de pedir refactor grande.
- **Pareja humana en code review**: aunque agentes encuentren bugs, otro humano ve cosas distintas.

### Cuándo dejar el agente y leer

Si el agente intenta 3 veces y falla, **no lo intentes 5 veces más**. Significa que falta contexto o el problema es más profundo. Lee tú, fija el modelo mental, y vuelve.`,
      cuestionario: [
        {
          pregunta: 'En el loop sano, ¿qué pasa con cambios "amarillos" que NO entiendes pero pasan tests?',
          opciones: [
            'Shippearlos sin más',
            'Marcarlos para revisar en frío; no shippear si es crítico sin entender',
            'Borrar el código',
            'Ignorarlos',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué hacer si el agente falla 3 veces en lo mismo?',
          opciones: [
            'Pedirle 5 veces más con más adjetivos',
            'Detenerte, leer tú el código y ajustar el modelo mental antes de volver',
            'Cambiar de modelo y repetir igual',
            'Borrar el repo',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Para cambios de UI, qué validación adicional importa?',
          opciones: [
            'Confiar que TypeScript compila',
            'Abrir el navegador y probar el flujo end-to-end',
            'Solo correr lint',
            'Pedirle al agente que verifique',
          ],
          correcta: 1,
        },
      ],
    },
  ],
}

/* ============================================================
   EXPORT
   ============================================================ */
export const cursosApisProductividad: Curso[] = [
  cursoBitsoApi,
  cursoEtherfuseApi,
  cursoCriptografia,
  cursoArquitectura,
  cursoClaude,
  cursoVibecoding,
]
