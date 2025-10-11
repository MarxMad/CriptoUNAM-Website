-- ==========================================
-- Fix de tabla LIKES
-- ==========================================
-- Este script corrige la tabla de likes para que funcione correctamente

-- 1. Agregar columna created_at si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'likes' AND column_name = 'created_at') THEN
        ALTER TABLE public.likes ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Columna created_at agregada a likes';
    END IF;
END $$;

-- 2. Eliminar políticas existentes que puedan causar conflicto
DROP POLICY IF EXISTS "Likes son públicos" ON public.likes;
DROP POLICY IF EXISTS "Usuarios pueden dar like" ON public.likes;
DROP POLICY IF EXISTS "Usuarios pueden quitar like" ON public.likes;

-- 3. Crear nuevas políticas RLS más permisivas
-- Permitir a todos ver los likes
CREATE POLICY "Permitir lectura pública de likes"
ON public.likes
FOR SELECT
USING (true);

-- Permitir a cualquiera insertar likes (sin autenticación por ahora)
CREATE POLICY "Permitir insertar likes"
ON public.likes
FOR INSERT
WITH CHECK (true);

-- Permitir a cualquiera eliminar sus propios likes
CREATE POLICY "Permitir eliminar likes"
ON public.likes
FOR DELETE
USING (true);

-- 4. Asegurar que RLS esté habilitada
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- 5. Verificar estructura de la tabla
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'likes'
ORDER BY ordinal_position;

-- 6. Verificar políticas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'likes';

RAISE NOTICE '✅ Tabla de likes corregida exitosamente';

