-- ==========================================
-- MIGRACIÓN SEGURA DE BASE DE DATOS
-- ==========================================
-- Este script actualiza tu base de datos SIN borrar datos existentes
-- Es SEGURO ejecutarlo incluso si ya tienes tablas creadas

-- ==========================================
-- PASO 1: Verificar estado actual
-- ==========================================

-- Ver qué tablas ya existen
DO $$ 
BEGIN
    RAISE NOTICE 'Verificando tablas existentes...';
END $$;

SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as columnas
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- ==========================================
-- PASO 2: Crear/Actualizar tabla NEWSLETTERS
-- ==========================================

-- Si tienes tabla "newsletter" (singular), la renombramos
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'newsletter') THEN
        -- Renombrar newsletter a newsletters
        ALTER TABLE IF EXISTS newsletter RENAME TO newsletters;
        RAISE NOTICE 'Tabla newsletter renombrada a newsletters';
    END IF;
END $$;

-- Crear tabla newsletters si no existe
CREATE TABLE IF NOT EXISTS public.newsletters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR(500) NOT NULL,
  contenido TEXT NOT NULL,
  autor VARCHAR(255) NOT NULL,
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  imagen VARCHAR(500),
  tags TEXT[] DEFAULT '{}',
  like_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agregar columnas faltantes si no existen
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'newsletters' AND column_name = 'like_count') THEN
        ALTER TABLE public.newsletters ADD COLUMN like_count INTEGER DEFAULT 0;
        RAISE NOTICE 'Columna like_count agregada a newsletters';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'newsletters' AND column_name = 'view_count') THEN
        ALTER TABLE public.newsletters ADD COLUMN view_count INTEGER DEFAULT 0;
        RAISE NOTICE 'Columna view_count agregada a newsletters';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'newsletters' AND column_name = 'published_at') THEN
        ALTER TABLE public.newsletters ADD COLUMN published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Columna published_at agregada a newsletters';
    END IF;
END $$;

-- Índices para newsletters
CREATE INDEX IF NOT EXISTS idx_newsletters_published_at ON public.newsletters(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletters_like_count ON public.newsletters(like_count DESC);
CREATE INDEX IF NOT EXISTS idx_newsletters_autor ON public.newsletters(autor);
CREATE INDEX IF NOT EXISTS idx_newsletters_tags ON public.newsletters USING GIN (tags);

-- ==========================================
-- PASO 3: Crear tabla LIKES
-- ==========================================

CREATE TABLE IF NOT EXISTS public.likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  newsletter_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, newsletter_id)
);

-- Agregar foreign key si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'fk_newsletter_likes') THEN
        ALTER TABLE public.likes 
        ADD CONSTRAINT fk_newsletter_likes
        FOREIGN KEY(newsletter_id) 
        REFERENCES public.newsletters(id)
        ON DELETE CASCADE;
        RAISE NOTICE 'Foreign key agregada a likes';
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_newsletter_id ON public.likes(newsletter_id);

-- ==========================================
-- PASO 4: Crear/Actualizar tabla EMAIL_SUBSCRIPTIONS
-- ==========================================

-- Renombrar tabla antigua si existe
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'suscripciones_newsletter') THEN
        ALTER TABLE IF EXISTS suscripciones_newsletter RENAME TO email_subscriptions;
        RAISE NOTICE 'Tabla suscripciones_newsletter renombrada a email_subscriptions';
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.email_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  preferences JSONB DEFAULT '{"notifications": true, "weekly_digest": true, "new_content": true}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agregar columnas faltantes
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'email_subscriptions' AND column_name = 'preferences') THEN
        ALTER TABLE public.email_subscriptions ADD COLUMN preferences JSONB DEFAULT '{}'::jsonb;
        RAISE NOTICE 'Columna preferences agregada a email_subscriptions';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'email_subscriptions' AND column_name = 'is_active') THEN
        ALTER TABLE public.email_subscriptions ADD COLUMN is_active BOOLEAN DEFAULT true;
        RAISE NOTICE 'Columna is_active agregada a email_subscriptions';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'email_subscriptions' AND column_name = 'subscribed_at') THEN
        ALTER TABLE public.email_subscriptions ADD COLUMN subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Columna subscribed_at agregada a email_subscriptions';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'email_subscriptions' AND column_name = 'updated_at') THEN
        ALTER TABLE public.email_subscriptions ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Columna updated_at agregada a email_subscriptions';
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_email_subscriptions_email ON public.email_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_is_active ON public.email_subscriptions(is_active);

