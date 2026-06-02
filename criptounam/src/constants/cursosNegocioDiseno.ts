import type { Curso } from './cursosData'
import { IMAGES } from './images'

/**
 * Tanda 3 · Negocio + Diseño
 * 6 cursos: Marketing cripto, Modelos de negocio Web3, Tokenomics,
 * Diseño de producto Web3, Figma para devs, Canva para comunidad.
 * Cada curso tiene 3 lecciones con guía + cuestionario.
 * Los videos son placeholders (reemplazar por contenido oficial CriptoUNAM).
 */

const VIDEO_PLACEHOLDER = 'https://www.youtube.com/embed/SSo_EIwHSd4'

/* ============================================================
   CURSO · Marketing para proyectos cripto
   ============================================================ */
const cursoMarketingCripto: Curso = {
  id: 'marketing-cripto',
  titulo: 'Marketing para proyectos cripto',
  nivel: 'Principiante',
  duracion: '3 semanas',
  imagen: IMAGES.CURSOS.MARKETING,
  descripcion:
    'Cómo construir audiencia para un proyecto Web3: narrativa, canales (X, Discord, Farcaster), programas de embajadores y lanzamientos sin caer en hype hueco.',
  precio: 0,
  precioPuma: 500,
  cohorteRef: 'v1',
  estudiantes: 0,
  rating: 5,
  categorias: ['Marketing', 'Growth', 'Comunidad', 'Negocio'],
  requisitos: 'Sin requisitos técnicos. Curiosidad por comunicación y comunidad.',
  lecciones: [
    {
      id: 1,
      titulo: 'Marketing cripto vs marketing tradicional',
      descripcion: 'Por qué funcionan otras cosas y qué métricas importan.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 1. ¿Qué cambia?

El marketing cripto comparte fundamentos con el marketing tradicional (audiencia, mensaje, canal), pero **hay diferencias estructurales**:

- **Tu producto es público**: cualquiera lee el contrato, ve el TVL, los wallets de los founders. La transparencia es default.
- **Tu usuario es escéptico por entrenamiento**: ha visto rugpulls. El tono pomposo o promesas de "100× guaranteed" alejan.
- **La comunidad es co-propietaria del proyecto**: holders del token pueden votar, embajadores construyen contenido sin que tú pagues directo.
- **El ciclo es brutal**: bull markets generan ruido, bear markets son la prueba real.

### Métricas que importan

| Métrica vanidad      | Métrica real                                  |
|----------------------|-----------------------------------------------|
| Followers en X       | Holders activos / wallets que regresan        |
| Likes en posts       | Retención semanal en el producto              |
| Trending             | Volumen orgánico vs paid                      |
| TVL bombo            | Revenue real (fees, suscripciones)            |

### Pirámide de confianza

Antes de cualquier campaña, asegura los tres cimientos:

1. **Producto funcional**: si la dApp se rompe, ningún meme te salva.
2. **Comunicación honesta**: post-mortems cuando algo falla.
3. **Documentación**: docs decentes y un changelog accesible.

Sin esto, **cualquier inversión en marketing acelera tu muerte**.`,
      cuestionario: [
        {
          pregunta: '¿Qué métrica es más útil que "followers en X"?',
          opciones: [
            'Cantidad de likes',
            'Holders activos o wallets que regresan al producto',
            'Veces que apareces en trending',
            'Mensajes en DM',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Cuál es la primera capa de la pirámide de confianza?',
          opciones: [
            'Memes pegajosos',
            'Producto funcional',
            'Influencer pagado',
            'Airdrop sorpresa',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Por qué la transparencia es default en cripto?',
          opciones: [
            'Por una ley',
            'Porque contratos, balances y direcciones son públicos en la blockchain',
            'Por las redes sociales',
            'Por moda',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué hace que un usuario cripto sea más escéptico que uno de SaaS?',
          opciones: [
            'Nada, es igual',
            'Ha visto rugpulls y exit scams; el tono pomposo lo aleja',
            'Le gustan los emojis',
            'Solo usa apps anónimas',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué pasa si haces marketing sobre un producto que se rompe?',
          opciones: [
            'Crece igual',
            'El marketing acelera la pérdida de confianza y la muerte del proyecto',
            'No tiene efecto',
            'Sube el TVL',
          ],
          correcta: 1,
        },
      ],
    },
    {
      id: 2,
      titulo: 'Canales: X, Discord, Telegram, Farcaster, YouTube',
      descripcion: 'Para qué sirve cada canal y cómo distribuir tu energía.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 2. El stack de canales

### X (Twitter)

El **agenda-setter** del ecosistema. Aquí descubren los devs y los inversionistas. Foco:

- **Thread semanal** con builds y aprendizajes.
- **Quotes** a líderes de tu nicho con un punto propio (no "🔥🔥").
- **Spaces** con invitados ≠ tu equipo.

### Discord

Tu **servidor de soporte y construcción**. Estructura mínima:

- \`#anuncios\` — solo founders postean.
- \`#general\` — chat libre con bot anti-spam.
- \`#dev\` — devs contestando issues.
- \`#feedback\` — formato libre, semanal pinneado.

### Telegram

Más popular en **LATAM y Asia**. Útil para soporte rápido y bots de notificación. Cuida el spam — Discord modera mejor.

### Farcaster

**Comunidad cripto-nativa**, mucho dev. Si tu producto es Web3-first, casi obligatorio. La economía de Warps y los frames habilitan formatos imposibles en X.

### YouTube + Podcast

**Profundidad**. Un video de 30 min explicando el "por qué" de tu proyecto se sigue viendo en bear. Calcula:

- ROI corto: bajo.
- ROI largo: el contenido evergreen captura buscadores.

### Cómo distribuir tu energía

| Etapa            | X | Discord | TG | Farcaster | YouTube |
|------------------|:-:|:-------:|:--:|:---------:|:-------:|
| Pre-lanzamiento  | 40 % | 15 % | 5 % | 30 %    | 10 %    |
| Lanzamiento      | 50 % | 25 % | 10% | 10 %    | 5 %     |
| Mantenimiento    | 25 % | 30 % | 10% | 10 %    | 25 %    |`,
      cuestionario: [
        {
          pregunta: '¿Cuál es el canal "agenda-setter" del ecosistema cripto?',
          opciones: ['Telegram', 'X (Twitter)', 'LinkedIn', 'Reddit'],
          correcta: 1,
        },
        {
          pregunta: '¿Qué canal es nativamente cripto y popular entre devs?',
          opciones: ['Facebook', 'Farcaster', 'TikTok', 'Snapchat'],
          correcta: 1,
        },
        {
          pregunta: '¿Qué canal típicamente da el mejor ROI a largo plazo via búsqueda orgánica?',
          opciones: ['Telegram', 'Discord', 'YouTube + Podcast', 'X'],
          correcta: 2,
        },
        {
          pregunta: '¿En qué etapa típicamente Telegram aporta más valor relativo?',
          opciones: [
            'Pre-lanzamiento global',
            'Mantenimiento y soporte rápido, especialmente en LATAM y Asia',
            'Reclutamiento de devs',
            'Nunca',
          ],
          correcta: 1,
        },
        {
          pregunta: 'En la fase de mantenimiento, ¿qué canal pesa más en tiempo invertido?',
          opciones: [
            'X solo',
            'Discord y YouTube/Podcast (foco en comunidad + contenido evergreen)',
            'Reels en TikTok',
            'Facebook',
          ],
          correcta: 1,
        },
      ],
    },
    {
      id: 3,
      titulo: 'Lanzamientos: airdrops, embajadores y post-mortems',
      descripcion: 'Qué hacer las 2 semanas antes, durante y después de lanzar.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 3. Anatomía de un lanzamiento

### Pre-lanzamiento (T-14 → T-0)

- **Teaser arc**: 5 piezas conectadas que sueltan info clave.
- **Lista de espera** con un beneficio real (rol Discord, descuento, NFT proof).
- **Onboarding doc** y guías cortas listas.
- **Press kit**: logos, screenshots, descripción 1-liner / 1-párrafo / 1-página.

### Día del lanzamiento

- **Anuncio coordinado** en X + Discord + email + Farcaster simultáneo.
- **Founder en vivo** (Space o stream) las primeras 2 horas.
- **Bot de soporte** que sepa contestar las 10 dudas obvias.

### Airdrops y embajadores

Un **airdrop bien diseñado**:

- Recompensa **actividad orgánica anterior**, no solo wallets aleatorias.
- Incluye **vesting o lock-up corto** para alinear holders, no flippers.
- Publica las reglas **antes** de la snapshot.

**Programa de embajadores**:

- Cohorts de 20–50 personas, no 1 000.
- Tareas claras (1 thread/semana, 1 video/mes).
- Recompensas en **token + NFT soulbound** (POAP por temporada).
- Niveles: Aspirante → Embajador → Core.

### Post-mortem (T+30)

Documenta públicamente:

- **Qué funcionó**: canales con mayor conversión, mensajes que pegaron.
- **Qué falló**: si la web cayó, si los gas fees fueron problema, etc.
- **Qué cambia**: cómo iterás para el próximo release.

La gente respeta más un post-mortem honesto que una victoria fingida.`,
      cuestionario: [
        {
          pregunta: '¿Qué caracteriza a un airdrop bien diseñado?',
          opciones: [
            'Distribuye al azar sin reglas',
            'Recompensa actividad orgánica previa y publica reglas antes de la snapshot',
            'No tiene vesting',
            'Solo para founders',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Cuál es el tamaño típico recomendado de una cohort de embajadores?',
          opciones: ['1 persona', '20–50 personas', '500–1000', 'Sin límite'],
          correcta: 1,
        },
        {
          pregunta: 'Después del lanzamiento, ¿qué documento público fortalece confianza?',
          opciones: [
            'Promesas de roadmap',
            'Un post-mortem honesto con qué funcionó, qué falló y qué cambia',
            'Solo screenshots de TVL',
            'Borrar lo que falló',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué entregables mínimos pediría el programa de embajadores propuesto?',
          opciones: [
            'Solo retweets',
            'Mínimo 1 thread/semana + 1 video/mes con recompensas en token y POAP',
            'Solo asistir a llamadas',
            'Nada, son voluntarios',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué se debería tener listo antes del día de lanzamiento?',
          opciones: [
            'Solo el token desplegado',
            'Press kit, onboarding doc, anuncio coordinado y bot de soporte',
            'Solo el sitio web',
            'Solo el contrato',
          ],
          correcta: 1,
        },
      ],
    },
  ],
  examenFinal: [
    {
      pregunta: '¿Qué describe mejor el rol de la comunidad en un proyecto cripto exitoso?',
      opciones: [
        'Espectadores pasivos',
        'Co-propietarios que pueden votar y construir contenido sin pago directo',
        'Clientes anónimos sin influencia',
        'Empleados encubiertos',
      ],
      correcta: 1,
    },
    {
      pregunta: '¿Qué señal indica producto sólido antes de invertir en growth?',
      opciones: [
        'Followers altos en X',
        'Retención semanal en el producto + documentación + post-mortems honestos',
        'Trending en CMC',
        'Influencers retweeting',
      ],
      correcta: 1,
    },
    {
      pregunta: 'En pre-lanzamiento, ¿dónde se concentra más esfuerzo según el reparto sugerido?',
      opciones: ['Telegram', 'X y Farcaster', 'YouTube exclusivamente', 'LinkedIn'],
      correcta: 1,
    },
    {
      pregunta: '¿Por qué se sugiere YouTube y podcasts para el largo plazo?',
      opciones: [
        'Por engagement inmediato',
        'Porque el contenido evergreen captura tráfico de búsqueda con el tiempo',
        'Porque pagan mejor',
        'Es más fácil que X',
      ],
      correcta: 1,
    },
    {
      pregunta: '¿Qué hace un airdrop "sano" frente a uno que se desploma a las semanas?',
      opciones: [
        'Distribuir todo de un jalón sin lock',
        'Vesting/lock-up corto + reglas publicadas antes de la snapshot + recompensa de actividad real',
        'Más cantidad',
        'Distribución solo a founders',
      ],
      correcta: 1,
    },
    {
      pregunta: 'Una cohort de embajadores demasiado grande (500+) tiende a:',
      opciones: [
        'Ser muy eficiente',
        'Perder calidad: difícil moderar y dar feedback útil',
        'No tener efecto',
        'Bajar costos',
      ],
      correcta: 1,
    },
    {
      pregunta: 'Si tu landing cae el día del lanzamiento, ¿qué hace la mejor respuesta?',
      opciones: [
        'Borrar el incidente y pretender que no pasó',
        'Post-mortem honesto: qué pasó, qué arreglarán, plazo concreto',
        'Echar la culpa al hosting',
        'No mencionarlo',
      ],
      correcta: 1,
    },
    {
      pregunta: '¿Qué diferencia hace tener un bot de soporte el día 1 vs no tenerlo?',
      opciones: [
        'Ninguna',
        'Reduce 50–80 % del soporte humano contestando las 10 dudas más comunes',
        'Aumenta gas',
        'Causa errores',
      ],
      correcta: 1,
    },
    {
      pregunta: '¿Qué métrica engaña frente al juicio de inversionistas serios?',
      opciones: [
        'Retención de usuarios',
        'Followers totales en X',
        'Revenue real',
        'Wallets activas',
      ],
      correcta: 1,
    },
    {
      pregunta: 'Para un release técnico con muchas dudas, ¿qué formato funciona mejor?',
      opciones: [
        'Solo un tweet',
        'Spaces o stream con founders en vivo + doc + bot de soporte',
        'Email masivo',
        'Solo un meme',
      ],
      correcta: 1,
    },
  ],
}

/* ============================================================
   CURSO · Modelos de negocio Web3
   ============================================================ */
const cursoModelosNegocio: Curso = {
  id: 'modelos-negocio-web3',
  titulo: 'Modelos de negocio Web3',
  nivel: 'Intermedio',
  duracion: '4 semanas',
  imagen: IMAGES.CURSOS.NEGOCIOS,
  descripcion:
    'Cómo hacer dinero (sostenible) en Web3. Categorías de monetización, casos de estudio (Uniswap, OpenSea, Lens, Farcaster), unit economics on-chain.',
  precio: 0,
  precioPuma: 1500,
  cohorteRef: 'v1',
  estudiantes: 0,
  rating: 5,
  categorias: ['Modelos de negocio', 'Estrategia', 'Negocio'],
  requisitos: 'Entender qué es un protocolo y conceptos básicos de DeFi/NFTs.',
  lecciones: [
    {
      id: 1,
      titulo: 'Categorías de monetización en Web3',
      descripcion: 'Mapa de cómo capturan valor protocolos exitosos.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 1. ¿Cómo se gana plata en Web3?

A diferencia de SaaS clásico (suscripción mensual), Web3 abre **varias capas** simultáneas:

### 1. Protocol fees

El protocolo cobra un % de las transacciones que enrutan a través de él.

- **DEXs** (Uniswap, Curve): 0.05 %–1 % por swap.
- **Lending** (Aave, Compound): spread entre interés que cobran a borrowers y pagan a lenders.
- **Bridges** (Stargate): flat fee + gas.

### 2. Marketplace fees / take rate

Un marketplace cobra una comisión al vendedor o comprador.

- **OpenSea**: 2.5 % de cada venta secundaria.
- **Magic Eden**: 2 % en Solana.
- **Royalties** del creador (separado, polémica).

### 3. Suscripciones

Modelo SaaS tradicional aplicado a herramientas Web3.

- **Etherscan API Pro**.
- **Alchemy/Infura RPC tiers**.
- **Dune Analytics**.

### 4. Ventas one-shot

NFTs como certificados, art drops, juegos.

### 5. Treasury yield

El protocolo guarda su tesoro en stablecoins/yield assets y vive del rendimiento. Sostenible si TVL grande y costos bajos.

### 6. Servicios profesionales

Auditorías, consultoría, integración custom. Negocio tradicional pero anclado a Web3.

### Qué capa elegir

Pregúntate: **¿qué unidad atómica de valor cruza por mi sistema?** Si es **transacciones**, fees. Si es **información rica**, suscripción. Si es **assets coleccionables**, marketplace. Mezclar capas funciona si el producto realmente lo justifica.`,
      cuestionario: [
        {
          pregunta: '¿De dónde sacan revenue las DEXs como Uniswap?',
          opciones: [
            'Cobro de suscripción mensual',
            'Un fee por swap (0.05 %–1 %) sobre el volumen ruteado',
            'Mining',
            'Venta de NFTs',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué modelo aplica a Alchemy o Infura?',
          opciones: ['Marketplace fees', 'Protocol fees', 'Suscripciones (RPC tiers)', 'Treasury yield'],
          correcta: 2,
        },
        {
          pregunta: '¿Cuándo conviene una estrategia de treasury yield?',
          opciones: [
            'Cuando el TVL es alto y los costos operativos bajos',
            'Cuando recién lanzas con 0 usuarios',
            'Nunca',
            'Solo si tienes NFTs',
          ],
          correcta: 0,
        },
      ],
    },
    {
      id: 2,
      titulo: 'Casos de estudio: Uniswap, OpenSea, Lens, Farcaster, dYdX',
      descripcion: 'Cómo capturan valor y dónde está el cuello de botella de cada uno.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 2. Casos reales

### Uniswap

**Modelo**: protocol fees (variable por pool). El **token** UNI da governance pero no capturaba fees directamente hasta 2024 (fee switch). Aprendizaje: gran adopción ≠ revenue al token si el switch está apagado.

### OpenSea

**Modelo**: marketplace fee (~2.5 %). Riesgo: war de comisiones. Blur (2023) entró con 0 % fees + airdrop agresivo y le comió 60 % del market share. Lección: si tu moat es el take rate, eres frágil.

### Lens (Social)

**Modelo**: capa social descentralizada. Monetización: marketplace de subscripciones a perfiles + handles NFT. Revenue real aún incipiente. Bet: si los grafos sociales son público bien, la app que mejor los reordene gana.

### Farcaster

**Modelo**: storage fee anual (~$5/año por cuenta) + frames con publishers monetizables. Tu identidad es portátil. Está creciendo orgánico, sin token todavía.

### dYdX

**Modelo**: perpetual DEX con fee por trade. Su V4 corre **sobre Cosmos** (no Ethereum) para reducir costos y capturar el 100 % de fees vía staking del token DYDX. Caso de estudio de **vertical integration**.

### Patrón común

Los que ganan más:

- **Producen externalidades positivas** (Uniswap, Aave) → grandes redes los usan.
- **Acumulan datos / identidad** (Farcaster, Lens) → switch cost humano.
- **Verticalizan stack** (dYdX V4) → capturan más por unidad.

Los que sufren:

- Marketplaces puros sin moat más allá de UI (OpenSea).
- Protocolos con token sin captura de revenue (UNI pre fee-switch).`,
      cuestionario: [
        {
          pregunta: '¿Qué le pasó a OpenSea cuando entró Blur en 2023?',
          opciones: [
            'Subió 200 % en revenue',
            'Perdió ~60 % de market share por la guerra de fees / airdrops',
            'Cerró',
            'Se fusionó con Blur',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Por qué dYdX V4 migró a su propia chain Cosmos?',
          opciones: [
            'Para reducir costos y capturar el 100 % de fees vía staking',
            'Por moda',
            'Porque Ethereum lo prohibió',
            'Para no tener wallets',
          ],
          correcta: 0,
        },
        {
          pregunta: '¿Cuál es el modelo de monetización principal de Farcaster?',
          opciones: [
            'Token con airdrop estacional',
            'Storage fee anual + monetización vía frames y publishers',
            'Suscripción SaaS para usuarios',
            'No tiene modelo',
          ],
          correcta: 1,
        },
      ],
    },
    {
      id: 3,
      titulo: 'Unit economics on-chain: pricing, CAC y LTV',
      descripcion: 'Cómo hacer un P&L cuando tus usuarios son anónimos.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 3. Números

### El problema

En Web3, tus "clientes" son **wallets**, no emails. No tienes nombre, edad, demografía. Pero sí tienes:

- Historial completo on-chain (cuánto gastó, qué dApps usó).
- Eventos discretos (swap, mint, deposit).
- Posibilidad de etiquetar wallets (Nansen, Arkham) — privacidad limitada.

### Pricing

Para fijar fees, mira **comparables**:

- ¿Tu swap es 0.3 %? Pregunta cómo se compara con Uniswap (variable), Curve (0.04 % stables), 1inch (agregador).
- ¿Tu marketplace cobra 5 %? Difícil; OpenSea está en 2.5 % y Blur en 0 %.

**Regla**: si tu producto no añade valor evidente, no puedes cobrar más que el promedio.

### CAC (Customer Acquisition Cost) en cripto

Métricas típicas:

- **Costo por wallet activada** (hizo ≥ 1 tx).
- **Costo por wallet retenida 30 días**.

Canales y costos rough en 2024:

| Canal              | Costo por wallet activada |
|--------------------|---------------------------:|
| Quest platforms (Galxe, Layer3) | $1–$5 |
| Influencer cripto pago         | $10–$50 |
| Airdrop a hunters              | A menudo negativo (dump al lanzar) |
| Contenido orgánico             | < $1 (pero largo) |

### LTV

\`\`\`
LTV = (revenue por wallet/mes) × (retention en meses)
\`\`\`

En DeFi/DEX, LTV suele ser dominado por **whales** (top 1 % wallets aporta > 50 % del fee revenue). En NFTs, LTV es **bursty** (compra grande única, luego silencio).

### Ratio LTV/CAC

Idealmente **> 3×**. Por debajo de 1, estás quemando capital sin compensación. Web3 olvida esto durante bull markets y se acuerda en bear.`,
      cuestionario: [
        {
          pregunta: 'En Web3, ¿qué identifica a tu "cliente"?',
          opciones: ['Su email', 'Su wallet address', 'Su nombre legal', 'Su teléfono'],
          correcta: 1,
        },
        {
          pregunta: '¿Qué patrón de LTV es típico en DeFi/DEX?',
          opciones: [
            'Distribución uniforme entre todos',
            'Dominado por whales (top 1 % aporta > 50 % del revenue)',
            'No hay LTV',
            'Solo lo aportan los founders',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué ratio LTV/CAC se considera sano?',
          opciones: ['< 1', 'Cercano a 1', '> 3×', 'No importa'],
          correcta: 2,
        },
      ],
    },
  ],
}

/* ============================================================
   CURSO · Tokenomics
   ============================================================ */
const cursoTokenomics: Curso = {
  id: 'tokenomics',
  titulo: 'Tokenomics: diseñar la economía de un token',
  nivel: 'Intermedio',
  duracion: '4 semanas',
  imagen: IMAGES.CURSOS.TOKENOMICS,
  descripcion:
    'Cuándo emitir token y cuándo no. Supply, distribución, vesting, demand sinks (utility, governance, burn) y cómo evitar inflación tóxica.',
  precio: 0,
  precioPuma: 1500,
  cohorteRef: 'v1',
  estudiantes: 0,
  rating: 5,
  categorias: ['Tokenomics', 'Economía', 'Negocio', 'Modelos de negocio'],
  requisitos: 'Entender qué es un token ERC-20/SPL y cómo funciona governance básica.',
  lecciones: [
    {
      id: 1,
      titulo: '¿Para qué un token? Y cuándo NO emitir',
      descripcion: 'La pregunta más importante antes de diseñar tokenomics.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 1. ¿Necesitas un token?

Un token bien usado es **superpoder**. Mal usado es **freno**. Antes de emitir, valida:

### Razones legítimas

1. **Coordinación descentralizada**: votos en una DAO (Compound, MakerDAO).
2. **Acceso/membresía**: holders desbloquean features (BAYC, Friend.tech).
3. **Incentivos de red**: rewards a quienes alimentan el lado escaso del marketplace (drivers en Helium, validadores en Solana).
4. **Pago entre partes que no se conocen**: stablecoins, gas tokens.

### Anti-razones (huele mal si tu token solo sirve para esto)

- "Hype" o porque los inversores lo piden.
- Reemplazar revenue real con emisión inflacionaria.
- Speculation pura sin función dentro del producto.

### Pregunta de filtro

> Si quitas el token mañana, ¿el producto deja de funcionar para sus usuarios?

- **Sí, deja de funcionar** → tokens es justificable.
- **No, solo cambia el precio en exchanges** → probablemente no lo necesitas.

### Casos sin token funcional

- **OpenSea**: nunca lanzó token y sobrevivió. El mercado existía sin él.
- **Metamask**: nunca lanzó token oficial. Captura valor por swaps fees.

### Casos con token central

- **Uniswap (UNI)**: governance del protocolo más usado del mundo.
- **Ethereum (ETH)**: paga el gas, es el "petróleo" de la chain.
- **Helium (HNT)**: incentiva a operadores de hotspots.`,
      cuestionario: [
        {
          pregunta: '¿Cuál es una razón legítima para emitir token?',
          opciones: [
            'Para hacer hype en X',
            'Para incentivar el lado escaso de una red (ej. validadores u operadores)',
            'Porque los inversionistas lo piden',
            'Para diluir founders',
          ],
          correcta: 1,
        },
        {
          pregunta: 'Si quitas el token y el producto sigue funcionando igual, ¿qué indica?',
          opciones: [
            'Que el token es esencial',
            'Que probablemente no necesitabas un token',
            'Que es un buen diseño',
            'Que tiene utility profunda',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué proyecto NO tiene token y aun así monetiza?',
          opciones: ['Compound', 'OpenSea', 'Uniswap', 'Helium'],
          correcta: 1,
        },
        {
          pregunta: '¿Cuál de estas usa su token para coordinación descentralizada vía governance?',
          opciones: [
            'MakerDAO (MKR)',
            'OpenSea',
            'Metamask',
            'Etherscan',
          ],
          correcta: 0,
        },
        {
          pregunta: '¿Qué señal indica que tu token solo sirve para especulación?',
          opciones: [
            'Tiene utility on-chain',
            'Si el producto funciona idéntico sin él para el usuario',
            'Sube de precio',
            'Tiene volumen alto',
          ],
          correcta: 1,
        },
      ],
    },
    {
      id: 2,
      titulo: 'Supply, distribución y vesting',
      descripcion: 'Cuánto emitir, a quién y con qué tiempos.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 2. Supply schedule

### Total supply

Decisiones típicas:

- **Fixed supply** (BTC: 21 M): rareza por diseño. Bueno para "store of value".
- **Disinflationary** (ETH post-merge): emisión decrece, eventualmente puede ser net-deflacionario.
- **Capped con tail emission** (Monero): emisión perpetua pequeña para mantener incentivos.
- **Uncapped** (DOGE): inflación constante. Ojo: presión bajista permanente.

### Distribución inicial

Plantilla común para un proyecto medio:

| Bucket            | %      | Notas                                  |
|-------------------|-------:|----------------------------------------|
| Comunidad/airdrop | 30–50 %| Lo que captura usuarios reales         |
| Team              | 15–20 %| Founders + empleados                   |
| Inversores        | 15–25 %| Seed, Series A                         |
| Treasury / DAO    | 15–20 %| Para growth, audits, contrataciones    |
| Liquidez (DEX)    | 5–10 % | Para que el token tenga mercado        |

### Vesting

**Cliff** (sin emisión X meses) + **linear** (emisión gradual después).

- **Team**: 1 año cliff, 3 años linear es estándar.
- **Inversores**: 6 meses cliff, 18–24 meses linear.
- **Comunidad/airdrop**: parte instantáneo, parte locked 6–12 meses para evitar dump.

### Errores comunes

- **Sin vesting al equipo**: dumpean en TGE, comunidad pierde fe.
- **Cliff demasiado corto a inversores**: presión bajista los primeros 6 meses.
- **Liquidez < 5 %**: precio super volátil con cualquier orden.
- **Olvidar el treasury**: en bear market sin caja no hay growth.

### Visualizar el unlock schedule

Tools como [TokenUnlocks.app](https://token.unlocks.app) muestran calendarios. Cualquier holder serio mira esto antes de comprar.`,
      cuestionario: [
        {
          pregunta: '¿Qué significa "cliff" en vesting?',
          opciones: [
            'Que el token sube de precio',
            'Periodo inicial sin emisión antes de empezar el desbloqueo',
            'El % final que recibe el team',
            'Un bug en el contrato',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Por qué importa tener al menos 5–10 % del supply para liquidez en DEX?',
          opciones: [
            'Es ilegal no hacerlo',
            'Sin liquidez suficiente, el precio es extremadamente volátil',
            'Para reducir gas',
            'Para hacer mining',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué pasa típicamente si el equipo NO tiene vesting?',
          opciones: [
            'El equipo se motiva más',
            'Dumpean en TGE y la comunidad pierde fe',
            'No hay efecto',
            'El precio sube',
          ],
          correcta: 1,
        },
        {
          pregunta: 'En la plantilla típica, ¿qué bucket suele recibir 30–50 % del supply?',
          opciones: ['Team', 'Inversores', 'Comunidad / airdrop', 'Liquidez DEX'],
          correcta: 2,
        },
        {
          pregunta: '¿Qué vesting es razonable para el equipo?',
          opciones: [
            'Sin vesting',
            '1 año cliff + 3 años linear',
            '1 mes cliff + 6 meses linear',
            '5 años cliff + 0 linear',
          ],
          correcta: 1,
        },
      ],
    },
    {
      id: 3,
      titulo: 'Demand sinks: utility, governance, buy-back-burn',
      descripcion: 'Cómo hacer que la demanda no sea solo especulación.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 3. Demanda real

Si solo hay emisión sin sinks, el precio cae cíclicamente. Tu trabajo es diseñar **razones para mantener el token**.

### 1. Utility

El token desbloquea uso del producto.

- **Pagar fees**: ETH para gas, BNB para fees con descuento en Binance.
- **Stake para acceder**: requiere X tokens para listar en un marketplace, postear en un foro premium, validar.
- **Collateral**: en Maker, MKR/DAI son piezas del sistema.

### 2. Governance real

Si los votos no controlan nada material (treasury, fees, upgrades), el token sólo es papel. Diseña governance donde:

- Los votos cambian parámetros reales (fee switch, emissions, treasury allocations).
- Hay **quorum** y **timelock** para evitar ataques.

### 3. Buy-back-burn / fee redistribution

El protocolo destina parte de su revenue a:

- **Recompra y quema** del token (BNB, históricamente).
- **Reparto a stakers** (GMX, dYdX V4).
- **Treasury que paga gastos en stables** sin tocar el token (más sostenible).

### 4. veToken / lockup voluntario

Modelo Curve: bloqueas tokens por X tiempo y recibes:

- **Boost** en yield.
- **Más voting power**.
- **Share de fees**.

Reduce supply circulante, alinea incentivos largoplacistas.

### Antipatrones

- **Emitir para "premiar holders"** sin captura de valor real → solo dilución.
- **Burn de tokens del treasury** sin razón económica → marketing teatral.
- **Governance que solo aprueba lo que ya decidió la team** → fake decentralization.

### Métrica clave

\`\`\`
Real Yield = (Revenue capturado por token holders) / Market cap
\`\`\`

Si tu Real Yield > 0 y crece, tu tokenomics es **sano**.`,
      cuestionario: [
        {
          pregunta: '¿Qué problema resuelven los "demand sinks"?',
          opciones: [
            'La emisión inflacionaria sin razones para mantener el token',
            'El bug del contrato',
            'La regulación',
            'La latencia',
          ],
          correcta: 0,
        },
        {
          pregunta: '¿Qué hace un sistema "veToken" (estilo Curve)?',
          opciones: [
            'Bloquea tokens por X tiempo a cambio de boost, voting power y fees',
            'Elimina governance',
            'Aumenta supply',
            'Quema tokens',
          ],
          correcta: 0,
        },
        {
          pregunta: '¿Qué métrica indica que tu tokenomics es sano?',
          opciones: [
            'Trending en X',
            'Real Yield positivo y creciente',
            'Precio en ATH',
            'Followers del founder',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Cuál es un ejemplo de "demand sink" sostenible?',
          opciones: [
            'Quemar tokens del treasury sin justificación',
            'Repartir fees del protocolo a stakers (real yield)',
            'Crear más emisión inflacionaria',
            'Hacer mints sorpresa',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué indica que la governance es "fake decentralization"?',
          opciones: [
            'Cuando hay timelock',
            'Cuando los votos solo aprueban lo que ya decidió el equipo y no controlan parámetros materiales',
            'Cuando hay quorum',
            'Cuando hay snapshots',
          ],
          correcta: 1,
        },
      ],
    },
  ],
  examenFinal: [
    {
      pregunta: 'Test rápido: ¿necesitas un token?',
      opciones: [
        'Sí, siempre que vayas a lanzar',
        'Solo si el producto deja de funcionar (para sus usuarios) sin él, o capta valor real con él',
        'Sí, si los inversores lo piden',
        'Sí, si quieres hacer hype',
      ],
      correcta: 1,
    },
    {
      pregunta: '¿Qué tipo de supply tiene Bitcoin?',
      opciones: ['Uncapped', 'Disinflationary', 'Fixed (21M)', 'Capped con tail emission'],
      correcta: 2,
    },
    {
      pregunta: '¿Por qué se incluye un treasury / DAO bucket significativo?',
      opciones: [
        'Para diluir holders',
        'Para sostener growth, audits y contrataciones, especialmente en bear markets',
        'Por moda',
        'Para pagar gas',
      ],
      correcta: 1,
    },
    {
      pregunta: '¿Qué hace un cliff demasiado corto para inversores tempranos?',
      opciones: [
        'Aumenta la confianza',
        'Crea presión bajista los primeros meses post-TGE',
        'Reduce volatilidad',
        'Nada',
      ],
      correcta: 1,
    },
    {
      pregunta: '¿Cuál es un anti-patrón en governance?',
      opciones: [
        'Tener quorum mínimo',
        'Votar sobre parámetros que el equipo igual decide unilateralmente (teatro)',
        'Implementar timelock',
        'Publicar propuestas',
      ],
      correcta: 1,
    },
    {
      pregunta: 'En el modelo veToken, ¿qué obtiene el usuario que bloquea su token?',
      opciones: [
        'Solo emojis en Discord',
        'Boost en yield + más voting power + share de fees',
        'Una NFT',
        'Sin beneficio',
      ],
      correcta: 1,
    },
    {
      pregunta: '¿Cuál de estos es un demand sink real?',
      opciones: [
        'Quemar tokens del treasury sin razón económica',
        'Pagar fees con descuento al staker',
        'Hacer airdrop sin reglas',
        'Aumentar emisión',
      ],
      correcta: 1,
    },
    {
      pregunta: '¿Qué calcula "Real Yield"?',
      opciones: [
        'Revenue capturado por holders / Market cap',
        'TVL / Supply',
        'Followers / Día',
        'Price / EMA',
      ],
      correcta: 0,
    },
    {
      pregunta: 'Si la dispo de tu token no captura fees del protocolo, ¿qué pasa típicamente?',
      opciones: [
        'Sube por escasez',
        'El precio depende solo de especulación y suele caer con la inflación',
        'Es deflacionario por default',
        'Bitcoin lo respalda',
      ],
      correcta: 1,
    },
    {
      pregunta: 'Mejor decisión cuando todavía no sabes si tu producto necesita un token:',
      opciones: [
        'Lanzar rápido para no perder hype',
        'Construir el producto sin token, validar uso real, y emitir solo si una función concreta lo justifica',
        'Hacer un fair launch sin tokenomics',
        'Copiar el de Uniswap',
      ],
      correcta: 1,
    },
  ],
}

/* ============================================================
   CURSO · Diseño de producto Web3
   ============================================================ */
const cursoDisenoProducto: Curso = {
  id: 'diseno-producto-web3',
  titulo: 'Diseño de producto Web3 (UX/UI)',
  nivel: 'Intermedio',
  duracion: '3 semanas',
  imagen: IMAGES.CURSOS.DISENO,
  descripcion:
    'Los patrones únicos de UX en Web3 (wallets, firmas, gas, retries) y cómo reducir fricción con smart accounts, gasless tx y fiat ramps.',
  precio: 0,
  precioPuma: 1500,
  cohorteRef: 'v1',
  estudiantes: 0,
  rating: 5,
  categorias: ['Diseño', 'UX', 'Producto'],
  requisitos: 'Haber usado wallets cripto. Conocer Figma básico ayuda pero no es necesario.',
  lecciones: [
    {
      id: 1,
      titulo: 'Patrones únicos de UX en Web3',
      descripcion: 'Wallets, firmas, gas y retries: lo que no existe en SaaS.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 1. Lo que es distinto

Un usuario que llega a tu dApp enfrenta retos que **no existen** en una app SaaS o e-commerce. Tu rol como diseñador:

### Connect Wallet

Es el "login" pero con peculiaridades:

- **No es un email/password**: es probar que controlas una clave privada.
- **Hay decenas de wallets**: MetaMask, Phantom, Backpack, Coinbase, Rabby…
- **Estado "wrong network"**: si el usuario está en Polygon y tu app espera Arbitrum, debes guiarlo.

**Patrón**: usa AppKit/Reown, RainbowKit o similar. **No diseñes el modal a mano**.

### Firmar transacción

Cada acción importante abre el wallet con un dialog **fuera de tu app**. Tres tipos:

1. **Send transaction**: cuesta gas, cambia estado on-chain.
2. **Sign message (personal_sign / typed)**: gratis, prueba intención. Úsalo para login, autorización.
3. **Permit / EIP-712**: firma estructurada con dominio + tipos.

**Patrón**: cuando pidas firma, **explica antes** qué se va a firmar y por qué.

### Gas

El usuario paga gas en ETH/SOL/MATIC. Para una primera vez, esto es **frustrante**.

**Patrón**:

- Estima gas y muestra costo en USD antes de firmar.
- Si tu UX exige muchas tx, considera **gasless** (relayers + meta-tx).

### Retries y estados intermedios

Una tx tarda 5 s en confirmar, a veces más. Otro intento llamado "speed up" o "replace".

**Patrón**:

- Estados claros: \`signing\`, \`pending\`, \`confirmed\`, \`failed\`.
- Link al explorer en cada estado.
- "Retry" con misma intención si falla por gas/nonce.`,
      cuestionario: [
        {
          pregunta: '¿Cómo se "loguea" un usuario a una dApp?',
          opciones: [
            'Con email y password',
            'Probando que controla una clave privada (conectando una wallet)',
            'Con biometría siempre',
            'Con OAuth de Google',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué tipo de firma NO cuesta gas?',
          opciones: [
            'Send transaction',
            'Sign message (personal_sign / EIP-712)',
            'Approve infinito',
            'Deploy de contrato',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Cuál es un buen patrón al estado "pending" de una tx?',
          opciones: [
            'Ocultar todo hasta que confirme',
            'Mostrar estado claro + link al explorer + opción de retry',
            'Recargar la página',
            'Asumir que falló',
          ],
          correcta: 1,
        },
      ],
    },
    {
      id: 2,
      titulo: 'Reducir fricción: smart accounts, fiat ramps, gasless',
      descripcion: 'Cómo hacer que tu dApp se sienta como una app normal.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 2. Account Abstraction y fiat ramps

### Smart accounts (ERC-4337)

Una **smart account** es un contrato que actúa como wallet. Habilita:

- **Login con email/social** (no seed phrase).
- **Recovery** vía guardians, sin frase de respaldo.
- **Session keys**: el usuario aprueba "puedes hacer X tipos de tx por 1 hora" → 0 popups durante esa sesión.
- **Sponsorship**: pagas tú el gas.

**Tools**: Privy, Dynamic, Web3Auth, Account Kit (Alchemy), Safe.

### Gasless / meta-tx

Patrón: el usuario firma un mensaje (intent) y un **relayer** paga el gas para ejecutar la tx en su nombre. Útil para:

- Onboarding (primer interacción siempre gratis).
- Subsidiar productos sociales (Farcaster, Lens).
- Acciones repetitivas (claim diario, mark as read).

### Fiat on-ramps

Para que un usuario pase de pesos/dólares a cripto sin tener que ir a un exchange:

- **Stripe Crypto**, **MoonPay**, **Transak**, **Onramper** (agregador).
- En México: **Bitso** y **Etherfuse** (cubiertos en tanda 2).

### Embeber vs redirigir

| Patrón                   | Pros                              | Contras                         |
|--------------------------|-----------------------------------|----------------------------------|
| **Embed widget**         | Conserva contexto                 | Más superficie regulatoria       |
| **Redirect a hosted**    | Menos compliance directo          | Pierdes al usuario               |

### Diseño de error

Web3 tiene errores específicos: \`insufficient funds\`, \`user rejected\`, \`nonce too low\`, \`out of gas\`. Mapea cada uno a un mensaje **humano**:

- ❌ \`Error: execution reverted: SafeERC20: low-level call failed\`
- ✅ "El swap falló porque el slippage cambió. Aumenta la tolerancia o intenta de nuevo."`,
      cuestionario: [
        {
          pregunta: '¿Qué habilita una smart account ERC-4337?',
          opciones: [
            'Login social, recovery sin seed phrase, gas sponsorship, session keys',
            'Cobrar fees automáticamente',
            'Eliminar la blockchain',
            'Compilar Solidity',
          ],
          correcta: 0,
        },
        {
          pregunta: '¿Qué es una tx "gasless" o meta-tx?',
          opciones: [
            'Una tx que no usa gas en absoluto',
            'Una tx donde un relayer paga el gas en nombre del usuario que firmó la intención',
            'Una tx en mainnet sin fees',
            'Una tx ilegal',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Cuál es un buen patrón de error UX?',
          opciones: [
            'Mostrar el error técnico crudo',
            'Mapearlo a un mensaje humano con la acción siguiente',
            'Ocultarlo siempre',
            'Recargar la página',
          ],
          correcta: 1,
        },
      ],
    },
    {
      id: 3,
      titulo: 'Investigación con usuarios cripto',
      descripcion: 'Cómo entrevistar y testear con holders, devs y degens.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 3. User research

Hacer entrevistas en Web3 requiere algunos ajustes:

### Reclutar

Canales donde sí responden:

- **Tu Discord** (segmenta por roles).
- **Farcaster** (la barra de entrada es lower, hay degens y devs).
- **Bug bounty / quest platforms** (Galxe, Layer3).
- **Twitter DMs cualificados** (no spam masivo).

Compensación típica: **$25–$75 USDC** por 30 min. Pagas en USDC, **al final**, después de la entrevista.

### Preguntas que funcionan

- "Cuéntame la última vez que usaste [producto similar]." → narrativa concreta, no opinión.
- "¿Qué hiciste cuando vio ese error?" → comportamiento real.
- "¿Por qué confiaste en este protocolo y no en otro?" → mental model.

### Preguntas que NO funcionan

- "¿Usarías nuestro producto?" → todos dicen sí por cortesía.
- "¿Pagarías $X por esto?" → mejor enseñar pricing real y ver reacción.

### Tests usability

Para una dApp, dos formatos:

1. **Moderado remoto** (Zoom + screen share): pides al usuario completar 3 tareas y observas dónde se atora.
2. **Asíncrono** (Maze, Useberry): test grabado, escala más rápido.

### Métricas blandas que SÍ predicen

- **Task success rate** sin ayuda.
- **Time to first transaction** (TTFT) desde landing.
- **Drop-off por paso** en el funnel de onboarding.

### Sesgo importante

Tus 50 entrevistas iniciales muy probablemente son cripto-natives. Cuando llegues a usuarios mainstream, **muchas cosas que asumías obvias no lo son** (qué es una wallet, qué es una red, qué es un token). Reservar entrevistas para no-cripto-natives en ronda 2.`,
      cuestionario: [
        {
          pregunta: '¿Qué tipo de pregunta da datos más útiles?',
          opciones: [
            '"¿Usarías nuestro producto?"',
            '"Cuéntame la última vez que usaste un producto similar"',
            '"¿Te gusta el color?"',
            '"¿Eres de los nuestros?"',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué métrica predice mejor la salud de un onboarding cripto?',
          opciones: [
            'NPS',
            'Time to first transaction (TTFT) y drop-off por paso',
            'Cantidad de logins',
            'Followers en X',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿En qué momento se le paga al entrevistado?',
          opciones: [
            'Antes para asegurar que venga',
            'Al final, en USDC, después de completar la sesión',
            'Nunca',
            'A los 30 días',
          ],
          correcta: 1,
        },
      ],
    },
  ],
}

/* ============================================================
   CURSO · Figma para devs
   ============================================================ */
const cursoFigma: Curso = {
  id: 'figma-para-devs',
  titulo: 'Figma para devs',
  nivel: 'Principiante',
  duracion: '2 semanas',
  imagen: IMAGES.CURSOS.FIGMA,
  descripcion:
    'Aprende lo justo de Figma para entender entregables de diseño, extraer design tokens, usar Dev Mode y trabajar fluido con tu diseñadora.',
  precio: 0,
  precioPuma: 500,
  cohorteRef: 'v1',
  estudiantes: 0,
  rating: 5,
  categorias: ['Figma', 'Diseño', 'Productividad'],
  requisitos: 'Ninguno técnico. Útil si construyes UIs en React o cualquier framework.',
  lecciones: [
    {
      id: 1,
      titulo: 'Anatomía de Figma: páginas, frames, components',
      descripcion: 'Los conceptos centrales para no perderte en un archivo grande.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 1. La jerarquía de Figma

Un archivo Figma tiene:

- **Pages** (páginas): separan grandes secciones. Típicamente: \`📐 Foundations\`, \`🧩 Components\`, \`🖼 Designs\`, \`📦 Archive\`.
- **Frames**: rectángulos que actúan como pantallas o contenedores. Tienen layout (auto-layout) similar a Flexbox/CSS Grid.
- **Components**: piezas reutilizables. Como funciones React.
- **Instances**: usos de un component. Como llamadas a esa función.
- **Variants**: versiones de un component (ej. \`Button / primary / large / disabled\`). Como props.

### Auto-layout (lo más usado)

Equivalente CSS:

| Figma                | CSS                       |
|----------------------|---------------------------|
| Direction → Horizontal | flex-direction: row     |
| Spacing              | gap                       |
| Padding              | padding                   |
| Hug contents         | width: fit-content        |
| Fill container       | flex: 1                   |

Si entiendes Flexbox, dominas Auto-layout en 30 min.

### Constraints

Para responsive: define cómo crece un elemento al cambiar el frame padre. \`Left & Right\` = se estira. \`Center\` = se centra. Más rígido que auto-layout pero útil en frames legacy.

### Tip rápido para devs

Pasa el cursor sobre cualquier elemento. \`alt + hover\` te da distancias entre elementos. \`cmd/ctrl + /\` te muestra todos los shortcuts.`,
      cuestionario: [
        {
          pregunta: '¿Qué es un "component" en Figma?',
          opciones: [
            'Un archivo aparte',
            'Una pieza reutilizable de UI; sus usos son "instances"',
            'Un plugin',
            'Un layer de texto',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué propiedad CSS es análoga a "Auto-layout horizontal con spacing"?',
          opciones: [
            'display: block; margin',
            'display: flex; flex-direction: row; gap',
            'position: absolute; left',
            'grid-template-columns',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Para qué sirven los "variants" en un component?',
          opciones: [
            'Para guardar versiones distintas (tamaños, estados) como props del component',
            'Para ocultar componentes',
            'Para exportar PNG',
            'Para colaborar',
          ],
          correcta: 0,
        },
      ],
    },
    {
      id: 2,
      titulo: 'Design tokens y variables: del diseño al código',
      descripcion: 'Cómo evitar reinventar los colores y espaciados en cada lado.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 2. Design tokens

Un **token** es un alias semántico para un valor de diseño:

- \`color.primary\` → \`#D4AF37\` (no "el dorado" o "ese amarillo")
- \`space.md\` → \`16px\`
- \`radius.lg\` → \`24px\`

### Por qué importan

Cambias el valor en un lugar y se propaga. Tu CSS y el archivo Figma quedan **sincronizados**.

### Variables en Figma (modernas)

Desde 2023, Figma tiene **Variables** nativas:

\`\`\`
Collection: Colors
  Mode: Light    Mode: Dark
  primary: #D4AF37    primary: #F4D03F
  bg: #ffffff         bg: #0a0a0a
\`\`\`

Activas un mode en cada frame → cambia toda la paleta al instante.

### Llevarlos a código

Plugins exportan a:

- **CSS variables** (\`--color-primary: #D4AF37\`)
- **Tailwind config** (\`theme.colors.primary\`)
- **JSON** consumible por tu sistema de tokens (Style Dictionary).

Ejemplo con [Token Studio](https://docs.tokens.studio):

\`\`\`json
{
  "color": { "primary": { "value": "#D4AF37" } },
  "space": { "md": { "value": "16px" } }
}
\`\`\`

### Anti-patrones

- **Hardcodear colores y espaciados** sin pasar por tokens → un cambio se vuelve cacería.
- **Tokens semánticamente vacíos** como \`color.blue1\`, \`color.blue2\` → mejor \`color.brand.primary\`, \`color.brand.subtle\`.
- **Sincronización manual** entre Figma y código → automatízala desde el primer mes.`,
      cuestionario: [
        {
          pregunta: '¿Qué es un design token?',
          opciones: [
            'Un NFT',
            'Un alias semántico para un valor (color, espaciado, radius)',
            'Una password',
            'Un componente Figma',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué problema resuelve usar Variables de Figma con modes?',
          opciones: [
            'Compilar el archivo',
            'Soportar light/dark y temas alternos cambiando un solo control',
            'Reducir el costo de Figma',
            'Ocultar componentes',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué plugin/formato sirve para llevar tokens a CSS/Tailwind?',
          opciones: [
            'Discord Webhook',
            'Token Studio o exportadores similares (Style Dictionary)',
            'Notion API',
            'Webpack',
          ],
          correcta: 1,
        },
      ],
    },
    {
      id: 3,
      titulo: 'Dev Mode y handoff: inspect, export, MCP de Figma',
      descripcion: 'Cómo extraer código y assets sin pedirle todo al diseñador.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 3. Dev Mode

Figma tiene un **Dev Mode** dedicado al developer. Te muestra:

- **Inspect**: ancho, alto, paddings, colores, fuentes en CSS, Swift, Compose, etc.
- **Code snippets**: para Tailwind, CSS variables, SwiftUI, Compose.
- **Connected components**: si el diseñador mapeó un component Figma a uno de tu codebase (Code Connect), ves cómo usarlo.
- **Tasks**: el diseñador asigna marcos como "ready for dev" y tú los ves filtrados.

### Export assets

Para SVG/PNG/PDF:

1. Selecciona el frame/component.
2. Panel derecho → **Export**.
3. Configura @2×, @3×, formato.

**Para iconos**: exporta a SVG y usa una librería como \`@svgr\` para convertirlos a componentes React.

### MCP de Figma (con Claude)

El **MCP server de Figma** permite a Claude Code (o cualquier cliente MCP) leer el archivo Figma directamente:

- \`get_design_context(node_id)\` → te da estructura + estilos + tokens.
- \`get_screenshot(node_id)\` → captura del diseño para que el agente compare visualmente.
- \`generate_diagram\` → crea diagramas FigJam.

Workflow típico:

> "Lee el frame \`Login / Mobile\` y genera el componente React + Tailwind. Sigue los tokens del proyecto."

Claude lee Figma, escribe el código, tú revisas. **Reduce ~70 % del tiempo de handoff** cuando el design system está bien tokenizado.

### Buenos hábitos

- **No copies pixel-perfect ciegamente**: la lógica de estado (hover, focus, disabled) muchas veces no está en Figma.
- **Pregunta antes**: si un comportamiento no es obvio, márcalo en un comentario en el frame.
- **Aporta de regreso**: cuando codees algo distinto del Figma por buena razón (responsive, accesibilidad), comenta en el frame para cerrar el loop.`,
      cuestionario: [
        {
          pregunta: '¿Qué te da Dev Mode en Figma?',
          opciones: [
            'Acceso al wallet',
            'Inspect de medidas/estilos, code snippets y connected components',
            'Solo PNGs',
            'Acceso a Slack',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué permite el MCP server de Figma con Claude?',
          opciones: [
            'Que Claude lea archivos Figma directamente y genere código contra ellos',
            'Reemplazar a Figma',
            'Exportar a PDF automáticamente',
            'Editar diseños sin permisos',
          ],
          correcta: 0,
        },
        {
          pregunta: '¿Buena práctica si tu código se aleja del Figma por razón válida?',
          opciones: [
            'No decir nada',
            'Comentar en el frame para que el diseñador cierre el loop',
            'Borrar el frame',
            'Cambiar Figma sin avisar',
          ],
          correcta: 1,
        },
      ],
    },
  ],
}

/* ============================================================
   CURSO · Canva para comunidad cripto
   ============================================================ */
const cursoCanva: Curso = {
  id: 'canva-comunidad-cripto',
  titulo: 'Canva para comunidad cripto',
  nivel: 'Principiante',
  duracion: '1 semana',
  imagen: IMAGES.CURSOS.CANVA,
  descripcion:
    'Crea piezas visuales consistentes y rápidas para X, Instagram, decks y newsletters sin necesidad de un diseñador. Kit de marca + plantillas + batch.',
  precio: 0,
  precioPuma: 500,
  cohorteRef: 'v1',
  estudiantes: 0,
  rating: 5,
  categorias: ['Canva', 'Diseño', 'Comunidad', 'Marketing'],
  requisitos: 'Ninguno. Funciona desde el navegador, gratis para empezar.',
  lecciones: [
    {
      id: 1,
      titulo: 'Setup: kit de marca y plantillas base',
      descripcion: 'Las decisiones que tomas una sola vez y te salvan meses.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 1. Kit de marca

Lo primero que haces al abrir Canva para tu proyecto:

### Brand Kit

En Canva Pro / Teams:

1. **Brand → Brand Kit**.
2. Sube **logos** (versión principal, monocroma, isotipo).
3. Define **paleta** (4–6 colores). Pega los HEX exactos que ya usas en la web/Figma.
4. Define **tipografías** (1 display + 1 cuerpo). Si compraste licencia tipo Adobe Fonts, súbela como custom font.
5. Define **assets** (patrones, gradientes, iconos comunes).

### Plantillas base

Crea o adapta plantillas para los formatos que repites:

| Formato         | Tamaño        | Uso                          |
|-----------------|---------------|------------------------------|
| Tweet card      | 1600 × 900    | X, LinkedIn                  |
| Instagram post  | 1080 × 1080   | Feed                         |
| Story / Reel    | 1080 × 1920   | Stories, TikTok              |
| Cover article   | 1600 × 840    | Newsletter, banners web      |
| Deck slide      | 1920 × 1080   | Presentaciones, webinar      |

### Anti-patrones de inicio

- **Empezar cada diseño en blanco** → siempre desde una plantilla.
- **Mezclar fuentes random** → 1–2 máximo.
- **No nombrar carpetas** → caos a las 2 semanas. Estructura: \`/Brand\`, \`/Eventos\`, \`/Newsletter\`, \`/Drafts\`.`,
      cuestionario: [
        {
          pregunta: '¿Qué te permite definir el Brand Kit de Canva?',
          opciones: [
            'Solo el logo',
            'Logos, paleta, tipografías y assets reutilizables del proyecto',
            'Tokens cripto',
            'Una blockchain',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Cuántas tipografías típicamente recomienda este curso?',
          opciones: ['1–2', '5–6', '10', 'Las que sean'],
          correcta: 0,
        },
        {
          pregunta: '¿Qué tamaño aproximado se usa para un Instagram post cuadrado?',
          opciones: ['600 × 600', '1080 × 1080', '1920 × 1080', '2000 × 1000'],
          correcta: 1,
        },
      ],
    },
    {
      id: 2,
      titulo: 'Posts en lote: workflow batch para redes',
      descripcion: 'Cómo dejar lista 1 semana de contenido en 1 sesión.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 2. Batch creativo

### La sesión semanal

Bloquea **90 min** un día de la semana. En esa sesión:

1. **Define los 5–7 mensajes** que quieres comunicar.
2. **Abre tu plantilla "Tweet card"** y duplica una página por mensaje.
3. **Cambia solo el copy y, si acaso, la imagen central**. Mantén la composición.
4. **Exporta todo** (Canva permite descargar el archivo entero como PNGs/PDFs múltiples).
5. **Programa** desde Canva (integración con Buffer/Hootsuite) o sube manual.

### Magic Studio (IA)

Canva tiene varias herramientas IA útiles:

- **Magic Write**: copy automático sobre prompts (úsalo como borrador, no final).
- **Magic Edit**: edita una zona específica de una imagen.
- **Background Remover**: 1 click para quitar fondo.
- **Magic Resize**: una plantilla a múltiples tamaños (Pro/Teams).

### Reglas para que las piezas se sientan tuyas

- **Misma paleta** en toda la serie.
- **Mismo tipo de jerarquía**: si en una pieza el headline va arriba grande, en todas igual.
- **1–3 elementos de marca recurrentes** (un patrón geométrico, un firma visual).

### Errores comunes

- **Imágenes stock genéricas** → la pieza pierde personalidad.
- **Color inconsistente** entre piezas → revisa que estés tomando los HEX desde Brand Kit.
- **Texto sobre fondo de bajo contraste** → siempre testea con simulador de daltonismo / dark theme.`,
      cuestionario: [
        {
          pregunta: '¿Qué duración aproximada recomienda este curso para una sesión batch?',
          opciones: ['10 min', '90 min', '4 horas', '1 día'],
          correcta: 1,
        },
        {
          pregunta: '¿Qué hace Magic Resize en Canva?',
          opciones: [
            'Borra el fondo',
            'Convierte una plantilla a múltiples tamaños (post, story, banner)',
            'Genera copy',
            'Cambia el idioma',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué regla mantiene una serie coherente?',
          opciones: [
            'Cambiar paleta cada post',
            'Mantener la misma paleta y jerarquía visual entre piezas',
            'Usar imágenes stock cada vez',
            'Tipografía distinta por pieza',
          ],
          correcta: 1,
        },
      ],
    },
    {
      id: 3,
      titulo: 'Decks y newsletters: storytelling visual',
      descripcion: 'Cómo hacer una presentación o newsletter que la gente sí lea.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 3. Decks y newsletters

### Estructura de un deck que funciona

1. **Hook** (1 slide): una afirmación que prende interés. Sin logo. Sin agenda.
2. **Problema** (1–2 slides): qué está roto / qué duele.
3. **Insight** (1 slide): la idea no-obvia que conecta.
4. **Solución** (3–5 slides): qué propones, cómo funciona, evidencia.
5. **Llamado a acción** (1 slide): qué quieres que pase ahora.

10–15 slides es ideal. **Más de 25 = pierdes a la audiencia**.

### Reglas tipográficas para slides

- **1 idea por slide** (si necesitas 3, son 3 slides).
- **Tamaño de texto ≥ 24 pt** (proyector friendly).
- **Espacio negativo es bueno**.

### Newsletters en Canva

Si tu newsletter va por email (Mailchimp, Beehiiv, Substack), tu pieza puede ser:

- **Imagen hero** (1600 × 840) para abrir.
- **Cards horizontales** dentro del email.
- **Pieza social derivada** del mismo contenido para X.

Si lo publicas como PDF (memo, report mensual):

- 1 portada visual.
- Cuerpo con jerarquía: headline → sub → cuerpo → CTA.
- Footer con créditos y links.

### Video corto (Reel, TikTok)

Canva exporta MP4 con transiciones. Para piezas de 15–30 s:

- **Hook en los primeros 2 s**.
- **Texto grande** (60–80 % de la pantalla lo lee gente sin audio).
- **Música subtle** (Canva tiene biblioteca con licencia).

### Métrica blanda útil

Cuando publiques algo nuevo, espera **3 días** y revisa:

- Engagement rate (likes + comments + shares) / impresiones.
- Si > 4 % consistente, la fórmula está jalando. Si < 1 %, cambia hook o formato.`,
      cuestionario: [
        {
          pregunta: '¿Cuántos slides es el rango ideal para un deck efectivo?',
          opciones: ['3–5', '10–15', '30–40', '50+'],
          correcta: 1,
        },
        {
          pregunta: '¿Qué tamaño mínimo de texto recomienda este curso para slides?',
          opciones: ['8 pt', '14 pt', '24 pt', '60 pt'],
          correcta: 2,
        },
        {
          pregunta: '¿Qué métrica blanda usar para evaluar una pieza social a 3 días?',
          opciones: [
            'Cantidad de followers ganados',
            'Engagement rate (likes + comments + shares) / impresiones',
            'Solo likes',
            'Visualizaciones del founder',
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
export const cursosNegocioDiseno: Curso[] = [
  cursoMarketingCripto,
  cursoModelosNegocio,
  cursoTokenomics,
  cursoDisenoProducto,
  cursoFigma,
  cursoCanva,
]
