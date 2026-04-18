## Descripción

Implementar un **sistema de puntos** basado en el progreso real del usuario (lecciones y cursos completados) y mostrar esos **puntos en el perfil** del usuario. Los puntos se calculan a partir de los datos guardados en Supabase (issue de progreso).

---

**Estado:** ✅ **COMPLETADA** — Reglas en `docs/PUNTOS.md`; tabla `perfiles_puntos`; servicio `obtenerPuntos`/`marcarLeccionCompletada`; puntos visibles en `Perfil.tsx`.

---

## Pasos

### 1. Reglas de puntos

- [x] Definir reglas claras y documentadas, por ejemplo:
  - X puntos por cada lección/sección completada (ej. 10 puntos).
  - Y puntos bonus al completar el 100% de un curso (ej. 50 puntos).
  - (Opcional) Puntos por aprobar cuestionarios en primer intento, etc.
- [x] Documentar las reglas en el repo (ej. `docs/PUNTOS.md`) y dejarlas fáciles de cambiar (constantes o config).

### 2. Cálculo y almacenamiento

- [x] Decidir dónde se calcula el total de puntos:
  - **Opción A**: Calcular on-the-fly desde `progreso_lecciones` + `inscripciones` (consultas a Supabase).
  - **Opción B**: Mantener campo `puntos` en `perfiles` y actualizarlo al completar cada lección/curso (trigger en Supabase o desde frontend).
- [x] Si es Opción B: al guardar progreso en `progreso_lecciones`, actualizar también `perfiles.puntos` (o una tabla `puntos_historial` si se quiere historial).
- [x] Asegurar que el cálculo sea idempotente (no sumar dos veces la misma lección).

### 3. API o consultas desde el frontend

- [x] Si el cálculo es en frontend: crear función/servicio que, dado `wallet_address`, consulte progreso y devuelva `{ puntos, desglosePorCurso }`.
- [ ] Si hay backend (API o Edge): exponer endpoint tipo `GET /api/usuario/puntos` o `GET /api/usuario/perfil` que devuelva puntos y progreso (protegido por wallet o sesión).

### 4. UI de perfil

- [x] En la página o sección de **perfil** del usuario:
  - [x] Mostrar **puntos totales** de forma visible (ej. badge, número grande, “X puntos”).
  - [ ] (Opcional) Mostrar desglose: “Curso A: 3/5 lecciones”, “Curso B: completado”, etc.
- [x] Asegurar que solo se muestre cuando el usuario tenga wallet conectada (o sesión) y que los datos vengan de Supabase.

### 5. Consistencia

- [x] Si un usuario completa una lección en dos dispositivos, los puntos deben ser coherentes (una sola fuente de verdad en Supabase).

---

## Criterios de aceptación

- [x] Existe un conjunto de reglas de puntos documentado.
- [x] Los puntos se calculan o actualizan a partir del progreso real en Supabase.
- [x] El usuario puede ver sus puntos en su perfil (y opcionalmente el desglose por curso).
- [x] No se duplican puntos por la misma lección completada.

---

## Relación con otros issues

- **Bloqueado por**: “Sincronizar progreso de lecciones con Supabase”.
- **Bloquea**: ninguno (es el último del epic).

## Labels sugeridos

`frontend`, `perfil`, `puntos`, `gamificación`, `epic: progreso y puntos`