-- ==========================================
-- PASO 5: Crear tabla PUMA_USERS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.puma_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE NOT NULL,
  balance BIGINT DEFAULT 0,
  total_earned BIGINT DEFAULT 0,
  total_spent BIGINT DEFAULT 0,
  level INTEGER DEFAULT 1,
  badges TEXT[] DEFAULT '{}',
  experience_points BIGINT DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_puma_users_user_id ON public.puma_users(user_id);
CREATE INDEX IF NOT EXISTS idx_puma_users_balance ON public.puma_users(balance DESC);

-- ==========================================
-- PASO 6: Crear tabla PUMA_TRANSACTIONS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.puma_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  amount BIGINT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('earn', 'spend', 'transfer', 'reward')),
  reason VARCHAR(500),
  transaction_hash VARCHAR(255),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_puma_transactions_user_id ON public.puma_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_puma_transactions_created_at ON public.puma_transactions(created_at DESC);

-- ==========================================
-- PASO 7: Actualizar tabla CURSOS
-- ==========================================

-- La tabla cursos ya existe, solo agregamos columnas faltantes si es necesario
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cursos') THEN
        -- Agregar columna enlace si no existe
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'cursos' AND column_name = 'enlace') THEN
            ALTER TABLE public.cursos ADD COLUMN enlace VARCHAR(500);
            RAISE NOTICE 'Columna enlace agregada a cursos';
        END IF;
    END IF;
END $$;

-- ==========================================
-- PASO 8: Actualizar tabla EVENTOS
-- ==========================================

-- La tabla eventos ya existe, solo agregamos columnas faltantes si es necesario
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'eventos') THEN
        -- Agregar columna enlace si no existe
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'eventos' AND column_name = 'enlace') THEN
            ALTER TABLE public.eventos ADD COLUMN enlace VARCHAR(500);
            RAISE NOTICE 'Columna enlace agregada a eventos';
        END IF;
    END IF;
END $$;

-- ==========================================
-- PASO 9: FUNCIONES Y TRIGGERS
-- ==========================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at (solo si no existen)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_newsletters_updated_at') THEN
        CREATE TRIGGER update_newsletters_updated_at BEFORE UPDATE ON public.newsletters
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_email_subscriptions_updated_at') THEN
        CREATE TRIGGER update_email_subscriptions_updated_at BEFORE UPDATE ON public.email_subscriptions
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_puma_users_updated_at') THEN
        CREATE TRIGGER update_puma_users_updated_at BEFORE UPDATE ON public.puma_users
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Función para incrementar likes
CREATE OR REPLACE FUNCTION increment_newsletter_likes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.newsletters 
    SET like_count = like_count + 1 
    WHERE id = NEW.newsletter_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Función para decrementar likes
CREATE OR REPLACE FUNCTION decrement_newsletter_likes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.newsletters 
    SET like_count = GREATEST(like_count - 1, 0)
    WHERE id = OLD.newsletter_id;
    RETURN OLD;
END;
$$ language 'plpgsql';

-- Triggers para likes
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_like_added') THEN
        CREATE TRIGGER on_like_added AFTER INSERT ON public.likes
            FOR EACH ROW EXECUTE FUNCTION increment_newsletter_likes();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_like_removed') THEN
        CREATE TRIGGER on_like_removed AFTER DELETE ON public.likes
            FOR EACH ROW EXECUTE FUNCTION decrement_newsletter_likes();
    END IF;
END $$;

