## Resumen

Integrar **Supabase** como base de datos para los cursos y persistir el **progreso real** de los usuarios (lecciones completadas, cuestionarios aprobados). Los usuarios ganarán **puntos** según su avance y podrán verlos en su **perfil**.

---

**Estado:** ✅ **COMPLETADA** — Base de datos ligada (supabase-schema-unico.sql), progreso por wallet y puntos en perfil implementados.

---

## Objetivos

- Base de datos en Supabase para cursos, inscripciones y progreso.
- Progreso persistente por usuario (qué lecciones completó en cada curso).
- Sistema de puntos asociado al progreso (ej. X puntos por lección, bonus por curso completado).
- Mostrar puntos y progreso en el perfil del usuario.

---

## Issues relacionados

Este epic se divide en los siguientes issues (implementar en este orden):

1. **#8** — [Infra] Configurar Supabase y esquema de BD para cursos y progreso → Define proyecto Supabase, tablas y RLS. ✅
2. **#9** — Sincronizar progreso de lecciones con Supabase desde el frontend → Guardar/recuperar completados por wallet. ✅
3. **#10** — Sistema de puntos por progreso y mostrarlos en perfil → Cálculo de puntos y UI en perfil. ✅

---

## Criterios de aceptación (global)

- [x] El progreso de un usuario (lecciones/secciones completadas por curso) se guarda en Supabase y persiste al cerrar sesión.
- [x] Cada usuario tiene un "score" o puntos derivados de su progreso (reglas claras y documentadas).
- [x] En el perfil del usuario se muestran: puntos actuales y desglose de progreso por curso (opcional).
- [x] La identificación del usuario para BD es consistente (ej. `wallet address` o `user_id` vinculado a wallet).

---

## Notas técnicas

- El frontend ya usa **wallet** (wagmi) para inscripción con firma; el mismo `address` puede ser la clave para asociar progreso en Supabase.
- Considerar **Row Level Security (RLS)** en Supabase para que cada usuario solo lea/escriba su propio progreso.
- Definir si “curso completado” requiere todas las secciones + todos los cuestionarios aprobados (como hoy en la UI).
