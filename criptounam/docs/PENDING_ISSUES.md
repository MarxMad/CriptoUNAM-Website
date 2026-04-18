# 📋 Issues Pendientes - CriptoUNAM

## 🔴 PRIORIDAD CRÍTICA (Bloqueantes)

### Issue #1: Ejecutar script SQL para arreglar tabla de likes
**Labels**: `bug`, `database`, `critical`
**Assignee**: @MarxMad

**Descripción**:
El sistema de likes no funciona porque falta ejecutar el script SQL que configura la tabla correctamente.

**Pasos para resolver**:
1. Ir a https://supabase.com/dashboard/project/shccrrwnmogswspvlakf
2. Abrir SQL Editor
3. Ejecutar el script `criptounam/fix-likes-table.sql`
4. Verificar que se vean mensajes de éxito

**Archivos relacionados**:
- `criptounam/fix-likes-table.sql`
- `FIX_LIKES_GUIDE.md`

**Tiempo estimado**: 5 minutos

---

### Issue #2: Configurar dominio de email en Resend
**Labels**: `enhancement`, `configuration`, `high priority`
**Assignee**: @MarxMad

**Descripción**:
Para que el sistema de emails automáticos funcione, necesitamos configurar un dominio personalizado en Resend.

**Pasos para resolver**:
1. Elegir dominio (ej: `criptounam.xyz` o `mail.criptounam.xyz`)
2. Agregar registros DNS según Resend
3. Verificar el dominio
4. Actualizar `VITE_RESEND_FROM_EMAIL` en `.env`

**Documentación**:
- https://resend.com/docs/dashboard/domains/introduction

**Tiempo estimado**: 15-20 minutos

---

## 🟡 PRIORIDAD ALTA (Importantes)

### Issue #3: Desplegar Smart Contract PUMA Token
**Labels**: `enhancement`, `blockchain`, `high priority`
**Assignee**: @MarxMad

**Descripción**:
El contrato inteligente PUMA está listo pero necesita ser desplegado a una red blockchain.

**Pasos para resolver**:
1. Elegir red (Polygon Mumbai testnet o Mainnet)
2. Configurar Foundry o Hardhat
3. Desplegar contrato `contracts/PUMAToken.sol`
4. Actualizar dirección del contrato en `src/config/env.ts`
5. Verificar en explorador de bloques

**Archivos relacionados**:
- `criptounam/contracts/PUMAToken.sol`
- `DEPLOYMENT_GUIDE.md`
- `src/services/blockchain.service.ts`

**Tiempo estimado**: 1-2 horas

---

### Issue #4: Agregar fotos recientes de eventos
**Labels**: `content`, `enhancement`
**Assignee**: @MarxMad

**Descripción**:
Actualizar la galería de fotos con imágenes recientes de talleres, reuniones y eventos de CriptoUNAM.

**Pasos para resolver**:
1. Recopilar fotos de eventos recientes
2. Optimizar imágenes (< 500KB cada una)
3. Subir a `criptounam/public/images/Comunidad/`
4. Commit y push
5. Verificar que se muestren en `/comunidad`

**Ubicación**: 
- `/comunidad` - Galería de fotos
- `criptounam/public/images/Comunidad/`

**Tiempo estimado**: 30 minutos

---

### Issue #5: Crear newsletters con contenido reciente
**Labels**: `content`, `enhancement`
**Assignee**: @MarxMad

**Descripción**:
La sección de newsletters está vacía. Necesitamos crear entradas con contenido educativo sobre blockchain y cripto.

**Pasos para resolver**:
1. Conectar wallet como admin
2. Ir a `/newsletter`
3. Click en "Crear Newsletter"
4. Escribir contenido (tutoriales, noticias, análisis)
5. Agregar imágenes
6. Publicar

**Sugerencias de contenido**:
- Tutorial: "¿Qué es DeFi?"
- Análisis: "Estado del mercado cripto en México"
- Guía: "Cómo conectar tu wallet a dApps"
- Novedades: "Resumen del último taller"

**Tiempo estimado**: 2-3 horas por newsletter

---

### Issue #6: Actualizar información de cursos
**Labels**: `content`, `enhancement`
**Assignee**: @MarxMad

**Descripción**:
Agregar información actualizada de los cursos disponibles, instructores, fechas y cupos.

**Pasos para resolver**:
1. Conectar wallet como admin
2. Ir a `/cursos`
3. Click en "Agregar Curso"
4. Llenar información completa:
   - Título y descripción
   - Instructor
   - Fechas de inicio y fin
   - Precio y cupo
   - Enlace de registro
   - Imagen del curso

**Tiempo estimado**: 1 hora

---

## 🟢 PRIORIDAD MEDIA (Mejoras)

### Issue #7: Diseñar templates de emails atractivos
**Labels**: `enhancement`, `design`, `email`
**Assignee**: @MarxMad

**Descripción**:
Crear templates de email bonitos y profesionales para el sistema de newsletter.

**Tipos de emails necesarios**:
- Email de bienvenida
- Newsletter semanal
- Confirmación de registro a curso
- Recordatorio de evento

**Herramientas sugeridas**:
- https://mjml.io/
- https://beefree.io/
- https://stripo.email/

**Tiempo estimado**: 3-4 horas

---

### Issue #8: Implementar sistema de juegos educativos
**Labels**: `enhancement`, `feature`, `gamification`
**Assignee**: @MarxMad

