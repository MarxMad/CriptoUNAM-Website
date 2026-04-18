## Descripción

Configurar el proyecto **Supabase** (si no existe) y definir el **esquema de base de datos** para cursos, inscripciones y progreso de usuarios. Este issue es la base para los siguientes (sincronizar progreso y puntos).

---

**Estado:** ✅ **COMPLETADA** — Esquema único en `supabase-schema-unico.sql`, tablas `curso_inscripciones`, `curso_progreso`, `perfiles_puntos`; RLS y `.env.example` documentados en `docs/`.

---

## Pasos

### 1. Proyecto Supabase

- [x] Crear proyecto en [Supabase](https://supabase.com) para el entorno correspondiente (dev/staging/prod) o confirmar que ya existe.
- [x] Anotar `SUPABASE_URL` y `SUPABASE_ANON_KEY` (y `SERVICE_ROLE_KEY` solo en backend si aplica).
- [x] Configurar variables de entorno en el repo (ej. en `.env.example` y en Vercel/Netlify) sin exponer la service role en el frontend.

### 2. Esquema de tablas

Diseñar e implementar (migraciones SQL o desde el dashboard) al menos:

- [x] **`cursos`** (opcional si los cursos siguen en código): `id`, `titulo`, `descripcion`, `duracion`, `nivel`, `imagen`, `capitulos`/`lecciones` (JSON o tablas relacionadas), etc.
- [x] **`usuarios`** o **`perfiles`**: identificador por `wallet_address` (o `user_id` si más adelante hay auth adicional). Campos útiles: `wallet_address` (PK o unique), `puntos`, `created_at`, `updated_at`. → Implementado como `perfiles_puntos`.
- [x] **`inscripciones`**: `id`, `wallet_address`, `curso_id`, `inscrito_en` (timestamp), opcional `firma_mensaje` o hash para auditoría. → Tabla `curso_inscripciones`.
- [x] **`progreso_lecciones`**: `id`, `wallet_address`, `curso_id`, `leccion_index` (o `seccion_id`), `completado_en`, `completado` (boolean). Clave única por (wallet, curso, leccion) para no duplicar. → Tabla `curso_progreso`.

### 3. Row Level Security (RLS)

- [x] Activar RLS en tablas que contengan datos por usuario (`perfiles`, `inscripciones`, `progreso_lecciones`).
- [x] Políticas: cada usuario solo puede leer/escribir filas donde `wallet_address = auth.uid()` o equivalente (si usan custom JWT con wallet) o mediante `service_role` en backend.
- [x] Documentar en el repo cómo se identifica al usuario (wallet vs Supabase Auth) para futuras consultas.

### 4. Documentación

- [x] Añadir al repo (ej. `docs/SUPABASE.md` o README) un resumen del esquema, enlaces al proyecto Supabase (sin credenciales) y pasos para correr migraciones localmente si aplica. → `docs/SQL_ARCHIVOS_EN_USO.md`, `docs/SQL-README.md`.

---

## Entregables

- Proyecto Supabase creado y accesible.
- Esquema SQL aplicado (script en repo o migración versionada).
- RLS configurado y probado con un usuario de prueba.
- `.env.example` actualizado con las variables necesarias.
- Documentación mínima del esquema y políticas.

---

## Relación con otros issues

- **Bloqueado por**: ninguno (es el primero).
- **Bloquea**: “Sincronizar progreso de lecciones con Supabase” y “Sistema de puntos por progreso y mostrarlos en perfil”.

## Labels sugeridos

`infra`, `supabase`, `database`, `epic: progreso y puntos`
