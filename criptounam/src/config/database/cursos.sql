-- ==========================================
-- CriptoUNAM - Sistema de Cursos
-- Esquema de base de datos para Supabase
-- ==========================================

-- ==========================================
-- 1. TABLA DE CURSOS (actualizada)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.cursos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL, -- URL amigable: 'intro-blockchain'
  titulo VARCHAR(500) NOT NULL,
  descripcion TEXT NOT NULL,
  descripcion_corta VARCHAR(500), -- Para cards
  nivel VARCHAR(50) NOT NULL CHECK (nivel IN ('Principiante', 'Intermedio', 'Avanzado')),
  duracion VARCHAR(100), -- '4 semanas', '20 horas'
  instructor VARCHAR(255),
  instructor_avatar VARCHAR(500),
  imagen VARCHAR(500),
  precio DECIMAL(10, 2) DEFAULT 0,
  categorias TEXT[] DEFAULT '{}',
  requisitos TEXT,
  objetivos TEXT[], -- Lo que aprenderás
  rating DECIMAL(2, 1) DEFAULT 0,
  total_estudiantes INTEGER DEFAULT 0,
  total_lecciones INTEGER DEFAULT 0,
  duracion_total_minutos INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  orden INTEGER DEFAULT 0, -- Para ordenar en la página
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_cursos_slug ON public.cursos(slug);
CREATE INDEX IF NOT EXISTS idx_cursos_nivel ON public.cursos(nivel);
CREATE INDEX IF NOT EXISTS idx_cursos_is_published ON public.cursos(is_published);
CREATE INDEX IF NOT EXISTS idx_cursos_is_featured ON public.cursos(is_featured);
CREATE INDEX IF NOT EXISTS idx_cursos_categorias ON public.cursos USING GIN (categorias);

COMMENT ON TABLE public.cursos IS 'Tabla principal de cursos de CriptoUNAM';

-- ==========================================
-- 2. TABLA DE MÓDULOS (secciones del curso)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.modulos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  curso_id UUID NOT NULL REFERENCES public.cursos(id) ON DELETE CASCADE,
  titulo VARCHAR(500) NOT NULL,
  descripcion TEXT,
  orden INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_modulos_curso_id ON public.modulos(curso_id);
CREATE INDEX IF NOT EXISTS idx_modulos_orden ON public.modulos(orden);

COMMENT ON TABLE public.modulos IS 'Módulos o secciones de un curso';

-- ==========================================
-- 3. TABLA DE LECCIONES (videos/contenido)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.lecciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  curso_id UUID NOT NULL REFERENCES public.cursos(id) ON DELETE CASCADE,
  modulo_id UUID REFERENCES public.modulos(id) ON DELETE SET NULL,
  titulo VARCHAR(500) NOT NULL,
  descripcion TEXT,
  -- Video/Contenido
  tipo VARCHAR(50) DEFAULT 'video' CHECK (tipo IN ('video', 'texto', 'quiz', 'ejercicio')),
  video_url VARCHAR(500), -- URL de YouTube, Vimeo, etc.
  video_plataforma VARCHAR(50) DEFAULT 'youtube' CHECK (video_plataforma IN ('youtube', 'vimeo', 'bunny', 'directo')),
  duracion_minutos INTEGER DEFAULT 0,
  contenido_texto TEXT, -- Para lecciones tipo texto
  -- Recursos adicionales
  recursos JSONB DEFAULT '[]', -- [{nombre, url, tipo}]
  -- Orden y estado
  orden INTEGER DEFAULT 0,
  is_preview BOOLEAN DEFAULT false, -- Si es gratis/preview
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lecciones_curso_id ON public.lecciones(curso_id);
CREATE INDEX IF NOT EXISTS idx_lecciones_modulo_id ON public.lecciones(modulo_id);
CREATE INDEX IF NOT EXISTS idx_lecciones_orden ON public.lecciones(orden);
CREATE INDEX IF NOT EXISTS idx_lecciones_is_preview ON public.lecciones(is_preview);

COMMENT ON TABLE public.lecciones IS 'Lecciones individuales de cada curso';
COMMENT ON COLUMN public.lecciones.video_url IS 'URL del video (YouTube embed, Vimeo, etc.)';
COMMENT ON COLUMN public.lecciones.is_preview IS 'Si la lección es gratuita para vista previa';

