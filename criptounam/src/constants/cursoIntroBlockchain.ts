import type { Capitulo } from './cursosData'

/**
 * Curso "Introducción a Blockchain" — Contenido tipo libro didáctico.
 * Capítulos y secciones con guías, código, flujos y referencias bibliográficas.
 */
export const capitulosIntroBlockchain: Capitulo[] = [
  // ========== CAPÍTULO 1: Antes de Satoshi ==========
  {
    id: 1,
    titulo: 'Capítulo 1: Antes de Satoshi',
    descripcion: 'Contexto histórico: dinero, criptografía y las ideas que llevaron a Bitcoin.',
    secciones: [
      {
        id: 1,
        titulo: '1.1 Dinero, confianza y registros',
        descripcion: 'De qué sirve el dinero y por qué necesitamos registros compartidos.',
        guia: `## 1.1 Dinero, confianza y registros

Para entender **blockchain** no basta con la técnica: hace falta el **contexto**. ¿Por qué surgió Bitcoin? ¿Qué problema resuelve?

### El problema del registro

Desde siempre, los humanos hemos necesitado **registrar** quién tiene qué: tierras, grano, dinero. Ese registro suele estar en manos de una **autoridad central** (un rey, un banco, un notario). Si confías en esa autoridad, el sistema funciona. Si no, surgen el fraude y la disputa.

### Dinero fiduciario y bancos

El **dinero fiduciario** (euros, dólares) no tiene valor por sí mismo: vale porque **confiamos** en el emisor (el Estado) y en los bancos que llevan las cuentas. Esos intermediarios pueden:

- Congelar cuentas
- Inflar la moneda
- Cobrar comisiones y limitar el acceso

En **2008**, la crisis financiera puso en duda esa confianza. Mucha gente empezó a preguntarse: *¿y si pudiéramos tener un registro de quién tiene qué **sin depender de un banco ni de un gobierno**?*

### Flujo clásico (centralizado)

En el modelo tradicional:

1. **Tú** pides a tu banco que envíe 100 € a alguien.
2. El **banco** resta 100 € de tu cuenta y suma 100 € en la del otro.
3. El **registro** (quién tiene qué) lo guarda solo el banco (y sus copias reguladas).

Si el banco miente, se cae o te censura, tú no tienes otra copia del registro. Eso es **centralización**.

En la siguiente sección veremos cómo la **criptografía** y el movimiento **cypherpunk** prepararon el terreno para una alternativa.`,
        cuestionario: [
          { pregunta: '¿Qué característica del dinero fiduciario lo hace dependiente de una autoridad?', opciones: ['Que está hecho de papel', 'Que su valor depende de la confianza en el emisor y los intermediarios', 'Que es físico', 'Que se usa solo en un país'], correcta: 1 },
          { pregunta: 'En un sistema de pago centralizado, ¿quién guarda el registro de quién tiene qué?', opciones: ['Cada usuario en su dispositivo', 'Una autoridad central (por ejemplo un banco)', 'Una blockchain', 'Nadie; no hay registro'], correcta: 1 },
          { pregunta: '¿Qué evento histórico reforzó la búsqueda de alternativas al sistema financiero centralizado?', opciones: ['La invención de Internet', 'La crisis financiera de 2008', 'El lanzamiento del euro', 'La creación del primer banco'], correcta: 1 },
          { pregunta: 'En el flujo centralizado, si el banco falla o censura, ¿qué le ocurre al usuario?', opciones: ['Nada; tiene una copia del registro', 'Puede perder acceso o no tener otra copia del registro', 'La blockchain lo reemplaza automáticamente', 'El gobierno le devuelve el dinero'], correcta: 1 },
          { pregunta: '¿Qué significa que un sistema sea "centralizado"?', opciones: ['Que usa muchos servidores', 'Que hay un único punto o autoridad que controla el registro o el servicio', 'Que está en el centro de la ciudad', 'Que es muy rápido'], correcta: 1 }
        ]
      },
      {
        id: 2,
        titulo: '1.2 Criptografía y cypherpunks',
        descripcion: 'Privacidad, firmas digitales y el movimiento que inspiró Bitcoin.',
        guia: `## 1.2 Criptografía y cypherpunks

La **criptografía** permite probar identidad y proteger información sin depender de un tercero. Es la base técnica de Bitcoin.

### Herramientas clave

- **Funciones hash**: convierten cualquier dato en una "huella" fija (ej. SHA-256). Mismo dato → mismo hash; un cambio mínimo → hash distinto. Así se enlazan los bloques en una cadena.
- **Firmas digitales**: con una **clave privada** firmas un mensaje; cualquiera con tu **clave pública** puede verificar que fuiste tú, sin revelar la clave privada. En blockchain, esto identifica al dueño de una dirección.
- **Prueba de trabajo (Proof of Work)**: idea anterior a Bitcoin: para enviar un mensaje o "minar" un bloque hay que resolver un problema costoso en cómputo. Así se limita el spam y se reparte el poder.

### Los cypherpunks

En los 90, el movimiento **cypherpunk** defendía la privacidad y la libertad con criptografía. Creían que solo las matemáticas podían proteger a la gente de gobiernos y corporaciones. Publicaban en listas de correo y escribían código abierto.

Algunas ideas que luego reaparecen en Bitcoin:

- **Dinero digital** sin banco central (David Chaum, DigiCash; b-money de Wei Dai; bit gold de Nick Szabo).
- **Prueba de trabajo** para evitar el spam y el doble gasto (Hashcash, Adam Back).
- **Timestamping** de documentos (Stuart Haber, Scott Stornetta) para probar que un dato existía en una fecha.

### Cita relevante

> "A specter is haunting the modern world, the specter of crypto anarchy." — Timothy C. May, *The Crypto Anarchist Manifesto* (1992)

En la siguiente sección veremos el problema del **doble gasto** y cómo Satoshi lo resolvió con una cadena de bloques y consenso.`,
        cuestionario: [
          { pregunta: '¿Qué propiedad tiene una función hash criptográfica como SHA-256?', opciones: ['Es reversible: con el hash se recupera el dato original', 'Un cambio mínimo en el dato produce un hash completamente distinto', 'Siempre produce el mismo hash para cualquier entrada', 'Solo la conoce el banco central'], correcta: 1 },
          { pregunta: '¿Qué movimiento de los 90 impulsó la privacidad y el dinero digital con criptografía?', opciones: ['Open source', 'Cypherpunks', 'Fintech', 'Web 2.0'], correcta: 1 },
          { pregunta: '¿Para qué se usan las firmas digitales en blockchain?', opciones: ['Para minar bloques', 'Para probar que el dueño de una clave autorizó una transacción sin revelar la clave privada', 'Para enviar correos', 'Para calcular el hash del bloque'], correcta: 1 },
          { pregunta: 'Hashcash (Adam Back) es un antecedente de Bitcoin porque introdujo:', opciones: ['Las wallets', 'La prueba de trabajo para limitar spam y doble gasto', 'El primer banco digital', 'Los contratos inteligentes'], correcta: 1 },
          { pregunta: 'El timestamping de documentos (Haber, Stornetta) permite:', opciones: ['Enviar archivos más rápido', 'Probar que un dato existía en una fecha determinada', 'Ocultar la identidad del autor', 'Comprimir archivos'], correcta: 1 }
        ]
      }
    ]
  },
  // ========== CAPÍTULO 2 ==========
  {
    id: 2,
    titulo: 'Capítulo 2: Satoshi Nakamoto y el doble gasto',
    descripcion: 'El problema del doble gasto y la solución: cadena de bloques con consenso.',
    secciones: [
      {
        id: 3,
        titulo: '2.1 El problema del doble gasto',
        descripcion: 'Por qué es difícil tener "dinero digital" sin un libro de cuentas compartido.',
        guia: `## 2.1 El problema del doble gasto

Si el dinero es solo **información** (un archivo o un mensaje), ¿qué impide que alguien **copie** esa información y la gaste dos veces? Eso es el **doble gasto**.

### Ejemplo

Imagina que tienes un billete digital que dice "vale 10 €". Si es solo un archivo:

1. Lo envías a Ana para pagarla.
2. Copias el mismo archivo y lo envías también a Bob.
3. Ana y Bob creen tener 10 €; en la práctica has gastado 20 € con un solo "billete".

En el mundo físico esto se evita porque el billete **sale de tu mano** y no puedes tenerlo en dos sitios a la vez. En digital, sin un **registro único y compartido**, no hay forma de saber que ya lo gastaste.

### Intentos anteriores

- **DigiCash (Chaum)**: dependía de un emisor central que evitaba el doble gasto.
- **b-money (Wei Dai)** y **bit gold (Nick Szabo)**: proponían redes descentralizadas y prueba de trabajo, pero no una solución completa al consenso.

Satoshi combinó varias ideas en un **protocolo** concreto: una **cadena de bloques** donde todos acuerdan un único historial y donde gastar dos veces la misma moneda es imposible si la mayoría sigue las reglas.`,
        cuestionario: [
          { pregunta: '¿Qué es el "doble gasto" en dinero digital?', opciones: ['Gastar en dos tiendas distintas', 'Usar la misma unidad de dinero más de una vez porque es solo información', 'Pagar dos veces por error', 'Tener dos wallets'], correcta: 1 },
          { pregunta: '¿Por qué en el mundo físico el doble gasto es difícil?', opciones: ['Porque la policía lo impide', 'Porque el objeto físico no puede estar en dos sitios a la vez', 'Porque el dinero físico no existe', 'Porque los bancos lo bloquean'], correcta: 1 },
          { pregunta: 'DigiCash (Chaum) evitaba el doble gasto pero dependía de:', opciones: ['Una blockchain pública', 'Un emisor o servidor central', 'La minería descentralizada', 'Los cypherpunks'], correcta: 1 },
          { pregunta: 'b-money y bit gold proponían redes descentralizadas pero:', opciones: ['Eran más caros que Bitcoin', 'No tenían una solución completa al consenso en la práctica', 'Solo funcionaban en un país', 'No usaban criptografía'], correcta: 1 },
          { pregunta: 'La solución de Satoshi al doble gasto se basa en:', opciones: ['Un banco que valida cada transacción', 'Una cadena de bloques con consenso sobre un único historial', 'Ocultar las transacciones', 'Limitar una transacción por usuario'], correcta: 1 }
        ]
      },
      {
        id: 4,
        titulo: '2.2 La solución: cadena de bloques y consenso',
        descripcion: 'Una única historia compartida y reglas que todos siguen.',
        guia: `## 2.2 La solución: cadena de bloques y consenso

La idea de Satoshi se puede resumir en dos piezas: un **registro compartido** (la cadena de bloques) y un **consenso** sobre cuál es la versión válida de ese registro.

### Registro compartido (blockchain)

- Las **transacciones** ("Alice paga X bitcoin a Bob") se agrupan en **bloques**.
- Cada bloque tiene un **hash** que depende de su contenido y del hash del bloque **anterior**.
- Así se forma una **cadena**: Bloque 1 → Bloque 2 → Bloque 3 → …

Si alguien modifica una transacción pasada, el hash de ese bloque cambia; como el siguiente bloque incluye ese hash, todos los hashes posteriores cambian. **Cualquier nodo** puede detectar la alteración. Eso da **inmutabilidad** siempre que la mayoría sea honesta.

### Consenso: la cadena más larga

- **Mineros** compiten por crear el siguiente bloque resolviendo un problema (proof of work).
- Cuando alguien encuentra un bloque válido, lo difunde; los demás lo aceptan y siguen construyendo encima.
- Si dos bloques válidos compiten, la red acepta temporalmente ambos; cuando llega el **siguiente** bloque, solo una rama sigue creciendo. La regla es: **la cadena con más trabajo acumulado (más larga)** es la verdadera.

Así se llega a **un solo** historial de transacciones sin un coordinador central. El doble gasto falla porque solo una de las dos transacciones conflictivas quedará en esa cadena aceptada.`,
        cuestionario: [
          { pregunta: '¿Por qué modificar una transacción antigua en un bloque es detectable?', opciones: ['Porque hay un guardia en cada bloque', 'Porque el hash del bloque cambiaría y con él todos los hashes siguientes', 'Porque los mineros lo prohíben', 'Porque Bitcoin está en la nube'], correcta: 1 },
          { pregunta: '¿Qué regla usa la red Bitcoin para elegir la "verdadera" cadena cuando hay dos ramas?', opciones: ['La que diga el creador de Bitcoin', 'La cadena con más trabajo acumulado (más larga)', 'La más nueva por fecha', 'La que tenga más transacciones'], correcta: 1 },
          { pregunta: '¿Quién compite por crear el siguiente bloque en Bitcoin?', opciones: ['Solo el creador de Bitcoin', 'Los mineros, resolviendo un problema (proof of work)', 'Los bancos', 'Los usuarios que envían transacciones'], correcta: 1 },
          { pregunta: 'La inmutabilidad de la blockchain se mantiene mientras:', opciones: ['Un solo nodo tenga la copia', 'La mayoría de la red sea honesta y siga las reglas', 'No haya Internet', 'Solo haya mineros'], correcta: 1 },
          { pregunta: 'Sin consenso, ¿qué pasaría con las transacciones?', opciones: ['Serían más rápidas', 'No habría acuerdo sobre cuál es el historial válido; podrían existir versiones contradictorias', 'Solo habría una wallet', 'No se podrían enviar'], correcta: 1 }
        ]
      }
    ]
  },
  // ========== CAPÍTULO 3 ==========
  {
    id: 3,
    titulo: 'Capítulo 3: Bitcoin: whitepaper y diseño',
    descripcion: 'El documento fundacional y los elementos del protocolo.',
    secciones: [
      {
        id: 5,
        titulo: '3.1 El whitepaper de Bitcoin',
        descripcion: 'Resumen y estructura del documento de Satoshi.',
        guia: `## 3.1 El whitepaper de Bitcoin

El **31 de octubre de 2008**, alguien bajo el seudónimo **Satoshi Nakamoto** publicó en la lista de correo de criptografía *metzdowd.com* un enlace a un PDF de nueve páginas: *Bitcoin: A Peer-to-Peer Electronic Cash System*.

### Estructura del whitepaper

1. **Abstract**: sistema de dinero electrónico P2P sin confianza en un intermediario.
2. **Introducción**: problema de los pagos online que dependen de instituciones; necesidad de firma digital y de evitar el doble gasto sin un servidor central.
3. **Transacciones**: monedas como cadenas de firmas digitales; el payee verifica las firmas de los dueños anteriores.
4. **Servidor de marcas de tiempo**: servidores que ordenan las transacciones en bloques (aquí aparece la idea de "block chain").
5. **Red P2P**: difusión de transacciones y bloques; proof of work para elegir la historia válida; mayoría honesta de CPU controla la red.
6. **Incentivos**: recompensa en moneda nueva por bloque; comisiones por transacción.
7. **Recuperación de disco**: nodos que se reconectan piden bloques perdidos.
8. **Pagos simplificados**: no hace falta guardar toda la cadena para verificar pagos (más adelante: SPV).
9. **Combinar y dividir valor**: las transacciones pueden tener varias entradas y salidas.
10. **Privacidad**: direcciones no vinculadas a identidad; pero el historial es público.
11. **Cálculos**: probabilidad de que un atacante con menos poder que la red honesta alcance la cadena más larga (análisis de seguridad).

### Referencia bibliográfica

> **Nakamoto, S. (2008).** *Bitcoin: A Peer-to-Peer Electronic Cash System.* https://bitcoin.org/bitcoin.pdf`,
        cuestionario: [
          { pregunta: '¿En qué año se publicó el whitepaper de Bitcoin?', opciones: ['2006', '2007', '2008', '2009'], correcta: 2 },
          { pregunta: '¿Qué problema central aborda el whitepaper?', opciones: ['Cómo ganar dinero con minería', 'Sistema de efectivo electrónico P2P sin confiar en un intermediario y sin doble gasto', 'Cómo comprar Bitcoin', 'Cómo crear una criptomoneda'], correcta: 1 },
          { pregunta: '¿Bajo qué seudónimo se publicó el whitepaper?', opciones: ['Vitalik Buterin', 'Satoshi Nakamoto', 'Nick Szabo', 'Adam Back'], correcta: 1 },
          { pregunta: 'En el whitepaper, las transacciones se ordenan en:', opciones: ['Una base de datos central', 'Bloques encadenados (block chain)', 'Un solo archivo', 'El correo electrónico'], correcta: 1 },
          { pregunta: 'El whitepaper menciona que la red es controlada por:', opciones: ['Un único servidor', 'La mayoría honesta de nodos (CPU)', 'Los gobiernos', 'Los bancos'], correcta: 1 }
        ]
      },
      {
        id: 6,
        titulo: '3.2 Bloques, hashes y estructura de datos',
        descripcion: 'Cómo se ve un bloque por dentro y cómo se encadenan.',
        guia: `## 3.2 Bloques, hashes y estructura de datos

Cada **bloque** en Bitcoin es un contenedor de datos con una estructura bien definida. Entenderla ayuda a ver por qué la cadena es inmutable.

### Campos principales de un bloque

- **Versión**: número de versión del protocolo.
- **Hash del bloque anterior**: enlace criptográfico con el bloque previo (aquí está la "cadena").
- **Merkle root**: raíz de un árbol de hashes de todas las transacciones del bloque; permite verificar una transacción sin descargar todo el bloque.
- **Timestamp**: marca de tiempo (aproximada).
- **Bits / dificultad**: objetivo para la prueba de trabajo.
- **Nonce**: número que los mineros cambian hasta que el hash del bloque cumple la condición (proof of work).
- **Lista de transacciones**: las que se confirman en ese bloque.

### Ejemplo conceptual (no es código real de Bitcoin)

\`\`\`text
Bloque N:
  - previous_block_hash: 0x0000...abc123
  - merkle_root: 0xdef456...
  - timestamp: 2024-01-15 12:00:00
  - nonce: 2847129
  - transactions: [tx1, tx2, tx3, ...]

Hash(Bloque N) = 0x0000...789  →  se usa como previous_block_hash del Bloque N+1
\`\`\`

### Flujo de enlace

1. Se construye el bloque con transacciones, timestamp, nonce y **hash del bloque anterior**.
2. Se calcula el **hash** del bloque (por ejemplo SHA-256).
3. Si el hash no cumple la condición de dificultad, se cambia el **nonce** y se repite.
4. Cuando se encuentra un hash válido, el bloque se difunde; el siguiente bloque lo referenciará en su previous_block_hash.

Así, **cualquier cambio** en un bloque antiguo cambia su hash y rompe la cadena para todos los bloques posteriores. La red rechaza esa rama.`,
        cuestionario: [
          { pregunta: '¿Qué campo de un bloque crea el "eslabón" con el bloque anterior?', opciones: ['El nonce', 'El hash del bloque anterior (previous_block_hash)', 'El timestamp', 'La cantidad de transacciones'], correcta: 1 },
          { pregunta: '¿Para qué sirve el nonce en un bloque de Bitcoin?', opciones: ['Para identificar al minero', 'Los mineros lo cambian hasta encontrar un hash que cumpla la dificultad (proof of work)', 'Para la privacidad', 'Para ordenar las transacciones'], correcta: 1 },
          { pregunta: 'El Merkle root en un bloque permite:', opciones: ['Saber quién minó el bloque', 'Verificar una transacción sin descargar todo el bloque', 'Aumentar el tamaño del bloque', 'Ocultar las transacciones'], correcta: 1 },
          { pregunta: 'Si alguien altera una transacción en un bloque ya minado, ¿qué ocurre?', opciones: ['Solo ese bloque cambia', 'El hash de ese bloque y de todos los posteriores cambia; la red rechaza la rama', 'Nada; la red lo acepta', 'Solo el siguiente bloque se invalida'], correcta: 1 },
          { pregunta: '¿Qué función hash se usa típicamente en Bitcoin para los bloques?', opciones: ['MD5', 'SHA-1', 'SHA-256', 'AES'], correcta: 2 }
        ]
      }
    ]
  },
  // ========== CAPÍTULO 4 ==========
  {
    id: 4,
    titulo: 'Capítulo 4: La blockchain paso a paso',
    descripcion: 'Minería, nodos y recorrido completo de una transacción.',
    secciones: [
      {
        id: 7,
        titulo: '4.1 Minería y proof of work',
        descripcion: 'Qué hacen los mineros y por qué consumen energía.',
        guia: `## 4.1 Minería y proof of work

**Minar** en Bitcoin significa competir por el derecho a **añadir el siguiente bloque** a la cadena. Quien lo logra recibe una **recompensa** en bitcoin nuevos más las **comisiones** de las transacciones incluidas.

### Proof of Work (PoW)

- El protocolo define una **dificultad**: el hash del bloque debe ser menor que un valor objetivo (empezar con cierta cantidad de ceros).
- Los mineros **prueban** miles de millones de valores de **nonce** (y variaciones del bloque) hasta que el hash cumple la condición.
- Es **costoso** en cómputo y en electricidad; es **fácil** para el resto de la red comprobar que el hash es válido.

Así se consigue:

1. **Seguridad**: modificar el pasado requiere rehacer el proof of work de todos los bloques posteriores; con la mayoría honesta, es inviable.
2. **Emisión descentralizada**: no hay un emisor central; la moneda nueva sale como recompensa a quien aporta trabajo.
3. **Sybil resistance**: crear muchas identidades (nodos) no te da más poder; lo que cuenta es poder de cómputo.

### Recompensa y halving

- La recompensa por bloque empezó en **50 BTC** y se reduce a la mitad aproximadamente cada **4 años** (halving).
- Hasta hoy ha habido varios halvings; la recompensa actual es **3,125 BTC** por bloque (datos de 2024).
- Se espera que hacia **2140** se hayan emitido los **21 millones** de bitcoin; después, los mineros vivirán sobre todo de comisiones.`,
        cuestionario: [
          { pregunta: '¿Qué hace un minero para "ganar" el derecho a añadir un bloque?', opciones: ['Votar en una elección', 'Encontrar un nonce tal que el hash del bloque cumpla la condición de dificultad (proof of work)', 'Ser el primero en conectarse', 'Pagar una cuota'], correcta: 1 },
          { pregunta: '¿Qué es el "halving" en Bitcoin?', opciones: ['Dividir el tamaño del bloque', 'Reducir a la mitad la recompensa por bloque aproximadamente cada 4 años', 'Dividir el precio del bitcoin', 'Cerrar la mitad de los nodos'], correcta: 1 },
          { pregunta: '¿Cuál fue la recompensa inicial por bloque en Bitcoin?', opciones: ['21 BTC', '10 BTC', '50 BTC', '100 BTC'], correcta: 2 },
          { pregunta: '¿Hacia qué año se espera que se hayan emitido los 21 millones de bitcoin?', opciones: ['2025', '2050', '2140', 'Nunca; no hay límite'], correcta: 2 },
          { pregunta: 'La prueba de trabajo hace que modificar el pasado sea costoso porque:', opciones: ['Hay que pagar una multa', 'Hay que rehacer el proof of work de todos los bloques posteriores', 'Solo el creador puede hacerlo', 'La red se desconecta'], correcta: 1 }
        ]
      },
      {
        id: 8,
        titulo: '4.2 Nodos, wallets y flujo de una transacción',
        descripcion: 'Desde que envías una transacción hasta que está confirmada.',
        guia: `## 4.2 Nodos, wallets y flujo de una transacción

### Nodos

Un **nodo** es un programa que mantiene una copia de la blockchain y sigue las reglas del protocolo. Puede:

- **Validar** transacciones y bloques (comprobar firmas, no doble gasto, proof of work).
- **Propagar** transacciones y bloques a otros nodos.
- **Responder** a peticiones de datos (por ejemplo para wallets ligeras o exploradores).

No todos los nodos minan; los que minan son un subconjunto que además hace proof of work.

### Wallets

Una **wallet** no "guarda" bitcoin; guarda las **claves privadas** que permiten firmar transacciones y gastar los fondos asociados a las direcciones derivadas. Las direcciones son **públicas** (como un número de cuenta); la clave privada es **secreta**.

### Flujo de una transacción (resumido)

1. **Usuario** crea una transacción (entradas: UTXOs que gasta; salidas: destinatario y cantidad) y la **firma** con su clave privada.
2. La transacción se **difunde** a la red (normalmente mediante un nodo).
3. Los **nodos** la validan y la incluyen en su **mempool** (conjunto de transacciones pendientes).
4. Un **minero** la agrupa con otras en un bloque, hace proof of work y difunde el bloque.
5. Los **demás nodos** validan el bloque y lo añaden a su cadena; la transacción pasa a tener **1 confirmación**.
6. Cada nuevo bloque encima añade otra **confirmación**; tras varias (p. ej. 6), se considera muy improbable que la cadena cambie.

### Diagrama de flujo (texto)

\`\`\`text
[Wallet] → firma tx → [Red P2P] → mempool → [Mineros] → bloque válido
    → [Nodos] validan bloque → cadena actualizada → [Explorador] muestra confirmaciones
\`\`\``,
        cuestionario: [
          { pregunta: '¿Qué guarda realmente una wallet de Bitcoin?', opciones: ['Los bitcoin en un archivo', 'Las claves privadas que permiten firmar transacciones', 'El historial de la blockchain', 'La dirección del minero'], correcta: 1 },
          { pregunta: '¿Qué es la "mempool"?', opciones: ['Un tipo de wallet', 'El conjunto de transacciones pendientes que los nodos conocen y aún no están en un bloque', 'El bloque más reciente', 'La recompensa del minero'], correcta: 1 },
          { pregunta: '¿Qué es un nodo en la red Bitcoin?', opciones: ['Solo un minero', 'Un programa que mantiene una copia de la blockchain y valida transacciones y bloques', 'Una wallet', 'Un explorador de bloques'], correcta: 1 },
          { pregunta: 'Cuando una transacción recibe "6 confirmaciones", significa:', opciones: ['Que 6 personas la aprobaron', 'Que está incluida en un bloque y hay 5 bloques más encima; se considera muy segura', 'Que costó 6 comisiones', 'Que se envió hace 6 segundos'], correcta: 1 },
          { pregunta: 'Las direcciones Bitcoin son:', opciones: ['Secretas; nadie puede verlas', 'Públicas; cualquiera puede ver el saldo e historial de una dirección', 'Solo visibles para los mineros', 'Generadas por el banco'], correcta: 1 }
        ]
      }
    ]
  },
  // ========== CAPÍTULO 5 ==========
  {
    id: 5,
    titulo: 'Capítulo 5: Consenso y seguridad',
    descripcion: 'Reglas del consenso, ataques teóricos y límites del modelo.',
    secciones: [
      {
        id: 9,
        titulo: '5.1 Reglas del consenso y ataque del 51%',
        descripcion: 'Qué pasa cuando la mayoría del poder de minado es honesta o no.',
        guia: `## 5.1 Reglas del consenso y ataque del 51%

### Regla de la cadena más larga

En Bitcoin, **la cadena válida es la que tiene más trabajo acumulado** (en la práctica, la más larga que cumple las reglas). Todos los nodos aplican esta regla. Así se alcanza **consenso** sin votos ni servidor central.

### Mayoría honesta

El protocolo asume que **más del 50% del poder de minado (hash rate) es honesto**. Es decir, sigue las reglas y no intenta revertir transacciones ya confirmadas. Si eso se cumple:

- Un atacante con menos del 50% no puede imponer su propia cadena a largo plazo; la cadena honesta crece más rápido.
- Un atacante con **más del 51%** podría, en teoría, minar una rama alternativa y dejar atrás bloques ya aceptados (**reorganización**), permitiendo por ejemplo **doble gasto** en esas transacciones.

### Limitaciones del ataque 51%

- Requiere **enorme** inversión en hardware y electricidad.
- Si se detecta (reorganizaciones, concentración de pools), la confianza y el precio pueden caer; el atacante se perjudica.
- No puede **crear** bitcoin de la nada ni **robar** fondos de direcciones ajenas (las claves privadas siguen en poder de los usuarios).

En la práctica, la seguridad de Bitcoin depende de que sea **económicamente irracional** atacar la red.`,
        cuestionario: [
          { pregunta: '¿Qué regla usa Bitcoin para decidir qué cadena es la válida?', opciones: ['La que diga el desarrollador principal', 'La cadena con más trabajo acumulado (en la práctica, la más larga válida)', 'La que tenga más transacciones', 'La primera que se creó'], correcta: 1 },
          { pregunta: 'Un atacante con más del 51% del hash rate podría en teoría hacer qué?', opciones: ['Crear bitcoin ilimitados', 'Revertir bloques recientes (reorganización) y hacer doble gasto en esas transacciones', 'Robar las claves privadas de los usuarios', 'Cerrar la red'], correcta: 1 },
          { pregunta: '¿Puede un atacante del 51% crear bitcoin de la nada o robar fondos de otras direcciones?', opciones: ['Sí, puede hacer todo', 'No; no puede crear moneda ni robar fondos sin las claves privadas', 'Solo puede robar fondos', 'Solo puede crear moneda'], correcta: 1 },
          { pregunta: 'La seguridad de Bitcoin en la práctica depende de que:', opciones: ['Nadie tenga más del 50% del hash rate', 'Sea económicamente irracional atacar la red', 'Los gobiernos la protejan', 'Solo haya un minero'], correcta: 1 },
          { pregunta: '¿Qué se entiende por "mayoría honesta"?', opciones: ['Más del 50% de los usuarios', 'Más del 50% del poder de minado (hash rate) que sigue las reglas del protocolo', 'La mitad de los nodos', 'Los desarrolladores principales'], correcta: 1 }
        ]
      }
    ]
  },
  // ========== CAPÍTULO 6 ==========
  {
    id: 6,
    titulo: 'Capítulo 6: Criptomonedas y ecosistema',
    descripcion: 'Altcoins, Ethereum y contratos inteligentes.',
    secciones: [
      {
        id: 10,
        titulo: '6.1 Altcoins y Ethereum',
        descripcion: 'Otras cadenas y la idea de una blockchain programable.',
        guia: `## 6.1 Altcoins y Ethereum

Tras Bitcoin aparecieron **miles** de proyectos (altcoins). Algunos copian Bitcoin con cambios (Litecoin, Bitcoin Cash); otros proponen **diseños distintos**: consenso diferente (proof of stake), más velocidad, o **programabilidad**.

### Ethereum (2015)

**Ethereum** introduce una **máquina virtual** (EVM) sobre la blockchain: no solo se registran transferencias de valor, sino **código** que se ejecuta de forma determinista. Ese código son los **contratos inteligentes** (smart contracts).

- **ETH** es la moneda nativa (gas para ejecutar contratos y transacciones).
- Cualquiera puede **desplegar** contratos y **llamarlos** enviando transacciones.
- Las aplicaciones descentralizadas (**dApps**) son frontends que hablan con esos contratos.

### Comparación breve

- **Bitcoin**: dinero P2P; Proof of Work; scripting muy limitado; reserva de valor y pagos.
- **Ethereum**: plataforma programable; Proof of Stake (desde 2022); contratos Turing-completos; DeFi, NFTs, DAOs, dApps.

En la siguiente sección veremos **contratos inteligentes** y casos de uso.`,
        cuestionario: [
          { pregunta: '¿Qué aporta Ethereum que Bitcoin no tiene de forma nativa?', opciones: ['Más bitcoin', 'Una máquina virtual (EVM) y contratos inteligentes ejecutables en la blockchain', 'Minería más barata', 'Anonimato total'], correcta: 1 },
          { pregunta: '¿Qué es el "gas" en Ethereum?', opciones: ['Un tipo de token', 'La unidad de pago para ejecutar transacciones y contratos en la red', 'El nombre del minero', 'La recompensa por bloque'], correcta: 1 },
          { pregunta: '¿Qué son las dApps?', opciones: ['Solo wallets', 'Aplicaciones descentralizadas cuyos backend son contratos en la blockchain', 'Solo juegos', 'Apps que solo funcionan en un país'], correcta: 1 },
          { pregunta: 'Ethereum desde 2022 usa principalmente:', opciones: ['Proof of Work como Bitcoin', 'Proof of Stake para el consenso', 'Un único validador', 'Solo minería con GPU'], correcta: 1 },
          { pregunta: 'Los "altcoins" son:', opciones: ['Solo copias de Bitcoin', 'Otras criptomonedas o proyectos con diseños distintos (consenso, velocidad, programabilidad)', 'Solo tokens en Ethereum', 'Monedas sin blockchain'], correcta: 1 }
        ]
      },
      {
        id: 11,
        titulo: '6.2 Contratos inteligentes y casos de uso',
        descripcion: 'Qué son los smart contracts y ejemplos (DeFi, NFTs, DAOs).',
        guia: `## 6.2 Contratos inteligentes y casos de uso

Un **contrato inteligente** es un **programa** almacenado en la blockchain que se ejecuta cuando se cumplen condiciones definidas en código. No lo ejecuta una persona ni un servidor central: lo ejecuta la **red**, de forma **determinista** y **auditable**.

### Características

- **Inmutables**: una vez desplegados, el código no cambia (salvo que el contrato tenga lógica de actualización).
- **Transparentes**: cualquiera puede leer el código y las transacciones.
- **Sin intermediario**: las partes interactúan con el contrato sin depender de un banco o un juez.

### Casos de uso

1. **DeFi (finanzas descentralizadas)**: préstamos, intercambios (DEX), stablecoins, yield farming; todo mediante contratos.
2. **NFTs**: tokens no fungibles que representan propiedad única (arte, coleccionables, entradas).
3. **DAOs**: organizaciones gobernadas por reglas escritas en contratos y votación con tokens.
4. **Identidad y credenciales**: emisión y verificación de certificados o reputación on-chain.

### Ejemplo conceptual (pseudocódigo)

\`\`\`text
contrato PréstamoSimple:
  si (usuario deposita colateral suficiente):
    permitir retirar préstamo en stablecoin
  si (usuario devuelve préstamo + interés):
    devolver colateral
  si (no devuelve en plazo):
    liquidar colateral automáticamente
\`\`\`

En cursos posteriores (p. ej. Solidity) aprenderás a escribir y desplegar contratos reales.`,
        cuestionario: [
          { pregunta: '¿Qué ejecuta un contrato inteligente en la blockchain?', opciones: ['Las órdenes de un administrador', 'Un programa que se ejecuta cuando se cumplen condiciones definidas en código', 'Solo transferencias de ETH', 'Solo minería'], correcta: 1 },
          { pregunta: '¿Qué significa que un contrato sea "inmutable" una vez desplegado?', opciones: ['Que no se puede leer', 'Que el código no puede cambiarse (salvo lógica explícita de actualización)', 'Que no acepta transacciones', 'Que solo lo usa una persona'], correcta: 1 },
          { pregunta: 'DeFi se refiere a:', opciones: ['Solo a Bitcoin', 'Finanzas descentralizadas: préstamos, intercambios, stablecoins mediante contratos', 'Solo a bancos digitales', 'Solo a NFTs'], correcta: 1 },
          { pregunta: 'Una DAO es:', opciones: ['Una moneda', 'Una organización gobernada por reglas en contratos y votación con tokens', 'Un tipo de wallet', 'Un minero'], correcta: 1 },
          { pregunta: 'Los NFTs en blockchain representan:', opciones: ['Solo dinero', 'Propiedad única o derechos sobre un activo (arte, coleccionables, etc.)', 'Solo contratos', 'Solo direcciones'], correcta: 1 }
        ]
      }
    ]
  },
  // ========== CAPÍTULO 7 ==========
  {
    id: 7,
    titulo: 'Capítulo 7: Referencias y bibliografía',
    descripcion: 'Lecturas y recursos para profundizar.',
    secciones: [
      {
        id: 12,
        titulo: '7.1 Referencias bibliográficas y recursos',
        descripcion: 'Documentos fundacionales y lecturas recomendadas.',
        guia: `## 7.1 Referencias bibliográficas y recursos

### Documentos fundacionales

- **Nakamoto, S. (2008).** *Bitcoin: A Peer-to-Peer Electronic Cash System.* https://bitcoin.org/bitcoin.pdf
- **Haber, S., Stornetta, W. S. (1991).** *How to time-stamp a digital document.* Journal of Cryptology, 3(2), 99–111.
- **Back, A. (2002).** *Hashcash - A Denial of Service Counter-Measure.* http://www.hashcash.org/papers/hashcash.pdf
- **Dai, W. (1998).** *b-money.* http://www.weidai.com/bmoney.txt
- **Szabo, N. (2005).** *Bit Gold.* (varios ensayos en su blog)
- **Buterin, V. (2014).** *Ethereum White Paper. A Next-Generation Smart Contract and Decentralized Application Platform.* https://ethereum.org/en/whitepaper/

### Libros y divulgación

- **Antonopoulos, A. M. (2017).** *Mastering Bitcoin* (2nd ed.). O'Reilly.
- **Narayanan, A., Bonneau, J., Felten, E., Miller, A., Goldfeder, S. (2016).** *Bitcoin and Cryptocurrency Technologies.* Princeton University Press.

### Exploradores y herramientas

- **Bitcoin**: https://mempool.space — https://blockstream.info
- **Ethereum**: https://etherscan.io

### Cita de cierre

> "The root problem with conventional currency is all the trust that's required to make it work. The central bank must be trusted not to debase the currency, but the history of fiat currencies is full of breaches of that trust." — Satoshi Nakamoto (2009), en el foro P2P Foundation.

Con esto termina el curso de **Introducción a Blockchain**. Has visto el contexto previo a Satoshi, el problema del doble gasto, el diseño de Bitcoin, la minería, el consenso y el paso a Ethereum y los contratos inteligentes. Para seguir, te recomendamos el curso de **Smart Contracts con Solidity** o el de **DeFi**.`,
        cuestionario: [
          { pregunta: '¿Cuál es el título del documento fundacional de Bitcoin?', opciones: ['Ethereum Whitepaper', 'Bitcoin: A Peer-to-Peer Electronic Cash System', 'b-money', 'Hashcash'], correcta: 1 },
          { pregunta: '¿Qué herramienta permite inspeccionar transacciones y bloques de Ethereum?', opciones: ['Bitcoin Core', 'Etherscan (block explorer)', 'MetaMask', 'Un minero'], correcta: 1 },
          { pregunta: '¿Dónde se publicó originalmente el whitepaper de Bitcoin?', opciones: ['En un periódico', 'En la lista de correo de criptografía metzdowd.com', 'En Ethereum', 'En un libro'], correcta: 1 },
          { pregunta: 'Mastering Bitcoin (Antonopoulos) es un recurso recomendado para:', opciones: ['Solo mineros', 'Aprender en profundidad sobre Bitcoin y su tecnología', 'Comprar Bitcoin', 'Crear altcoins'], correcta: 1 },
          { pregunta: 'Para ver transacciones y bloques de Bitcoin en tiempo real se puede usar:', opciones: ['Solo la wallet', 'Exploradores como mempool.space o blockstream.info', 'Solo el whitepaper', 'Solo Etherscan'], correcta: 1 }
        ]
      }
    ]
  }
]
