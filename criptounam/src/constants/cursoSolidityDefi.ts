import type { Capitulo } from './cursosData'

export const capitulosSolidity: Capitulo[] = [
  {
    id: 1,
    titulo: 'Capítulo 1: Arquitectura de Ethereum y Solidity',
    descripcion: 'Del modelo de cuentas a la EVM y el ciclo completo de un contrato.',
    secciones: [
      {
        id: 1,
        titulo: '1.1 EVM, contratos y ejecución determinista',
        descripcion: 'Cómo se ejecuta Solidity, por qué el gas existe y qué significa estado global.',
        guia: `## 1.1 EVM, contratos y ejecución determinista

Solidity compila a bytecode para la **EVM**. Miles de nodos replican exactamente la misma ejecución para llegar al mismo estado final.

### Piezas del modelo

- **Cuenta EOA**: controlada por clave privada.
- **Cuenta de contrato**: controlada por código.
- **Estado global**: balance, nonce, storage y bytecode.
- **Gas**: costo computacional de ejecutar instrucciones.

### ¿Por qué importa?

En backend tradicional puedes "arreglar en caliente". En smart contracts, errores de diseño cuestan dinero real y son públicos.`,
        cuestionario: [
          {
            pregunta: '¿Qué tipo de cuenta está controlada por código?',
            opciones: ['EOA', 'Cuenta de contrato', 'Cuenta bancaria', 'Cuenta cold'],
            correcta: 1,
          },
          {
            pregunta: '¿Para qué sirve el gas en Ethereum?',
            opciones: ['Para pagar dominio web', 'Para medir y pagar cómputo', 'Para cifrar ABI', 'Para minar NFTs'],
            correcta: 1,
          },
          {
            pregunta: '¿Qué propiedad debe mantener la ejecución en nodos?',
            opciones: ['Aleatoria', 'Determinista', 'Privada', 'Parcial'],
            correcta: 1,
          },
        ],
      },
      {
        id: 2,
        titulo: '1.2 Sintaxis esencial y modelado de estado',
        descripcion: 'Tipos, estructuras y decisiones de modelado para contratos mantenibles.',
        guia: `## 1.2 Sintaxis esencial y modelado de estado

En Solidity, modelar bien el estado evita bugs y reduce gas.

### Tipos y estructuras recomendadas

- \`uint256\` para montos.
- \`mapping(address => uint256)\` para balances.
- \`struct\` para agrupar entidades.
- \`enum\` para estados de flujo.

### Reglas prácticas

- Guarda solo lo necesario on-chain.
- Expón lecturas con funciones \`view\`.
- Mantén invariantes claras (ej. totalSupply).`,
        cuestionario: [
          {
            pregunta: '¿Qué estructura representa mejor un balance por usuario?',
            opciones: ['array', 'mapping(address => uint256)', 'string', 'enum'],
            correcta: 1,
          },
          {
            pregunta: '¿Cuál función no modifica estado?',
            opciones: ['payable', 'view', 'constructor', 'event'],
            correcta: 1,
          },
          {
            pregunta: '¿Qué ayuda a modelar flujos de estado finitos?',
            opciones: ['bytes', 'enum', 'mapping', 'address'],
            correcta: 1,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    titulo: 'Capítulo 2: Funciones, eventos y patrones de diseño',
    descripcion: 'Diseño de interfaces robustas y trazabilidad para frontends y analítica.',
    secciones: [
      {
        id: 3,
        titulo: '2.1 Funciones, visibilidad y modificadores',
        descripcion: 'Diseño de API del contrato y control de acceso.',
        guia: `## 2.1 Funciones, visibilidad y modificadores

Cada función define **quién** la puede llamar y **cómo** afecta estado.

### Visibilidad

- \`public\`, \`external\`, \`internal\`, \`private\`

### Mutabilidad

- \`view\`: no cambia estado
- \`pure\`: no lee ni cambia estado

### Acceso

Centraliza reglas con modificadores (\`onlyOwner\`, \`whenNotPaused\`) para no duplicar lógica.`,
        cuestionario: [
          {
            pregunta: '¿Qué visibilidad se usa solo desde fuera del contrato?',
            opciones: ['public', 'external', 'internal', 'private'],
            correcta: 1,
          },
          {
            pregunta: '¿Qué hace un modificador?',
            opciones: ['Compila más rápido', 'Aplica reglas reutilizables antes/después de una función', 'Borra storage', 'Genera ABI'],
            correcta: 1,
          },
          {
            pregunta: '¿Qué función no lee ni escribe estado?',
            opciones: ['view', 'pure', 'public', 'payable'],
            correcta: 1,
          },
        ],
      },
      {
        id: 4,
        titulo: '2.2 Eventos, errores y legibilidad para dApps',
        descripcion: 'Cómo comunicar cambios y fallos de forma eficiente.',
        guia: `## 2.2 Eventos, errores y legibilidad para dApps

Los frontends y dashboards no deben depender solo de lecturas continuas: los **eventos** son fundamentales.

### Eventos

- Publica cambios importantes (\`Transfer\`, \`Deposited\`, \`RoleGranted\`).
- Usa campos \`indexed\` para filtrar más rápido.

### Errores

- Prefiere \`custom errors\` sobre strings largas para ahorrar gas.
- Usa mensajes claros en \`require\` cuando aplique.

### Beneficio

Un contrato con buen diseño de eventos/errores es más simple de integrar, auditar y monitorear.`,
        cuestionario: [
          {
            pregunta: '¿Para qué sirven los eventos?',
            opciones: ['Guardar archivos', 'Emitir registros de cambios para consumo externo', 'Compilar bytecode', 'Firmar transacciones'],
            correcta: 1,
          },
          {
            pregunta: '¿Qué ayuda a filtrar eventos eficientemente?',
            opciones: ['indexed', 'private', 'view', 'bytes32[] dinámico'],
            correcta: 0,
          },
          {
            pregunta: '¿Qué opción suele ahorrar más gas al manejar errores?',
            opciones: ['Strings largas siempre', 'Custom errors', 'Sin validaciones', 'Solo console.log'],
            correcta: 1,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    titulo: 'Capítulo 3: Seguridad, pruebas y despliegue',
    descripcion: 'Cómo construir contratos confiables antes de producción.',
    secciones: [
      {
        id: 5,
        titulo: '3.1 Vulnerabilidades frecuentes',
        descripcion: 'Reentrancy, access control, oracle risk y errores de integración.',
        guia: `## 3.1 Vulnerabilidades frecuentes

Los exploits más comunes no son "mágicos": suelen venir de patrones repetidos.

### Riesgos principales

- Reentrancy
- Control de acceso débil
- Dependencia de oráculos sin validación
- Uso incorrecto de \`delegatecall\`
- Suposiciones erróneas sobre tokens (fees, rebasing)

### Mitigaciones base

- Checks-effects-interactions
- Roles explícitos
- Pausable + circuit breaker
- Tests de propiedades y edge cases`,
        cuestionario: [
          {
            pregunta: '¿Qué patrón reduce riesgo de reentrancy?',
            opciones: ['Interactions primero', 'Checks-effects-interactions', 'Solo modifiers', 'Sin require'],
            correcta: 1,
          },
          {
            pregunta: '¿Qué control ayuda en incidentes en producción?',
            opciones: ['selfdestruct inmediato', 'Pausable/circuit breaker', 'Remover eventos', 'Quitar ownership'],
            correcta: 1,
          },
          {
            pregunta: '¿Cuál es una causa común de exploit?',
            opciones: ['Demasiados comentarios', 'Suposiciones incorrectas sobre integraciones externas', 'ABI corto', 'Usar mapping'],
            correcta: 1,
          },
        ],
      },
      {
        id: 6,
        titulo: '3.2 Estrategia de testing y release',
        descripcion: 'Unit tests, fuzzing y checklist de despliegue.',
        guia: `## 3.2 Estrategia de testing y release

No basta con "compila": necesitas confianza de comportamiento.

### Pirámide recomendada

1. Unit tests por función.
2. Integration tests con contratos externos mockeados.
3. Fuzz tests para entradas no previstas.
4. Simulación de escenarios económicos.

### Antes de mainnet

- Verificación de bytecode en explorer.
- Revisión de roles y ownership.
- Límite de riesgo (caps, pausado, timelock).
- Monitoreo inicial de eventos críticos.`,
        cuestionario: [
          {
            pregunta: '¿Qué busca un fuzz test?',
            opciones: ['Solo rendimiento visual', 'Comportamientos inesperados con muchas entradas', 'Reducir ABI', 'Crear wallets'],
            correcta: 1,
          },
          {
            pregunta: '¿Qué conviene revisar antes de mainnet?',
            opciones: ['Solo nombre del token', 'Roles, ownership y límites de riesgo', 'Color del frontend', 'Cantidad de commits'],
            correcta: 1,
          },
          {
            pregunta: '¿Qué aporta verificar contrato en explorer?',
            opciones: ['Nada', 'Transparencia y trazabilidad del código desplegado', 'Menos gas en todas las tx', 'Cambiar bytecode'],
            correcta: 1,
          },
        ],
      },
    ],
  },
]

export const capitulosDefi: Capitulo[] = [
  {
    id: 1,
    titulo: 'Capítulo 1: Fundamentos de protocolos DeFi',
    descripcion: 'Cómo se estructuran los servicios financieros abiertos y sus piezas base.',
    secciones: [
      {
        id: 1,
        titulo: '1.1 Qué es DeFi y qué problemas resuelve',
        descripcion: 'De servicios financieros tradicionales a protocolos abiertos.',
        guia: `## 1.1 Qué es DeFi y qué problemas resuelve

**DeFi** (Decentralized Finance) es un conjunto de protocolos financieros construidos sobre blockchain.

### Diferencia principal

- TradFi: intermediarios (banco, cámara de compensación).
- DeFi: contratos inteligentes abiertos y verificables.

### Ventajas

- Acceso global 24/7.
- Componibilidad (un protocolo encima de otro).
- Transparencia de reglas y transacciones.`,
        cuestionario: [
          {
            pregunta: '¿Qué reemplaza DeFi en muchos casos?',
            opciones: ['Internet', 'Intermediarios financieros', 'Wallets', 'Minería'],
            correcta: 1,
          },
          {
            pregunta: '¿Qué significa composabilidad en DeFi?',
            opciones: [
              'Solo usar una app',
              'Combinar protocolos como bloques reutilizables',
              'Minar más rápido',
              'Reducir todas las fees a cero',
            ],
            correcta: 1,
          },
          {
            pregunta: '¿Qué característica es clave en DeFi?',
            opciones: ['Código cerrado', 'Reglas transparentes on-chain', 'Acceso por sucursal', 'Horario bancario'],
            correcta: 1,
          },
        ],
      },
      {
        id: 2,
        titulo: '1.2 Tokens, stablecoins, wallets y permisos',
        descripcion: 'Activos base, gestión de aprobaciones y prácticas de seguridad de usuario.',
        guia: `## 1.2 Tokens, stablecoins, wallets y permisos

Para usar DeFi necesitas activos y una wallet autocustodia.

### Elementos base

- Tokens ERC-20.
- Stablecoins (USDC, USDT, DAI).
- Wallets (MetaMask, Rabby, etc).

### Permisos (allowances)

Cuando usas un protocolo, normalmente autorizas gasto de tokens con \`approve\`. Es crítico:

- Revisar monto aprobado.
- Revocar approvals que ya no uses.
- Evitar "infinite approvals" en apps no confiables.

### Riesgos base

- Error de red/cadena.
- Aprobar contratos maliciosos.
- Custodia insegura de seed phrase.`,
        cuestionario: [
          {
            pregunta: '¿Qué estándar representa la mayoría de tokens fungibles en Ethereum?',
            opciones: ['ERC-20', 'ERC-721', 'ERC-1155', 'BEP-2'],
            correcta: 0,
          },
          {
            pregunta: '¿Para qué se usan stablecoins en DeFi?',
            opciones: ['Solo coleccionables', 'Reducir volatilidad en operaciones', 'Minar bloques', 'Crear claves privadas'],
            correcta: 1,
          },
          {
            pregunta: '¿Qué práctica es insegura?',
            opciones: ['Usar hardware wallet', 'Compartir la seed phrase', 'Revisar permisos', 'Verificar red'],
            correcta: 1,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    titulo: 'Capítulo 2: Protocolos DeFi en práctica',
    descripcion: 'DEX, lending, derivados y estrategias de rendimiento.',
    secciones: [
      {
        id: 3,
        titulo: '2.1 DEX, lending y mercados monetarios',
        descripcion: 'Cómo funciona la liquidez y la deuda en protocolos abiertos.',
        guia: `## 2.1 Protocolos principales

### DEX (intercambios descentralizados)

Permiten swaps sin custodio mediante AMMs y pools de liquidez.

### Lending/Borrowing

Protocolos donde depositas colateral para pedir préstamo.

### Mercado monetario

El APY en lending no es fijo: cambia con oferta/demanda.

- Si hay mucha demanda de préstamo, sube tasa de borrow.
- Si cae utilización, baja rendimiento de proveedores.

### Staking / Restaking

Mecanismos para obtener rendimiento por asegurar protocolos o delegar activos.`,
        cuestionario: [
          {
            pregunta: '¿Qué suele usar un DEX para determinar precios?',
            opciones: ['Sucursales físicas', 'AMM y pools de liquidez', 'Banco central', 'Proof of Work'],
            correcta: 1,
          },
          {
            pregunta: '¿Qué requiere normalmente pedir prestado en DeFi?',
            opciones: ['Solo email', 'Colateral', 'Tarjeta bancaria', 'Cuenta en sucursal'],
            correcta: 1,
          },
          {
            pregunta: '¿Qué describe mejor staking en este contexto?',
            opciones: ['Guardar PDF', 'Bloquear/delegar activos para rendimiento y seguridad', 'Cambiar seed phrase', 'Minar Bitcoin'],
            correcta: 1,
          },
        ],
      },
      {
        id: 4,
        titulo: '2.2 Yield, farming y métricas clave',
        descripcion: 'Cómo leer APY/APR y diferenciar rendimiento real de incentivos temporales.',
        guia: `## 2.2 Yield, farming y métricas clave

En DeFi, "alto rendimiento" no siempre significa "mejor inversión".

### APR vs APY

- **APR**: tasa simple anual.
- **APY**: incluye reinversión (compounding).

### De dónde sale el rendimiento

- Comisiones de protocolo (más sostenible).
- Emisiones de tokens de incentivo (pueden diluirse rápido).
- Arbitraje temporal de mercado.

### Señales de alerta

- APY extremadamente alto sin explicación.
- Liquidez muy baja.
- Tokenomics inflacionaria.`,
        cuestionario: [
          {
            pregunta: '¿Qué incluye APY que APR no incluye?',
            opciones: ['Gas', 'Compounding', 'Riesgo regulatorio', 'Slippage'],
            correcta: 1,
          },
          {
            pregunta: '¿Qué fuente de rendimiento suele ser más sostenible?',
            opciones: ['Comisiones reales del protocolo', 'Solo emisiones sin demanda', 'Airdrops aleatorios', 'Rumores de mercado'],
            correcta: 0,
          },
          {
            pregunta: '¿Qué es una señal de alerta en farming?',
            opciones: ['APY explicada y auditada', 'APY extremadamente alta sin fundamentos', 'Liquidez profunda', 'Histórico estable'],
            correcta: 1,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    titulo: 'Capítulo 3: Gestión de riesgo y operación responsable',
    descripcion: 'Marco práctico para operar DeFi sin sobreexposición.',
    secciones: [
      {
        id: 5,
        titulo: '3.1 Riesgos críticos: liquidación, IL y smart contract risk',
        descripcion: 'Riesgos de mercado y de protocolo que más afectan a usuarios.',
        guia: `## 2.2 Riesgos en DeFi

Antes de buscar rendimiento, entiende el riesgo.

### Riesgos clave

- **Liquidación**: si tu colateral cae, puedes perder posición.
- **Impermanent loss**: en LPs, variaciones de precio reducen rendimiento frente a holdear.
- **Smart contract risk**: bugs o exploits.
- **Riesgo de oráculo**: precio incorrecto afecta protocolos.

### Buenas prácticas

- Empieza con montos pequeños.
- Diversifica protocolos.
- Verifica auditorías y reputación.
- Monitorea health factor y permisos.`,
        cuestionario: [
          {
            pregunta: '¿Qué puede disparar una liquidación?',
            opciones: ['Subir APY', 'Caída del valor del colateral', 'Cambiar wallet', 'Publicar un NFT'],
            correcta: 1,
          },
          {
            pregunta: '¿Dónde aparece impermanent loss típicamente?',
            opciones: ['Wallet fría', 'Provisión de liquidez en AMMs', 'Mint de NFT', 'Solo en CEX'],
            correcta: 1,
          },
          {
            pregunta: '¿Qué reduce riesgo operativo?',
            opciones: ['Concentrar todo en un protocolo', 'Usar montos pequeños y monitorear posiciones', 'Ignorar auditorías', 'Compartir seed phrase'],
            correcta: 1,
          },
        ],
      },
      {
        id: 6,
        titulo: '3.2 Playbook de gestión de portafolio DeFi',
        descripcion: 'Cómo definir exposición, rebalanceo y límites de pérdida.',
        guia: `## 3.2 Playbook de gestión de portafolio DeFi

Un enfoque profesional prioriza supervivencia antes que rendimiento máximo.

### Reglas operativas

1. Define exposición máxima por protocolo.
2. Usa wallets separadas por estrategia (core / experimental).
3. Mantén liquidez de emergencia fuera de estrategias ilíquidas.
4. Rebalancea periódicamente según riesgo, no solo según rendimiento.

### Checklist antes de entrar

- ¿Contrato auditado y battle-tested?
- ¿TVL y volumen coherentes?
- ¿Entiendo condiciones de salida?
- ¿Puedo tolerar pérdida parcial o total?

La disciplina reduce errores más que cualquier "alpha".`,
        cuestionario: [
          {
            pregunta: '¿Qué reduce riesgo de contagio entre estrategias?',
            opciones: ['Una sola wallet para todo', 'Separar wallets por estrategia', 'Solo stablecoins', 'Evitar rebalancear'],
            correcta: 1,
          },
          {
            pregunta: '¿Qué evaluar antes de entrar a un protocolo?',
            opciones: ['Solo APY', 'Auditoría, liquidez, condiciones de salida y tolerancia a pérdida', 'Color del logo', 'Cantidad de tweets'],
            correcta: 1,
          },
          {
            pregunta: '¿Cuál es el objetivo principal de la gestión de riesgo?',
            opciones: ['Maximizar APY a cualquier costo', 'Sobrevivir y sostener estrategia en el tiempo', 'Operar diario', 'Evitar estudiar'],
            correcta: 1,
          },
        ],
      },
    ],
  },
]

export const examenFinalSolidity = [
  {
    pregunta: '¿Qué tipo de cuenta en Ethereum está controlada por código?',
    opciones: ['EOA', 'Cuenta de contrato', 'Cuenta de minero', 'Cuenta de exchange'],
    correcta: 1,
  },
  {
    pregunta: '¿Cuál es el propósito principal del gas en Ethereum?',
    opciones: [
      'Pagar por el almacenamiento de archivos',
      'Medir y pagar por el costo computacional de ejecutar instrucciones',
      'Cifrar las transacciones',
      'Minar nuevos bloques',
    ],
    correcta: 1,
  },
  {
    pregunta: '¿Qué estructura de datos es la más recomendada para almacenar los balances de los usuarios en un contrato ERC-20?',
    opciones: ['array', 'mapping(address => uint256)', 'struct', 'enum'],
    correcta: 1,
  },
  {
    pregunta: 'Si una función solo lee el estado pero no lo modifica, ¿qué modificador de mutabilidad debe usar?',
    opciones: ['payable', 'pure', 'view', 'external'],
    correcta: 2,
  },
  {
    pregunta: '¿Qué visibilidad restringe el acceso a una función para que solo pueda ser llamada desde fuera del contrato?',
    opciones: ['public', 'external', 'internal', 'private'],
    correcta: 1,
  },
  {
    pregunta: '¿Por qué es recomendable usar "custom errors" en lugar de strings largas en los "require"?',
    opciones: [
      'Porque son más fáciles de leer',
      'Porque ahorran una cantidad significativa de gas al desplegar y ejecutar',
      'Porque previenen reentrancy',
      'Porque son obligatorios en Solidity 0.8+',
    ],
    correcta: 1,
  },
  {
    pregunta: '¿Qué patrón de diseño es la principal defensa contra los ataques de reentrancy?',
    opciones: [
      'Usar solo funciones private',
      'El patrón Checks-Effects-Interactions',
      'Pausar el contrato después de cada transacción',
      'Usar delegatecall en todas las funciones',
    ],
    correcta: 1,
  },
  {
    pregunta: '¿Para qué sirve un "circuit breaker" o patrón "Pausable" en un contrato inteligente?',
    opciones: [
      'Para detener la ejecución de funciones críticas en caso de detectar una vulnerabilidad o hackeo',
      'Para reducir el costo de gas',
      'Para actualizar el bytecode del contrato',
      'Para borrar el storage',
    ],
    correcta: 0,
  },
  {
    pregunta: '¿Qué tipo de prueba busca encontrar comportamientos inesperados proporcionando muchas entradas aleatorias?',
    opciones: ['Unit test', 'Integration test', 'Fuzz test', 'E2E test'],
    correcta: 2,
  },
  {
    pregunta: '¿Por qué es importante verificar el código fuente de un contrato en un explorador de bloques (como Etherscan)?',
    opciones: [
      'Para que el contrato se ejecute más rápido',
      'Para proveer transparencia y permitir que cualquiera audite el código que realmente se está ejecutando',
      'Para evitar pagar gas',
      'Para poder actualizar el contrato',
    ],
    correcta: 1,
  },
]

export const examenFinalDefi = [
  {
    pregunta: '¿Cuál es la principal diferencia entre DeFi y las finanzas tradicionales (TradFi)?',
    opciones: [
      'DeFi solo usa Bitcoin',
      'DeFi reemplaza a los intermediarios centralizados por contratos inteligentes abiertos',
      'DeFi tiene horarios de operación',
      'DeFi requiere KYC obligatorio',
    ],
    correcta: 1,
  },
  {
    pregunta: '¿Qué significa la "composabilidad" en DeFi?',
    opciones: [
      'La capacidad de crear tokens',
      'La capacidad de combinar diferentes protocolos como si fueran bloques de Lego',
      'La capacidad de minar bloques',
      'La capacidad de recuperar fondos perdidos',
    ],
    correcta: 1,
  },
  {
    pregunta: '¿Qué función cumple típicamente una stablecoin en un portafolio DeFi?',
    opciones: [
      'Maximizar las ganancias a largo plazo',
      'Reducir la volatilidad y servir como unidad de cuenta estable',
      'Pagar por el gas',
      'Votar en la gobernanza',
    ],
    correcta: 1,
  },
  {
    pregunta: '¿Qué mecanismo utilizan los DEX (como Uniswap) para determinar el precio de los activos?',
    opciones: [
      'Un libro de órdenes centralizado',
      'Un Automated Market Maker (AMM) y pools de liquidez',
      'Oráculos de precio externos exclusivamente',
      'Subastas diarias',
    ],
    correcta: 1,
  },
  {
    pregunta: '¿Qué riesgo asume un usuario al proveer liquidez a un pool de un DEX?',
    opciones: [
      'Riesgo de inflación',
      'Impermanent loss (pérdida impermanente)',
      'Riesgo de crédito',
      'Riesgo de contraparte',
    ],
    correcta: 1,
  },
  {
    pregunta: '¿Qué diferencia principal existe entre APR y APY?',
    opciones: [
      'El APR es siempre más alto',
      'El APY asume la reinversión de los rendimientos (compounding), el APR no',
      'El APR incluye el costo de gas',
      'No hay diferencia, son sinónimos',
    ],
    correcta: 1,
  },
  {
    pregunta: '¿Qué evento puede desencadenar la liquidación de una posición de deuda en un protocolo de lending?',
    opciones: [
      'El aumento del APY',
      'La caída del valor del colateral por debajo del umbral de mantenimiento',
      'El retiro de fondos de otros usuarios',
      'Un airdrop',
    ],
    correcta: 1,
  },
  {
    pregunta: '¿Cuál de las siguientes es una señal de alerta (red flag) al evaluar un protocolo de yield farming?',
    opciones: [
      'Código auditado por múltiples firmas',
      'Un APY extremadamente alto sostenido únicamente por la emisión de un token inflacionario',
      'Liquidez profunda en el pool',
      'Equipo con reputación pública',
    ],
    correcta: 1,
  },
  {
    pregunta: '¿Qué es el "Smart Contract Risk"?',
    opciones: [
      'El riesgo de que el precio del token baje',
      'El riesgo de que el contrato tenga bugs o vulnerabilidades que permitan un exploit',
      'El riesgo de perder la seed phrase',
      'El riesgo de que la red se congele',
    ],
    correcta: 1,
  },
  {
    pregunta: '¿Cuál es una buena práctica recomendada para la gestión de riesgo en DeFi?',
    opciones: [
      'Poner todos los fondos en el protocolo con mayor APY',
      'Separar estrategias en diferentes wallets y definir límites de exposición por protocolo',
      'Aprobar gasto infinito en todos los contratos para ahorrar gas',
      'Ignorar las auditorías si el TVL es alto',
    ],
    correcta: 1,
  },
]