-- ==========================================
-- 4. TABLA DE INSCRIPCIONES
-- ==========================================

CREATE TABLE IF NOT EXISTS public.inscripciones_cursos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL, -- Wallet address
  curso_id UUID NOT NULL REFERENCES public.cursos(id) ON DELETE CASCADE,
  -- Datos del usuario (opcional, para constancia)
  nombre_completo VARCHAR(255),
  email VARCHAR(255),
  -- Estado
  estado VARCHAR(50) DEFAULT 'activo' CHECK (estado IN ('activo', 'completado', 'cancelado', 'pausado')),
  progreso_porcentaje INTEGER DEFAULT 0,
  -- Fechas
  fecha_inscripcion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_inicio TIMESTAMP WITH TIME ZONE,
  fecha_completado TIMESTAMP WITH TIME ZONE,
  ultima_actividad TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, curso_id)
);

CREATE INDEX IF NOT EXISTS idx_inscripciones_user_id ON public.inscripciones_cursos(user_id);
CREATE INDEX IF NOT EXISTS idx_inscripciones_curso_id ON public.inscripciones_cursos(curso_id);
CREATE INDEX IF NOT EXISTS idx_inscripciones_estado ON public.inscripciones_cursos(estado);

COMMENT ON TABLE public.inscripciones_cursos IS 'Inscripciones de usuarios a cursos';

-- ==========================================
-- 5. TABLA DE PROGRESO DE LECCIONES
-- ==========================================

CREATE TABLE IF NOT EXISTS public.progreso_lecciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  leccion_id UUID NOT NULL REFERENCES public.lecciones(id) ON DELETE CASCADE,
  curso_id UUID NOT NULL REFERENCES public.cursos(id) ON DELETE CASCADE,
  -- Estado
  completada BOOLEAN DEFAULT false,
  progreso_video INTEGER DEFAULT 0, -- Segundos vistos
  duracion_total INTEGER DEFAULT 0, -- Duración total en segundos
  -- Fechas
  fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_completado TIMESTAMP WITH TIME ZONE,
  ultima_posicion INTEGER DEFAULT 0, -- Última posición del video
  -- Metadata
  notas TEXT, -- Notas del usuario
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, leccion_id)
);

CREATE INDEX IF NOT EXISTS idx_progreso_user_id ON public.progreso_lecciones(user_id);
CREATE INDEX IF NOT EXISTS idx_progreso_leccion_id ON public.progreso_lecciones(leccion_id);
CREATE INDEX IF NOT EXISTS idx_progreso_curso_id ON public.progreso_lecciones(curso_id);
CREATE INDEX IF NOT EXISTS idx_progreso_completada ON public.progreso_lecciones(completada);

COMMENT ON TABLE public.progreso_lecciones IS 'Progreso de cada usuario en cada lección';

-- ==========================================
-- 6. TABLA DE CERTIFICADOS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.certificados (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  curso_id UUID NOT NULL REFERENCES public.cursos(id) ON DELETE CASCADE,
  inscripcion_id UUID REFERENCES public.inscripciones_cursos(id) ON DELETE SET NULL,
  -- Datos del certificado
  codigo_verificacion VARCHAR(50) UNIQUE NOT NULL,
  nombre_estudiante VARCHAR(255) NOT NULL,
  titulo_curso VARCHAR(500) NOT NULL,
  instructor VARCHAR(255),
  -- NFT (opcional)
  nft_token_id VARCHAR(255),
  nft_contract_address VARCHAR(255),
  nft_tx_hash VARCHAR(255),
  -- Fechas
  fecha_emision TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_expiracion TIMESTAMP WITH TIME ZONE, -- NULL = no expira
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, curso_id)
);

CREATE INDEX IF NOT EXISTS idx_certificados_user_id ON public.certificados(user_id);
CREATE INDEX IF NOT EXISTS idx_certificados_curso_id ON public.certificados(curso_id);
CREATE INDEX IF NOT EXISTS idx_certificados_codigo ON public.certificados(codigo_verificacion);

COMMENT ON TABLE public.certificados IS 'Certificados emitidos por completar cursos';

