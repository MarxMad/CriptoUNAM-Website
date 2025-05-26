# CriptoUNAM - Plataforma educativa descentralizada

Plataforma educativa descentralizada para aprender sobre blockchain, criptomonedas y Web3.

## 🚀 Características

- Cursos sobre blockchain y criptomonedas
- Integración con Web3 y wallets
- Sistema de certificaciones en blockchain
- Comunidad activa de estudiantes
- Eventos y workshops
- Modo oscuro/claro
- Diseño responsive

## 🛠️ Tecnologías

- React + TypeScript
- Ethers.js
- Web3
- React Router
- CSS Modules
- Vite

## 📋 Prerrequisitos

- Node.js (v16 o superior)
- npm o yarn
- MetaMask u otra wallet Web3
- Git

## 🔧 Instalación

1. Clonar el repositorio:

    ```bash
    git clone https://github.com/MarxMad/CriptoUNAM-Website.git
    cd criptounam
    ```

2. Instalar dependencias:

    ```bash
    npm install
    ```

    o

    ```bash
    yarn install
    ```

3. Crear archivo de variables de entorno:

    ```bash
    cp .env.example .env
    ```

4. Configurar variables de entorno en el archivo `.env`:

    ```env
    VITE_APP_INFURA_ID=tu_infura_id
    VITE_APP_CHAIN_ID=1
    VITE_APP_NETWORK=mainnet
    ```

5. Iniciar el servidor de desarrollo:

    ```bash
    npm run dev
    ```

    o

    ```bash
    yarn dev
    ```

## 🏗️ Estructura del Proyecto


criptounam/
├── src/
│ ├── components/ # Componentes reutilizables
│ ├── context/ # Contextos de React (Wallet, Theme)
│ ├── pages/ # Páginas principales
│ ├── hooks/ # Custom hooks
│ ├── types/ # Tipos de TypeScript
│ ├── utils/ # Utilidades y helpers
│ ├── App.tsx # Componente principal
│ └── main.tsx # Punto de entrada
├── public/ # Archivos estáticos
└── vite.config.ts # Configuración de Vite



## 🔍 Scripts Disponibles

- **Desarrollo**: 

    ```bash
    npm run dev
    ```

    Inicia servidor de desarrollo.

- **Construcción**:

    ```bash
    npm run build
    ```

    Construye para producción.

    ```bash
    npm run preview
    ```

    Vista previa de la build.

- **Testing**:

    ```bash
    npm run test
    ```

    Ejecuta tests.

    ```bash
    npm run test:watch
    ```

    Ejecuta tests en modo watch.

- **Linting**:

    ```bash
    npm run lint
    ```

    Ejecuta ESLint.

    ```bash
    npm run lint:fix
    ```

    Corrige errores de linting.

## 🤝 Contribuir

1. Fork el proyecto.
2. Crea tu rama de feature:

    ```bash
    git checkout -b feature/AmazingFeature
    ```

3. Commit tus cambios:

    ```bash
    git commit -m 'Add: nueva característica'
    ```

4. Push a la rama:

    ```bash
    git push origin feature/AmazingFeature
    ```

5. Abre un Pull Request.

## 📝 Convenciones de Código

- Usar TypeScript para todo el código nuevo.
- Seguir el estilo de código existente.
- Documentar componentes y funciones complejas.
- Escribir tests para nuevas características.
- Usar nombres descriptivos para variables y funciones.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE.md para detalles.

## 👥 Equipo

- Gerardo Pedrizco Vela - UI/UX
- Fernanda Tello Arzate  - UI/UX
- Adrian Armenta Sequeira - Smart Contracts
- Daniel Cruz - Desarrollador de negocios

## 📞 Contacto

- Website: [criptounam.com](https://criptounam.com)
- Email: criptounam@gmail.com
- Twitter: [@Cripto_UNAM](https://twitter.com/Cripto_UNAM)
- Discord: Servidor de CriptoUNAM

## 🙏 Agradecimientos

- UNAM por el apoyo institucional
- Comunidad de desarrolladores Web3
- Contribuidores y estudiantes
