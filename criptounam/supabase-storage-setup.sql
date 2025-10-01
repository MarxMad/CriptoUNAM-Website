-- =============================================
-- CONFIGURACIÓN DE STORAGE PARA SUPABASE
-- =============================================

-- Crear buckets para diferentes tipos de archivos
INSERT INTO storage.buckets (id, name, public) VALUES 
('eventos', 'eventos', true),
('cursos', 'cursos', true),
('newsletter', 'newsletter', true),
('galerias', 'galerias', true);

-- =============================================
-- POLÍTICAS DE STORAGE
-- =============================================

-- Políticas para bucket de eventos
CREATE POLICY "Permitir lectura pública de eventos" ON storage.objects 
FOR SELECT USING (bucket_id = 'eventos');

CREATE POLICY "Permitir subida de eventos" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'eventos');

CREATE POLICY "Permitir actualización de eventos" ON storage.objects 
FOR UPDATE USING (bucket_id = 'eventos');

CREATE POLICY "Permitir eliminación de eventos" ON storage.objects 
FOR DELETE USING (bucket_id = 'eventos');

-- Políticas para bucket de cursos
CREATE POLICY "Permitir lectura pública de cursos" ON storage.objects 
FOR SELECT USING (bucket_id = 'cursos');

CREATE POLICY "Permitir subida de cursos" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'cursos');

CREATE POLICY "Permitir actualización de cursos" ON storage.objects 
FOR UPDATE USING (bucket_id = 'cursos');

CREATE POLICY "Permitir eliminación de cursos" ON storage.objects 
FOR DELETE USING (bucket_id = 'cursos');

-- Políticas para bucket de newsletter
CREATE POLICY "Permitir lectura pública de newsletter" ON storage.objects 
FOR SELECT USING (bucket_id = 'newsletter');

CREATE POLICY "Permitir subida de newsletter" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'newsletter');

CREATE POLICY "Permitir actualización de newsletter" ON storage.objects 
FOR UPDATE USING (bucket_id = 'newsletter');

CREATE POLICY "Permitir eliminación de newsletter" ON storage.objects 
FOR DELETE USING (bucket_id = 'newsletter');

-- Políticas para bucket de galerías
CREATE POLICY "Permitir lectura pública de galerias" ON storage.objects 
FOR SELECT USING (bucket_id = 'galerias');

CREATE POLICY "Permitir subida de galerias" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'galerias');

CREATE POLICY "Permitir actualización de galerias" ON storage.objects 
FOR UPDATE USING (bucket_id = 'galerias');

CREATE POLICY "Permitir eliminación de galerias" ON storage.objects 
FOR DELETE USING (bucket_id = 'galerias');