-- ==========================================
-- 7. FUNCIONES Y TRIGGERS
-- ==========================================

-- Función para actualizar el progreso del curso
CREATE OR REPLACE FUNCTION actualizar_progreso_curso()
RETURNS TRIGGER AS $$
DECLARE
  total_lecciones INTEGER;
  lecciones_completadas INTEGER;
  nuevo_progreso INTEGER;
BEGIN
  -- Contar total de lecciones del curso
  SELECT COUNT(*) INTO total_lecciones
  FROM public.lecciones
  WHERE curso_id = NEW.curso_id AND is_published = true;

  -- Contar lecciones completadas por el usuario
  SELECT COUNT(*) INTO lecciones_completadas
  FROM public.progreso_lecciones
  WHERE user_id = NEW.user_id 
    AND curso_id = NEW.curso_id 
    AND completada = true;

  -- Calcular porcentaje
  IF total_lecciones > 0 THEN
    nuevo_progreso := ROUND((lecciones_completadas::NUMERIC / total_lecciones::NUMERIC) * 100);
  ELSE
    nuevo_progreso := 0;
  END IF;

  -- Actualizar inscripción
  UPDATE public.inscripciones_cursos
  SET 
    progreso_porcentaje = nuevo_progreso,
    ultima_actividad = NOW(),
    estado = CASE WHEN nuevo_progreso >= 100 THEN 'completado' ELSE estado END,
    fecha_completado = CASE WHEN nuevo_progreso >= 100 AND fecha_completado IS NULL THEN NOW() ELSE fecha_completado END
  WHERE user_id = NEW.user_id AND curso_id = NEW.curso_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar progreso cuando se completa una lección
CREATE TRIGGER trigger_actualizar_progreso
AFTER INSERT OR UPDATE OF completada ON public.progreso_lecciones
FOR EACH ROW
WHEN (NEW.completada = true)
EXECUTE FUNCTION actualizar_progreso_curso();

-- Función para actualizar contador de estudiantes en curso
CREATE OR REPLACE FUNCTION actualizar_contador_estudiantes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.cursos
    SET total_estudiantes = total_estudiantes + 1
    WHERE id = NEW.curso_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.cursos
    SET total_estudiantes = GREATEST(total_estudiantes - 1, 0)
    WHERE id = OLD.curso_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_contador_estudiantes
AFTER INSERT OR DELETE ON public.inscripciones_cursos
FOR EACH ROW EXECUTE FUNCTION actualizar_contador_estudiantes();

-- Función para actualizar total de lecciones en curso
CREATE OR REPLACE FUNCTION actualizar_total_lecciones()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.cursos
  SET 
    total_lecciones = (
      SELECT COUNT(*) FROM public.lecciones 
      WHERE curso_id = COALESCE(NEW.curso_id, OLD.curso_id) AND is_published = true
    ),
    duracion_total_minutos = (
      SELECT COALESCE(SUM(duracion_minutos), 0) FROM public.lecciones 
      WHERE curso_id = COALESCE(NEW.curso_id, OLD.curso_id) AND is_published = true
    )
  WHERE id = COALESCE(NEW.curso_id, OLD.curso_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_total_lecciones
AFTER INSERT OR UPDATE OR DELETE ON public.lecciones
FOR EACH ROW EXECUTE FUNCTION actualizar_total_lecciones();

-- ==========================================
-- 8. ROW LEVEL SECURITY
-- ==========================================

ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lecciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inscripciones_cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progreso_lecciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificados ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública
CREATE POLICY "Cursos publicados son públicos" ON public.cursos 
  FOR SELECT USING (is_published = true);

CREATE POLICY "Módulos de cursos publicados son públicos" ON public.modulos 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.cursos WHERE id = modulos.curso_id AND is_published = true)
  );

CREATE POLICY "Lecciones de cursos publicados son públicas" ON public.lecciones 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.cursos WHERE id = lecciones.curso_id AND is_published = true)
  );

-- Políticas de inscripciones (usuarios ven solo las suyas)
CREATE POLICY "Usuarios ven sus inscripciones" ON public.inscripciones_cursos 
  FOR SELECT USING (true); -- Cambiar a auth cuando se implemente

