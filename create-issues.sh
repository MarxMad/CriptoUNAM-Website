#!/bin/bash

# Script para crear issues en GitHub automáticamente
# Requiere: GitHub CLI (gh) instalado
# Instalación: brew install gh
# Login: gh auth login

REPO="MarxMad/CriptoUNAM-Website"

echo "🚀 Creando issues en GitHub para $REPO"
echo "========================================"

# Issue #1 - CRÍTICO
gh issue create \
  --repo "$REPO" \
  --title "🔴 [CRITICAL] Ejecutar script SQL para arreglar tabla de likes" \
  --label "bug,database,critical" \
  --body "## 🐛 Descripción
El sistema de likes no funciona porque falta ejecutar el script SQL que configura la tabla correctamente.

## 📝 Pasos para resolver
1. Ir a https://supabase.com/dashboard/project/shccrrwnmogswspvlakf
2. Abrir SQL Editor
3. Ejecutar el script \`criptounam/fix-likes-table.sql\`
4. Verificar que se vean mensajes de éxito

## 📁 Archivos relacionados
- \`criptounam/fix-likes-table.sql\`
- \`FIX_LIKES_GUIDE.md\`

## ⏱️ Tiempo estimado
5 minutos

## 📚 Referencias
Ver guía completa en \`FIX_LIKES_GUIDE.md\`"

echo "✅ Issue #1 creado"

# Issue #2 - CRÍTICO
gh issue create \
  --repo "$REPO" \
  --title "🔴 [CRITICAL] Configurar dominio de email en Resend" \
  --label "enhancement,configuration,high priority" \
  --body "## 📧 Descripción
Para que el sistema de emails automáticos funcione, necesitamos configurar un dominio personalizado en Resend.

## 📝 Pasos para resolver
1. Elegir dominio (ej: \`criptounam.xyz\` o \`mail.criptounam.xyz\`)
2. Agregar registros DNS según Resend
3. Verificar el dominio
4. Actualizar \`VITE_RESEND_FROM_EMAIL\` en \`.env\`

## 📚 Documentación
- [Resend Domains](https://resend.com/docs/dashboard/domains/introduction)

## ⏱️ Tiempo estimado
15-20 minutos"

echo "✅ Issue #2 creado"

# Issue #3 - ALTA
gh issue create \
  --repo "$REPO" \
  --title "🟡 [HIGH] Desplegar Smart Contract PUMA Token" \
  --label "enhancement,blockchain,high priority" \
  --body "## ⛓️ Descripción
El contrato inteligente PUMA está listo pero necesita ser desplegado a una red blockchain.

## 📝 Pasos para resolver
1. Elegir red (Polygon Mumbai testnet o Mainnet)
2. Configurar Foundry o Hardhat
3. Desplegar contrato \`contracts/PUMAToken.sol\`
4. Actualizar dirección del contrato en \`src/config/env.ts\`
5. Verificar en explorador de bloques

## 📁 Archivos relacionados
- \`criptounam/contracts/PUMAToken.sol\`
- \`DEPLOYMENT_GUIDE.md\`
- \`src/services/blockchain.service.ts\`

## ⏱️ Tiempo estimado
1-2 horas"

echo "✅ Issue #3 creado"

# Issue #4 - ALTA
gh issue create \
  --repo "$REPO" \
  --title "🟡 [HIGH] Agregar fotos recientes de eventos" \
  --label "content,enhancement" \
  --body "## 📸 Descripción
Actualizar la galería de fotos con imágenes recientes de talleres, reuniones y eventos de CriptoUNAM.

## 📝 Pasos para resolver
1. Recopilar fotos de eventos recientes
2. Optimizar imágenes (< 500KB cada una)
3. Subir a \`criptounam/public/images/Comunidad/\`
4. Commit y push
5. Verificar que se muestren en \`/comunidad\`

## 📁 Ubicación
- Página: \`/comunidad\` - Galería de fotos
- Carpeta: \`criptounam/public/images/Comunidad/\`

## ⏱️ Tiempo estimado
30 minutos"

echo "✅ Issue #4 creado"

# Issue #5 - ALTA
gh issue create \
  --repo "$REPO" \
  --title "🟡 [HIGH] Crear newsletters con contenido reciente" \
  --label "content,enhancement" \
  --body "## 📰 Descripción
La sección de newsletters está vacía. Necesitamos crear entradas con contenido educativo sobre blockchain y cripto.

## 📝 Pasos para resolver
1. Conectar wallet como admin
2. Ir a \`/newsletter\`
3. Click en \"Crear Newsletter\"
4. Escribir contenido (tutoriales, noticias, análisis)
5. Agregar imágenes
6. Publicar

## 💡 Sugerencias de contenido
- Tutorial: \"¿Qué es DeFi?\"
- Análisis: \"Estado del mercado cripto en México\"
- Guía: \"Cómo conectar tu wallet a dApps\"
- Novedades: \"Resumen del último taller\"

## ⏱️ Tiempo estimado
2-3 horas por newsletter"

echo "✅ Issue #5 creado"

# Issue #6 - ALTA
gh issue create \
  --repo "$REPO" \
  --title "🟡 [HIGH] Actualizar información de cursos" \
  --label "content,enhancement" \
  --body "## 📚 Descripción
Agregar información actualizada de los cursos disponibles, instructores, fechas y cupos.

## 📝 Pasos para resolver
1. Conectar wallet como admin
2. Ir a \`/cursos\`
3. Click en \"Agregar Curso\"
4. Llenar información completa:
   - Título y descripción
   - Instructor
   - Fechas de inicio y fin
   - Precio y cupo
   - Enlace de registro
   - Imagen del curso

## ⏱️ Tiempo estimado
1 hora"

echo "✅ Issue #6 creado"

# Issue #7 - MEDIA
gh issue create \
  --repo "$REPO" \
  --title "🟢 [MEDIUM] Diseñar templates de emails atractivos" \
  --label "enhancement,design,email" \
  --body "## 🎨 Descripción
Crear templates de email bonitos y profesionales para el sistema de newsletter.

## 📧 Tipos de emails necesarios
- Email de bienvenida
- Newsletter semanal
- Confirmación de registro a curso
- Recordatorio de evento

## 🛠️ Herramientas sugeridas
- [MJML](https://mjml.io/)
- [BEE Free](https://beefree.io/)
- [Stripo](https://stripo.email/)

## ⏱️ Tiempo estimado
3-4 horas"

echo "✅ Issue #7 creado"

# Issue #8 - MEDIA
gh issue create \
  --repo "$REPO" \
  --title "🟢 [MEDIUM] Implementar sistema de juegos educativos" \
  --label "enhancement,feature,gamification" \
  --body "## 🎮 Descripción
La página \`/juegos\` existe pero está vacía. Implementar juegos educativos sobre blockchain.

## 💡 Ideas de juegos
1. Quiz de conocimientos blockchain
2. Simulador de trading
3. Puzzle de conceptos DeFi
4. Juego de memoria con términos cripto

## 🪙 Integración PUMA
- Dar recompensas por completar juegos
- Sistema de niveles
- Achievements

## 📁 Archivos relacionados
- \`src/pages/Juegos.tsx\`
- \`src/hooks/usePuma.ts\`

## ⏱️ Tiempo estimado
8-10 horas"

echo "✅ Issue #8 creado"

# Issue #9 - MEDIA
gh issue create \
  --repo "$REPO" \
  --title "🟢 [MEDIUM] Agregar información de proyectos destacados" \
  --label "content,enhancement" \
  --body "## 🚀 Descripción
Completar la sección de proyectos destacados con información de proyectos desarrollados por CriptoUNAM.

## 📝 Información necesaria
- Nombre del proyecto
- Descripción técnica
- Stack tecnológico
- Links (GitHub, demo, docs)
- Screenshots
- Estado del proyecto

## 📁 Ubicación
\`/proyectos-destacados\`

## ⏱️ Tiempo estimado
2 horas"

echo "✅ Issue #9 creado"

# Issue #10 - MEDIA
gh issue create \
  --repo "$REPO" \
  --title "🟢 [MEDIUM] Documentar guía de contribución" \
  --label "documentation,good first issue" \
  --body "## 📖 Descripción
Crear un archivo \`CONTRIBUTING.md\` con lineamientos para nuevos contribuidores.

## 📋 Debe incluir
- Cómo hacer fork del repo
- Estándares de código
- Convención de commits
- Proceso de Pull Request
- Code of Conduct

## 📚 Referencias
- [GitHub Contributing Guide](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors)

## ⏱️ Tiempo estimado
1-2 horas"

echo "✅ Issue #10 creado"

# Issue #11 - BAJA
gh issue create \
  --repo "$REPO" \
  --title "🔵 [LOW] Implementar modo oscuro persistente" \
  --label "enhancement,ui/ux" \
  --body "## 🌙 Descripción
Guardar la preferencia de modo oscuro del usuario en localStorage para que persista entre sesiones.

## 📁 Archivos a modificar
- \`src/App.tsx\`
- \`src/index.css\`

## ⏱️ Tiempo estimado
1 hora"

echo "✅ Issue #11 creado"

# Issue #12 - BAJA
gh issue create \
  --repo "$REPO" \
  --title "🔵 [LOW] Agregar animaciones y microinteracciones" \
  --label "enhancement,ui/ux,design" \
  --body "## ✨ Descripción
Mejorar la experiencia de usuario con animaciones sutiles y microinteracciones.

## 💡 Ejemplos
- Animación al conectar wallet
- Transiciones suaves entre páginas
- Hover effects mejorados
- Loading states animados
- Toast notifications animadas

## 🛠️ Librerías sugeridas
- Framer Motion
- React Spring
- GSAP

## ⏱️ Tiempo estimado
4-5 horas"

echo "✅ Issue #12 creado"

# Issue #13 - BAJA
gh issue create \
  --repo "$REPO" \
  --title "🔵 [LOW] Implementar sistema de notificaciones push" \
  --label "enhancement,feature" \
  --body "## 🔔 Descripción
Agregar notificaciones push para mantener a los usuarios informados de nuevos eventos, cursos y newsletters.

## 🛠️ Tecnología
- Web Push API
- Service Workers
- Firebase Cloud Messaging (opcional)

## ⏱️ Tiempo estimado
5-6 horas"

echo "✅ Issue #13 creado"

# Issue #14 - BAJA
gh issue create \
  --repo "$REPO" \
  --title "🔵 [LOW] Optimizar imágenes y assets" \
  --label "performance,optimization" \
  --body "## ⚡ Descripción
Optimizar todas las imágenes del sitio para mejorar tiempos de carga.

## 📝 Pasos
1. Usar formato WebP
2. Implementar lazy loading
3. Crear versiones responsive
4. Usar CDN (Cloudflare)

## ⏱️ Tiempo estimado
2-3 horas"

echo "✅ Issue #14 creado"

# Issue #15 - BAJA
gh issue create \
  --repo "$REPO" \
  --title "🔵 [LOW] Agregar tests automatizados" \
  --label "testing,quality" \
  --body "## 🧪 Descripción
Implementar tests unitarios y de integración para componentes críticos.

## 🛠️ Frameworks
- Jest
- React Testing Library
- Cypress (E2E)

## 🎯 Componentes prioritarios
- Sistema de autenticación
- Formularios de registro
- Sistema de likes
- PUMA rewards

## ⏱️ Tiempo estimado
8-10 horas"

echo "✅ Issue #15 creado"

echo ""
echo "========================================"
echo "✅ ¡Todos los issues han sido creados!"
echo "========================================"
echo ""
echo "Ver issues en: https://github.com/$REPO/issues"

