# ⚡ Configuración Rápida - CriptoUNAM

## 🎯 Lo que necesitas hacer AHORA para que las newsletters aparezcan:

### Paso 1: Ve a tu Supabase (2 minutos)
1. Abre: https://supabase.com/dashboard/project/shccrrwnmogswspvlakf
2. Click en **SQL Editor** (icono de código en el menú izquierdo)

### Paso 2: Ejecuta el esquema SQL (1 minuto)
1. Click en **New Query**
2. Copia **TODO** el contenido del archivo: `criptounam/supabase-complete-schema.sql`
3. Pégalo en el editor
4. Click en **Run** o presiona `Ctrl/Cmd + Enter`
5. Espera a que termine (verás un mensaje de éxito)

### Paso 3: Verifica que funcionó (30 segundos)
Ejecuta esta consulta en el SQL Editor:
```sql
SELECT COUNT(*) as total_newsletters FROM public.newsletters;
```
Deberías ver: `total_newsletters: 3` ✅

### Paso 4: Configura Vercel (1 minuto)
Ya tienes las variables configuradas en el código, pero para mayor seguridad, agrégalas también en Vercel:

1. Ve a: https://vercel.com/tu-proyecto/settings/environment-variables
2. Agrega estas variables:

```
VITE_SUPABASE_URL=https://shccrrwnmogswspvlakf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoY2NycndubW9nc3dzcHZsYWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyODYwNzcsImV4cCI6MjA3NDg2MjA3N30.heVBb4qhASOv6UZlfrTkZpoiQbva3JXFynn2AhO6_oM
```

3. Click **Save**

### Paso 5: Redeploy (automático)
Vercel hará redeploy automáticamente al guardar las variables. 
O puedes hacer un nuevo push y listo.

---

## ✅ ¡Listo! Las newsletters deberían aparecer

Una vez que hagas esto:
- ✅ Las newsletters se mostrarán en la página
- ✅ Los usuarios podrán dar likes
- ✅ Las suscripciones se guardarán en la base de datos
- ✅ Todo el sistema estará funcional

---

## 📊 ¿Qué incluye el esquema SQL?

El script que vas a ejecutar crea:

### Tablas:
- ✅ `newsletters` - Artículos del blog (con 3 artículos de ejemplo)
- ✅ `likes` - Sistema de likes
- ✅ `email_subscriptions` - Suscripciones de email
- ✅ `puma_users` - Usuarios y sus recompensas
- ✅ `puma_transactions` - Historial de transacciones
- ✅ `cursos` - Cursos (con 3 cursos de ejemplo)
- ✅ `eventos` - Eventos de la comunidad

### Características avanzadas:
- ✅ Índices para optimización
- ✅ Triggers automáticos para actualizar contadores
- ✅ Row Level Security (RLS) configurado
- ✅ Funciones para gestión de likes
- ✅ Timestamps automáticos

---

## 🔧 Comandos útiles de SQL

### Ver todos los newsletters:
```sql
SELECT id, titulo, autor, like_count, view_count 
FROM public.newsletters 
ORDER BY created_at DESC;
```

### Ver todas las tablas creadas:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### Agregar un nuevo newsletter:
```sql
INSERT INTO public.newsletters (titulo, contenido, autor, imagen, tags) 
VALUES (
  'Mi Nuevo Artículo',
  'Contenido del artículo en Markdown...',
  'Tu Nombre',
  'https://url-de-imagen.jpg',
  ARRAY['tag1', 'tag2', 'blockchain']
);
```

### Ver cuántos likes tiene cada newsletter:
```sql
SELECT n.titulo, n.like_count, COUNT(l.id) as likes_reales
FROM public.newsletters n
LEFT JOIN public.likes l ON n.id = l.newsletter_id
GROUP BY n.id, n.titulo, n.like_count;
```

### Ver suscripciones de email:
```sql
SELECT email, is_active, subscribed_at 
FROM public.email_subscriptions 
ORDER BY subscribed_at DESC;
```

---

## 🐛 Solución de problemas

### "Las newsletters aún no aparecen"
1. ¿Ejecutaste el SQL completo? Verifica con: `SELECT COUNT(*) FROM newsletters;`
2. ¿Las variables están en Vercel? Revisa: Settings → Environment Variables
3. ¿Hiciste redeploy? Git push o Redeploy manual en Vercel

### "Error al conectar con Supabase"
- Verifica que la URL y la KEY sean correctas
- Asegúrate de que el proyecto no esté pausado en Supabase
- Revisa los logs en Vercel: Deployments → Tu deployment → Function Logs

### "Error de permisos en SQL"
- Asegúrate de estar usando el SQL Editor de Supabase
- Verifica que tu cuenta tenga permisos de administrador en el proyecto

---

## 📞 Si necesitas ayuda

1. **Revisa los logs**: Vercel Dashboard → Function Logs
2. **Revisa Supabase**: Table Editor para ver si las tablas existen
3. **Verifica las variables**: `console.log()` en el código para debug

---

## 🎉 Próximos pasos (opcionales)

Una vez que las newsletters funcionen, puedes:

1. **Configurar emails automáticos con Resend**
   - Configurar dominio personalizado
   - Agregar registros DNS

2. **Desplegar el contrato PUMA**
   - Para recompensas reales en blockchain
   - Requiere configurar wallet y red

3. **Agregar más contenido**
   - Subir más newsletters desde la interfaz de admin
   - Agregar más cursos y eventos

---

**Tiempo total estimado**: ⏱️ ~5 minutos

¡Todo está listo para funcionar! Solo falta ejecutar el SQL. 🚀