CREATE POLICY "Usuarios pueden inscribirse" ON public.inscripciones_cursos 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Usuarios actualizan sus inscripciones" ON public.inscripciones_cursos 
  FOR UPDATE USING (true);

-- Políticas de progreso
CREATE POLICY "Usuarios ven su progreso" ON public.progreso_lecciones 
  FOR SELECT USING (true);

CREATE POLICY "Usuarios registran progreso" ON public.progreso_lecciones 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Usuarios actualizan su progreso" ON public.progreso_lecciones 
  FOR UPDATE USING (true);

-- Políticas de certificados
CREATE POLICY "Certificados son públicos" ON public.certificados 
  FOR SELECT USING (true);

-- ==========================================
-- 9. DATOS DE EJEMPLO
-- ==========================================

-- Insertar curso de ejemplo
INSERT INTO public.cursos (
  slug, titulo, descripcion, descripcion_corta, nivel, duracion, instructor,
  imagen, precio, categorias, requisitos, objetivos, is_published, is_featured
) VALUES (
  'intro-blockchain',
  'Introducción a Blockchain',
  'Aprende los fundamentos de la tecnología blockchain, desde los conceptos básicos hasta las aplicaciones prácticas. Este curso te dará una base sólida para entender cómo funcionan las criptomonedas, los contratos inteligentes y las aplicaciones descentralizadas.',
  'Aprende los fundamentos de la tecnología blockchain y sus aplicaciones.',
  'Principiante',
  '2 semanas',
  'Gerardo Pedrizco Vela',
  '/images/cursos/1.svg',
  0,
  ARRAY['Blockchain', 'Tecnología', 'Fundamentos'],
  'No se requieren conocimientos previos.',
  ARRAY['Entender qué es blockchain y cómo funciona', 'Conocer las principales criptomonedas', 'Crear tu primera wallet', 'Entender los smart contracts'],
  true,
  true
) ON CONFLICT (slug) DO NOTHING;

-- Insertar módulo de ejemplo
INSERT INTO public.modulos (curso_id, titulo, descripcion, orden)
SELECT id, 'Fundamentos de Blockchain', 'Conceptos básicos y funcionamiento', 1
FROM public.cursos WHERE slug = 'intro-blockchain'
ON CONFLICT DO NOTHING;

-- Insertar lecciones de ejemplo
INSERT INTO public.lecciones (curso_id, modulo_id, titulo, descripcion, video_url, duracion_minutos, orden, is_preview)
SELECT 
  c.id,
  m.id,
  '¿Qué es Blockchain?',
  'Introducción a la tecnología blockchain y sus conceptos fundamentales.',
  'https://www.youtube.com/embed/SSo_EIwHSd4',
  15,
  1,
  true -- Esta lección es preview gratuito
FROM public.cursos c
JOIN public.modulos m ON m.curso_id = c.id
WHERE c.slug = 'intro-blockchain'
ON CONFLICT DO NOTHING;

INSERT INTO public.lecciones (curso_id, modulo_id, titulo, descripcion, video_url, duracion_minutos, orden, is_preview)
SELECT 
  c.id,
  m.id,
  'Criptomonedas y Bitcoin',
  '¿Qué es una criptomoneda? ¿Cómo funciona Bitcoin?',
  'https://www.youtube.com/embed/bBC-nXj3Ng4',
  20,
  2,
  false
FROM public.cursos c
JOIN public.modulos m ON m.curso_id = c.id
WHERE c.slug = 'intro-blockchain'
ON CONFLICT DO NOTHING;

INSERT INTO public.lecciones (curso_id, modulo_id, titulo, descripcion, video_url, duracion_minutos, orden, is_preview)
SELECT 
  c.id,
  m.id,
  'Contratos Inteligentes',
  'Introducción a los smart contracts y su funcionamiento.',
  'https://www.youtube.com/embed/ZE2HxTmxfrI',
  25,
  3,
  false
FROM public.cursos c
JOIN public.modulos m ON m.curso_id = c.id
WHERE c.slug = 'intro-blockchain'
ON CONFLICT DO NOTHING;

-- ==========================================
-- SCRIPT COMPLETADO
-- ==========================================
-- Ejecutar en Supabase SQL Editor
-- Verificar con: SELECT * FROM public.cursos;