-- ==========================================
-- PASO 10: ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Habilitar RLS en tablas nuevas
ALTER TABLE public.newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puma_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puma_transactions ENABLE ROW LEVEL SECURITY;

-- Políticas (solo si no existen)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Newsletters son públicas') THEN
        CREATE POLICY "Newsletters son públicas" ON public.newsletters FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Likes son públicos') THEN
        CREATE POLICY "Likes son públicos" ON public.likes FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Usuarios pueden dar like') THEN
        CREATE POLICY "Usuarios pueden dar like" ON public.likes FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Usuarios pueden quitar like') THEN
        CREATE POLICY "Usuarios pueden quitar like" ON public.likes FOR DELETE USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Usuarios pueden suscribirse') THEN
        CREATE POLICY "Usuarios pueden suscribirse" ON public.email_subscriptions FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- ==========================================
-- PASO 11: INSERTAR DATOS DE EJEMPLO (solo si no hay datos)
-- ==========================================

-- Solo insertar si la tabla está vacía
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.newsletters LIMIT 1) THEN
        INSERT INTO public.newsletters (titulo, contenido, autor, imagen, tags) VALUES
        ('Introducción a Bitcoin: La Revolución del Dinero Digital', 
         '## ¿Qué es Bitcoin?

Bitcoin es una criptomoneda descentralizada creada en 2009. Es la primera criptomoneda y sigue siendo la más valiosa.

## ¿Cómo funciona?

Bitcoin opera en una red peer-to-peer que permite transacciones directas sin intermediarios.

## Ventajas
- Descentralización
- Transparencia
- Seguridad
- Escasez (21 millones máximo)', 
         'Dr. Carlos Méndez',
         'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800',
         ARRAY['bitcoin', 'blockchain', 'criptomonedas']),
         
        ('Ethereum y los Contratos Inteligentes',
         '## Más allá de una criptomoneda

Ethereum es una plataforma para aplicaciones descentralizadas (dApps).

## Contratos Inteligentes
Programas que se ejecutan automáticamente cuando se cumplen condiciones.

## Casos de uso
- DeFi
- NFTs
- DAOs
- Gaming', 
         'Ing. María González',
         'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
         ARRAY['ethereum', 'smart-contracts', 'defi']),
         
        ('DeFi: La Revolución de las Finanzas Descentralizadas',
         '## ¿Qué es DeFi?

DeFi recrea servicios financieros sin intermediarios.

## Componentes
- Préstamos y Créditos
- Exchanges Descentralizados
- Stablecoins
- Yield Farming

## Ventajas
- Accesible para todos
- Transparente
- Sin permisos', 
         'Prof. Juan Ramírez',
         'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800',
         ARRAY['defi', 'finanzas', 'blockchain']);
         
        RAISE NOTICE 'Newsletters de ejemplo insertadas';
    ELSE
        RAISE NOTICE 'Ya existen newsletters, no se insertaron datos de ejemplo';
    END IF;
END $$;

-- ==========================================
-- PASO 12: VERIFICACIÓN FINAL
-- ==========================================

-- Mostrar resumen de todas las tablas
SELECT 
    'newsletters' as tabla,
    COUNT(*) as registros
FROM public.newsletters
UNION ALL
SELECT 'likes', COUNT(*) FROM public.likes
UNION ALL
SELECT 'email_subscriptions', COUNT(*) FROM public.email_subscriptions
UNION ALL
SELECT 'puma_users', COUNT(*) FROM public.puma_users
UNION ALL
SELECT 'puma_transactions', COUNT(*) FROM public.puma_transactions
UNION ALL
SELECT 'cursos', COUNT(*) FROM public.cursos
UNION ALL
SELECT 'eventos', COUNT(*) FROM public.eventos;

-- ==========================================
-- ✅ MIGRACIÓN COMPLETADA
-- ==========================================

DO $$ 
BEGIN
    RAISE NOTICE '✅ Migración completada exitosamente!';
    RAISE NOTICE 'Todas tus tablas existentes están intactas';
    RAISE NOTICE 'Nuevas tablas y columnas agregadas correctamente';
END $$;

