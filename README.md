# CriptoUNAM - Plataforma educativa descentralizada

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Web3](https://img.shields.io/badge/Web3-F16822?style=for-the-badge&logo=web3.js&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**🎓 Plataforma educativa descentralizada para aprender sobre blockchain, criptomonedas y Web3.**

**🚀 [Ver sitio web en vivo](https://criptounam.xyz/)**

[![Website Status](https://img.shields.io/website?down_color=red&down_message=offline&up_color=green&up_message=online&url=https%3A//criptounam.xyz/)](https://criptounam.xyz/)

[📚 Documentación](https://github.com/MarxMad/CriptoUNAM-Website) · [🐛 Reportar bug](https://github.com/MarxMad/CriptoUNAM-Website/issues)

</div>

## 📖 Descripción

CriptoUNAM es una plataforma educativa descentralizada diseñada para la comunidad universitaria y entusiastas de la tecnología blockchain. Ofrecemos cursos especializados, eventos, y una comunidad activa para aprender sobre criptomonedas, contratos inteligentes y el ecosistema Web3.

## ✨ Características principales

- 📚 **Cursos especializados** sobre blockchain y criptomonedas
- 🔗 **Integración Web3** con wallets compatibles
- 🏆 **Sistema de certificaciones** en blockchain
- 👥 **Comunidad activa** de estudiantes y desarrolladores
- 📅 **Eventos y workshops** regulares
- 🌙 **Modo oscuro/claro** para mejor experiencia
- 📱 **Diseño responsive** optimizado para todos los dispositivos
- 🎮 **Juegos educativos** interactivos
- 📧 **Newsletter** con las últimas noticias del ecosistema cripto

## 🛠️ Stack tecnológico

- **Frontend**: React + TypeScript + Vite
- **Blockchain**: Ethers.js + Web3
- **Routing**: React Router
- **Estilos**: CSS Modules
- **Backend**: Node.js + Express (en `/pinata-backend`)
- **Base de datos**: MongoDB
- **Deployment**: Vercel

## 🖼️ Vista previa

![CriptoUNAM Homepage](https://criptounam.xyz/)

> 📸 *Visita el [sitio web en vivo](https://criptounam.xyz/) para explorar todas las funcionalidades*

## 📋 Prerrequisitos

- Node.js (v16 o superior)
- npm o yarn
- MetaMask u otra wallet Web3
- Git

## 🔧 Instalación y configuración

### Frontend

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/MarxMad/CriptoUNAM-Website.git
   cd CriptoUNAM-Website/CriptoUNAM-Website/criptounam
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```
   
   Edita el archivo `.env` con tus configuraciones:
   ```env
   VITE_APP_INFURA_ID=tu_infura_id
   VITE_APP_CHAIN_ID=1
   VITE_APP_NETWORK=mainnet
   VITE_TELEGRAM_BOT_TOKEN=tu_token_de_telegram
   ```

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   # o
   yarn dev
   ```

### Backend (Opcional)

Para funcionalidades completas como notificaciones:

1. **Navegar al directorio del backend:**
   ```bash
   cd pinata-backend
   ```

2. **Instalar dependencias del backend:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno del backend:**
   ```bash
   # Configura tu base de datos MongoDB y otras variables
   ```

4. **Iniciar el servidor backend:**
   ```bash
   npm start
   ```

## 🏗️ Estructura del proyecto

```
CriptoUNAM-Website/
├── CriptoUNAM-Website/
│   ├── criptounam/                    # Frontend principal
│   │   ├── src/
│   │   │   ├── components/           # Componentes reutilizables
│   │   │   │   ├── Navbar.tsx       # Barra de navegación
│   │   │   │   ├── Footer.tsx       # Pie de página
│   │   │   │   └── ConnectedWallets.tsx # Gestión de wallets
│   │   │   ├── pages/               # Páginas principales
│   │   │   │   ├── Home.tsx         # Página de inicio
│   │   │   │   ├── Cursos.tsx       # Catálogo de cursos
│   │   │   │   ├── Juegos.tsx       # Juegos educativos
│   │   │   │   ├── Comunidad.tsx    # Página de comunidad
│   │   │   │   └── Newsletter.tsx   # Suscripción al newsletter
│   │   │   ├── context/             # Contextos de React
│   │   │   │   ├── WalletContext.tsx # Gestión de wallets Web3
│   │   │   │   └── AppKitProvider.tsx # Provider de WalletConnect
│   │   │   ├── api/                 # Servicios API
│   │   │   │   └── telegram.ts      # Integración con Telegram
│   │   │   ├── constants/           # Datos estáticos
│   │   │   ├── styles/              # Estilos CSS
│   │   │   └── utils/               # Utilidades
│   │   ├── public/                  # Archivos estáticos
│   │   └── pinata-backend/          # Backend Node.js
│   │       ├── models/              # Modelos de base de datos
│   │       │   ├── Curso.js         # Modelo de cursos
│   │       │   ├── Eventos.js       # Modelo de eventos
│   │       │   └── newsletter.js    # Modelo de newsletter
│   │       └── routes/              # Rutas API
└── README.md                        # Este archivo
```

## 🎯 Funcionalidades principales

### 🎓 **Educación**
- Cursos estructurados sobre blockchain y DeFi
- Material didáctico interactivo
- Certificaciones verificables en blockchain

### 🎮 **Gamificación**
- Juegos educativos interactivos
- Sistema de puntuación y logros
- Competencias entre estudiantes

### 🔗 **Integración Web3**
- Conexión con múltiples wallets (MetaMask, WalletConnect, etc.)
- Interacción con contratos inteligentes
- Gestión de tokens y NFTs educativos

### 👥 **Comunidad**
- Foros de discusión
- Eventos y workshops en vivo
- Newsletter con actualizaciones del ecosistema

### 📱 **Experiencia de usuario**
- Diseño responsive para móviles y desktop
- Modo oscuro/claro
- Interfaz intuitiva y accesible

## 🔍 Scripts disponibles

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

## 📝 Convenciones de código

- Usar TypeScript para todo el código nuevo.
- Seguir el estilo de código existente.
- Documentar componentes y funciones complejas.
- Escribir tests para nuevas características.
- Usar nombres descriptivos para variables y funciones.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE.md para detalles.

## 👥 Equipo

- **Gerardo Pedrizco Vela** - UI/UX
- **Fernanda Tello Arzate** - UI/UX  
- **Adrian Armenta Sequeira** - Smart Contracts
- **Daniel Cruz** - Desarrollo de negocios

## 📞 Contacto y enlaces

- **🌐 Website**: [criptounam.xyz](https://criptounam.xyz/)
- **📧 Email**: criptounam@gmail.com
- **🐦 Twitter**: [@Cripto_UNAM](https://twitter.com/Cripto_UNAM)
- **💬 Discord**: Servidor de CriptoUNAM
- **📱 Telegram**: [Canal oficial](https://t.me/criptounam)
- **💻 GitHub**: [Repositorio del proyecto](https://github.com/MarxMad/CriptoUNAM-Website)

## 🚀 Estado del proyecto

Este proyecto está en **desarrollo activo**. Nuevas funcionalidades se agregan regularmente. 

[![Website Status](https://img.shields.io/website?down_color=red&down_message=offline&up_color=green&up_message=online&url=https%3A//criptounam.xyz/)](https://criptounam.xyz/)

## 🙏 Agradecimientos

- **UNAM** por el apoyo institucional y la visión educativa
- **Comunidad de desarrolladores Web3** por su inspiración y contribuciones
- **Vercel** por el hosting y deployment gratuito
- **Todos los estudiantes y usuarios** que han probado y dado feedback sobre la plataforma

---

<div align="center">

**⭐ Si este proyecto te ha sido útil, considera darle una estrella en GitHub ⭐**

*Desarrollado con ❤️ por el equipo de CriptoUNAM*

</div> 