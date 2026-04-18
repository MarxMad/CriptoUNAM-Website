## Descripción

Conectar el **frontend** (página de curso / `RegistroCurso`) con **Supabase** para guardar y recuperar el **progreso real** de lecciones por usuario (por wallet). Al completar una lección o sección, debe persistirse en BD; al cargar el curso, debe mostrarse el estado guardado.

---

**Estado:** ✅ **COMPLETADA** — `progresoCurso.service.ts` implementado; inscripción, progreso y lecciones completadas se sincronizan con Supabase desde `RegistroCurso.tsx`.

---

## Pasos

### 1. Cliente Supabase en el frontend

- [x] Instalar `@supabase/supabase-js` en el proyecto del frontend (ej. `criptounam`).
- [x] Crear un cliente Supabase (singleton) usando `SUPABASE_URL` y `SUPABASE_ANON_KEY`.
- [x] Asegurar que solo se usen políticas permitidas con la anon key (RLL ya configurado en el issue de esquema).

### 2. Identificación del usuario

- [x] Decidir cómo mapear “usuario” a Supabase en frontend: por **wallet address** (recomendado si no hay Supabase Auth). Crear o actualizar fila en `perfiles` al conectar wallet si se usa esa tabla.
- [ ] Si Supabase Auth se usa en el futuro: documentar migración de “progreso por wallet” a “progreso por user_id”.

### 3. Inscripción en curso

- [x] Al completar la firma de inscripción (flujo actual en `RegistroCurso`), además de Telegram:
  - [x] Insertar o actualizar fila en `inscripciones` (wallet, curso_id, timestamp).
- [x] Al cargar la página del curso, comprobar en Supabase si el usuario está inscrito; si hay datos en BD, priorizar sobre estado local.

### 4. Progreso de lecciones

- [x] Al marcar una lección como completada (`handleCompletarLeccion` o equivalente):
  - [x] Insertar/upsert en `progreso_lecciones` (wallet, curso_id, leccion_index o seccion_id, completado_en).
- [x] Al cargar el curso:
  - [x] Obtener de Supabase la lista de lecciones/secciones completadas para ese wallet y curso.
  - [x] Inicializar estado local (ej. `leccionesCompletadas`) con esos datos para que la UI y la barra de progreso sean correctas.
- [ ] Manejar offline/error: si Supabase falla, mostrar mensaje y opcionalmente guardar en `localStorage` para retry después (opcional).

### 5. Consistencia con cursos con capítulos

- [x] Si el curso usa `capitulos` y `secciones`, el índice plano (ej. `leccion_index`) debe coincidir con `getLeccionesFlat(curso)` para que el progreso se mapee bien entre frontend y BD.

---

## Criterios de aceptación

- [x] Al completar una lección, el cambio se refleja en Supabase (visible en dashboard o con una query de prueba).
- [x] Al recargar la página o volver otro día, el progreso mostrado es el guardado en Supabase.
- [x] La inscripción al curso queda registrada en Supabase además del flujo actual (firma + Telegram).

---

## Relación con otros issues

- **Bloqueado por**: “[Infra] Configurar Supabase y esquema de BD para cursos y progreso”.
- **Bloquea**: “Sistema de puntos por progreso y mostrarlos en perfil” (el cálculo de puntos usará estos datos).

## Labels sugeridos

`frontend`, `supabase`, `progreso`, `epic: progreso y puntos`