**Descripción**:
La página `/juegos` existe pero está vacía. Implementar juegos educativos sobre blockchain.

**Ideas de juegos**:
1. Quiz de conocimientos blockchain
2. Simulador de trading
3. Puzzle de conceptos DeFi
4. Juego de memoria con términos cripto

**Integración PUMA**:
- Dar recompensas por completar juegos
- Sistema de niveles
- Achievements

**Archivos relacionados**:
- `src/pages/Juegos.tsx`
- `src/hooks/usePuma.ts`

**Tiempo estimado**: 8-10 horas

---

### Issue #9: Agregar información de proyectos destacados
**Labels**: `content`, `enhancement`
**Assignee**: @MarxMad

**Descripción**:
Completar la sección de proyectos destacados con información de proyectos desarrollados por CriptoUNAM.

**Información necesaria**:
- Nombre del proyecto
- Descripción técnica
- Stack tecnológico
- Links (GitHub, demo, docs)
- Screenshots
- Estado del proyecto

**Ubicación**: `/proyectos-destacados`

**Tiempo estimado**: 2 horas

---

### Issue #10: Documentar guía de contribución
**Labels**: `documentation`, `good first issue`
**Assignee**: @MarxMad

**Descripción**:
Crear un archivo `CONTRIBUTING.md` con lineamientos para nuevos contribuidores.

**Debe incluir**:
- Cómo hacer fork del repo
- Estándares de código
- Convención de commits
- Proceso de Pull Request
- Code of Conduct

**Referencias**:
- https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors

**Tiempo estimado**: 1-2 horas

---

## 🔵 PRIORIDAD BAJA (Nice to have)

### Issue #11: Implementar modo oscuro persistente
**Labels**: `enhancement`, `ui/ux`
**Assignee**: @MarxMad

**Descripción**:
Guardar la preferencia de modo oscuro del usuario en localStorage para que persista entre sesiones.

**Archivos a modificar**:
- `src/App.tsx`
- `src/index.css`

**Tiempo estimado**: 1 hora

---

### Issue #12: Agregar animaciones y microinteracciones
**Labels**: `enhancement`, `ui/ux`, `design`
**Assignee**: @MarxMad

**Descripción**:
Mejorar la experiencia de usuario con animaciones sutiles y microinteracciones.

**Ejemplos**:
- Animación al conectar wallet
- Transiciones suaves entre páginas
- Hover effects mejorados
- Loading states animados
- Toast notifications animadas

**Librerías sugeridas**:
- Framer Motion
- React Spring
- GSAP

**Tiempo estimado**: 4-5 horas

---

### Issue #13: Implementar sistema de notificaciones push
**Labels**: `enhancement`, `feature`
**Assignee**: @MarxMad

**Descripción**:
Agregar notificaciones push para mantener a los usuarios informados de nuevos eventos, cursos y newsletters.

**Tecnología**:
- Web Push API
- Service Workers
- Firebase Cloud Messaging (opcional)

**Tiempo estimado**: 5-6 horas

---

### Issue #14: Optimizar imágenes y assets
**Labels**: `performance`, `optimization`
**Assignee**: @MarxMad

**Descripción**:
Optimizar todas las imágenes del sitio para mejorar tiempos de carga.

**Pasos**:
1. Usar formato WebP
2. Implementar lazy loading
3. Crear versiones responsive
4. Usar CDN (Cloudflare)

**Tiempo estimado**: 2-3 horas

---

### Issue #15: Agregar tests automatizados
**Labels**: `testing`, `quality`
**Assignee**: @MarxMad

**Descripción**:
Implementar tests unitarios y de integración para componentes críticos.

**Frameworks**:
- Jest
- React Testing Library
- Cypress (E2E)

**Componentes prioritarios**:
- Sistema de autenticación
- Formularios de registro
- Sistema de likes
- PUMA rewards

**Tiempo estimado**: 8-10 horas

---

## 📊 RESUMEN

| Prioridad | Cantidad | Tiempo Estimado Total |
|-----------|----------|----------------------|
| 🔴 Crítica | 2 | ~30 min |
| 🟡 Alta | 5 | ~8-10 horas |
| 🟢 Media | 5 | ~18-22 horas |
| 🔵 Baja | 5 | ~20-25 horas |
| **TOTAL** | **17** | **~47-58 horas** |

---

## 🎯 ROADMAP SUGERIDO

### Sprint 1 (Esta semana) - CRÍTICO
- [ ] #1: Ejecutar script SQL de likes
- [ ] #2: Configurar dominio de email
- [ ] #4: Agregar fotos recientes

### Sprint 2 (Próxima semana) - CONTENIDO
- [ ] #5: Crear newsletters
- [ ] #6: Actualizar cursos
- [ ] #9: Información de proyectos

### Sprint 3 (Siguiente mes) - BLOCKCHAIN
- [ ] #3: Desplegar contrato PUMA
- [ ] Integrar wallet con recompensas
- [ ] Testing del sistema PUMA

### Sprint 4 (Futuro) - MEJORAS
- [ ] #7: Templates de email
- [ ] #8: Juegos educativos
- [ ] #11-15: Mejoras de UX y performance

---

**Nota**: Estos issues se pueden crear manualmente en GitHub o usar la CLI de GitHub para automatizarlo.

¿Quieres que cree un script para generar todos estos issues automáticamente?

