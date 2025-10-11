-- ==========================================
-- CriptoUNAM Database Schema
-- ==========================================
-- Este archivo contiene el esquema completo de la base de datos
-- Ejecutar en Supabase SQL Editor

-- ==========================================
-- 1. TABLA DE NEWSLETTERS
-- ==========================================

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

-- Índices para newsletters
CREATE INDEX IF NOT EXISTS idx_newsletters_published_at ON public.newsletters(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletters_like_count ON public.newsletters(like_count DESC);
CREATE INDEX IF NOT EXISTS idx_newsletters_autor ON public.newsletters(autor);
CREATE INDEX IF NOT EXISTS idx_newsletters_tags ON public.newsletters USING GIN (tags);

COMMENT ON TABLE public.newsletters IS 'Tabla de artículos del newsletter';
COMMENT ON COLUMN public.newsletters.like_count IS 'Contador de likes del artículo';
COMMENT ON COLUMN public.newsletters.view_count IS 'Contador de vistas del artículo';

-- ==========================================
-- 2. TABLA DE LIKES
-- ==========================================

CREATE TABLE IF NOT EXISTS public.likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  newsletter_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, newsletter_id),
  CONSTRAINT fk_newsletter
    FOREIGN KEY(newsletter_id) 
    REFERENCES public.newsletters(id)
    ON DELETE CASCADE
);

-- Índices para likes
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_newsletter_id ON public.likes(newsletter_id);
CREATE INDEX IF NOT EXISTS idx_likes_created_at ON public.likes(created_at DESC);

COMMENT ON TABLE public.likes IS 'Tabla de likes dados por usuarios a newsletters';
COMMENT ON COLUMN public.likes.user_id IS 'ID del usuario (wallet address)';

-- ==========================================
-- 3. TABLA DE SUSCRIPCIONES DE EMAIL
-- ==========================================

CREATE TABLE IF NOT EXISTS public.email_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  preferences JSONB DEFAULT '{"notifications": true, "weekly_digest": true, "new_content": true}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  verification_token VARCHAR(255),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para email_subscriptions
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_email ON public.email_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_is_active ON public.email_subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_subscribed_at ON public.email_subscriptions(subscribed_at DESC);

COMMENT ON TABLE public.email_subscriptions IS 'Tabla de suscripciones al newsletter por email';
COMMENT ON COLUMN public.email_subscriptions.preferences IS 'Preferencias de notificación del usuario';

-- ==========================================
-- 4. TABLA DE USUARIOS PUMA
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

-- Índices para puma_users
CREATE INDEX IF NOT EXISTS idx_puma_users_user_id ON public.puma_users(user_id);
CREATE INDEX IF NOT EXISTS idx_puma_users_balance ON public.puma_users(balance DESC);
CREATE INDEX IF NOT EXISTS idx_puma_users_level ON public.puma_users(level DESC);
CREATE INDEX IF NOT EXISTS idx_puma_users_experience ON public.puma_users(experience_points DESC);

COMMENT ON TABLE public.puma_users IS 'Tabla de usuarios y sus recompensas en tokens PUMA';
COMMENT ON COLUMN public.puma_users.user_id IS 'Wallet address del usuario';
COMMENT ON COLUMN public.puma_users.balance IS 'Balance actual en tokens PUMA (wei)';
COMMENT ON COLUMN public.puma_users.badges IS 'Array de badges obtenidos';

-- ==========================================
-- 5. TABLA DE TRANSACCIONES PUMA
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

-- Índices para puma_transactions
CREATE INDEX IF NOT EXISTS idx_puma_transactions_user_id ON public.puma_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_puma_transactions_type ON public.puma_transactions(type);
CREATE INDEX IF NOT EXISTS idx_puma_transactions_created_at ON public.puma_transactions(created_at DESC);

COMMENT ON TABLE public.puma_transactions IS 'Historial de transacciones de tokens PUMA';
COMMENT ON COLUMN public.puma_transactions.type IS 'Tipo de transacción: earn, spend, transfer, reward';

-- ==========================================
-- 6. TABLA DE CURSOS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.cursos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR(500) NOT NULL,
  descripcion TEXT NOT NULL,
  nivel VARCHAR(50) NOT NULL CHECK (nivel IN ('Principiante', 'Intermedio', 'Avanzado')),
  instructor VARCHAR(255),
  imagen VARCHAR(500),
  enlace VARCHAR(500),
  precio DECIMAL(10, 2) DEFAULT 0,
  fecha_inicio TIMESTAMP WITH TIME ZONE,
  fecha_fin TIMESTAMP WITH TIME ZONE,
  cupo INTEGER,
  inscritos INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para cursos
CREATE INDEX IF NOT EXISTS idx_cursos_nivel ON public.cursos(nivel);
CREATE INDEX IF NOT EXISTS idx_cursos_fecha_inicio ON public.cursos(fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_cursos_created_at ON public.cursos(created_at DESC);

COMMENT ON TABLE public.cursos IS 'Tabla de cursos ofrecidos por CriptoUNAM';

-- ==========================================
-- 7. TABLA DE EVENTOS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.eventos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR(500) NOT NULL,
  descripcion TEXT NOT NULL,
  fecha TIMESTAMP WITH TIME ZONE NOT NULL,
  hora VARCHAR(50),
  ubicacion VARCHAR(500),
  tipo VARCHAR(50) CHECK (tipo IN ('proximo', 'anterior')),
  cupo INTEGER,
  registrados INTEGER DEFAULT 0,
  registro_link VARCHAR(500),
  imagen_principal VARCHAR(500),
  fotos TEXT[] DEFAULT '{}',
  videos TEXT[] DEFAULT '{}',
  presentaciones TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para eventos
CREATE INDEX IF NOT EXISTS idx_eventos_fecha ON public.eventos(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_eventos_tipo ON public.eventos(tipo);
CREATE INDEX IF NOT EXISTS idx_eventos_created_at ON public.eventos(created_at DESC);

COMMENT ON TABLE public.eventos IS 'Tabla de eventos de CriptoUNAM';
COMMENT ON COLUMN public.eventos.tipo IS 'Tipo de evento: proximo o anterior';

-- ==========================================
-- 8. FUNCIONES Y TRIGGERS
-- ==========================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_newsletters_updated_at BEFORE UPDATE ON public.newsletters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_subscriptions_updated_at BEFORE UPDATE ON public.email_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_puma_users_updated_at BEFORE UPDATE ON public.puma_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cursos_updated_at BEFORE UPDATE ON public.cursos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_eventos_updated_at BEFORE UPDATE ON public.eventos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para incrementar like_count cuando se agrega un like
CREATE OR REPLACE FUNCTION increment_newsletter_likes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.newsletters 
    SET like_count = like_count + 1 
    WHERE id = NEW.newsletter_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Función para decrementar like_count cuando se elimina un like
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
CREATE TRIGGER on_like_added AFTER INSERT ON public.likes
    FOR EACH ROW EXECUTE FUNCTION increment_newsletter_likes();

CREATE TRIGGER on_like_removed AFTER DELETE ON public.likes
    FOR EACH ROW EXECUTE FUNCTION decrement_newsletter_likes();

-- ==========================================
-- 9. DATOS DE EJEMPLO
-- ==========================================

-- Insertar newsletters de ejemplo
INSERT INTO public.newsletters (titulo, contenido, autor, imagen, tags) VALUES
('Introducción a Bitcoin: La Revolución del Dinero Digital', 
 '## ¿Qué es Bitcoin?

Bitcoin es una criptomoneda descentralizada que fue creada en 2009 por una persona o grupo de personas bajo el seudónimo de Satoshi Nakamoto. Es la primera criptomoneda y sigue siendo la más valiosa y ampliamente reconocida.

## ¿Cómo funciona?

Bitcoin opera en una red peer-to-peer que permite realizar transacciones directamente sin necesidad de intermediarios como bancos. Cada transacción se registra en un libro de contabilidad público llamado blockchain.

## Ventajas de Bitcoin

- **Descentralización**: No está controlado por ningún gobierno o institución
- **Transparencia**: Todas las transacciones son públicas y verificables
- **Seguridad**: Utiliza criptografía avanzada
- **Escasez**: Solo existirán 21 millones de bitcoins

## El futuro de Bitcoin

Bitcoin ha demostrado ser una reserva de valor sólida y continúa ganando adopción tanto de individuos como de instituciones. Su papel en el futuro del sistema financiero global sigue siendo un tema de debate apasionante.', 
 'Dr. Carlos Méndez',
 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800',
 ARRAY['bitcoin', 'blockchain', 'criptomonedas', 'finanzas']),
 
('Ethereum y los Contratos Inteligentes: Construyendo el Futuro Descentralizado',
 '## Más allá de una criptomoneda

Ethereum no es solo una criptomoneda, es una plataforma completa para aplicaciones descentralizadas (dApps). Creada por Vitalik Buterin en 2015, Ethereum introdujo el concepto de contratos inteligentes al mundo.

## ¿Qué son los contratos inteligentes?

Los contratos inteligentes son programas que se ejecutan automáticamente cuando se cumplen ciertas condiciones predefinidas. Están escritos en código y se almacenan en la blockchain de Ethereum.

### Características principales:

1. **Autonomía**: Se ejecutan automáticamente sin intervención humana
2. **Inmutabilidad**: Una vez desplegados, no pueden ser modificados
3. **Transparencia**: El código es público y verificable
4. **Confiabilidad**: Se ejecutan exactamente como fueron programados

## Casos de uso

- **DeFi**: Finanzas descentralizadas
- **NFTs**: Tokens no fungibles
- **DAOs**: Organizaciones autónomas descentralizadas
- **Gaming**: Juegos blockchain
- **Identidad digital**: Sistemas de identidad verificables

## El ecosistema Ethereum

Ethereum cuenta con el ecosistema de desarrolladores más grande en el espacio blockchain, con miles de aplicaciones construidas sobre su plataforma.', 
 'Ing. María González',
 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
 ARRAY['ethereum', 'smart-contracts', 'defi', 'blockchain', 'web3']),
 
('DeFi: La Revolución de las Finanzas Descentralizadas',
 '## ¿Qué es DeFi?

DeFi (Decentralized Finance) se refiere a un ecosistema de aplicaciones financieras construidas sobre redes blockchain, principalmente Ethereum. Estas aplicaciones buscan recrear y mejorar los servicios financieros tradicionales sin intermediarios.

## Componentes principales de DeFi

### 1. Préstamos y Créditos
Plataformas como Aave y Compound permiten a los usuarios prestar y pedir prestado criptomonedas sin necesidad de un banco.

### 2. Exchanges Descentralizados (DEX)
Uniswap y SushiSwap permiten intercambiar tokens directamente entre usuarios.

### 3. Stablecoins
Monedas estables como DAI y USDC mantienen su valor vinculado al dólar.

### 4. Yield Farming
Los usuarios pueden ganar recompensas por proporcionar liquidez a protocolos DeFi.

## Ventajas de DeFi

- **Accesibilidad**: Cualquier persona con conexión a internet puede participar
- **Transparencia**: Todo el código es open-source y auditable
- **Sin permisos**: No se necesita aprobación de ninguna institución
- **Composabilidad**: Los protocolos pueden integrarse entre sí

## Riesgos a considerar

- Bugs en los smart contracts
- Volatilidad de los activos
- Riesgos de liquidez
- Complejidad técnica

## El futuro de DeFi

DeFi está democratizando el acceso a servicios financieros y ha alcanzado más de $100 mil millones en valor total bloqueado (TVL). Se espera que continúe creciendo y evolucionando en los próximos años.', 
 'Prof. Juan Ramírez',
 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800',
 ARRAY['defi', 'finanzas', 'blockchain', 'ethereum', 'dex', 'yield-farming'])
ON CONFLICT DO NOTHING;

-- Insertar cursos de ejemplo
INSERT INTO public.cursos (titulo, descripcion, nivel, instructor, imagen, enlace, precio, cupo) VALUES
('Fundamentos de Blockchain', 
 'Aprende los conceptos básicos de la tecnología blockchain, criptomonedas y su impacto en el mundo.',
 'Principiante',
 'Dr. Carlos Méndez',
 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400',
 'https://criptounam.xyz/cursos/fundamentos-blockchain',
 0,
 50),
 
('Desarrollo de Smart Contracts con Solidity',
 'Domina el lenguaje Solidity y aprende a crear contratos inteligentes seguros y eficientes.',
 'Intermedio',
 'Ing. María González',
 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400',
 'https://criptounam.xyz/cursos/solidity',
 99.99,
 30),
 
('DeFi Avanzado: Construcción de Protocolos',
 'Construye protocolos DeFi desde cero y entiende la arquitectura de las finanzas descentralizadas.',
 'Avanzado',
 'Prof. Juan Ramírez',
 'https://images.unsplash.com/photo-1642790551116-18e150f248e8?w=400',
 'https://criptounam.xyz/cursos/defi-avanzado',
 199.99,
 20)
ON CONFLICT DO NOTHING;

-- ==========================================
-- 10. ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puma_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puma_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública (todos pueden leer)
CREATE POLICY "Newsletters son públicas" ON public.newsletters FOR SELECT USING (true);
CREATE POLICY "Likes son públicos" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Cursos son públicos" ON public.cursos FOR SELECT USING (true);
CREATE POLICY "Eventos son públicos" ON public.eventos FOR SELECT USING (true);

-- Políticas de escritura (solo autenticados pueden escribir)
CREATE POLICY "Usuarios pueden dar like" ON public.likes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuarios pueden quitar like" ON public.likes FOR DELETE USING (auth.uid()::text = user_id);
CREATE POLICY "Usuarios pueden suscribirse" ON public.email_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Usuarios pueden ver su perfil PUMA" ON public.puma_users FOR SELECT USING (true);

-- ==========================================
-- 11. VERIFICACIÓN
-- ==========================================

-- Verificar que todas las tablas fueron creadas
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- ==========================================
-- SCRIPT COMPLETADO
-- ==========================================

-- Para verificar que todo se creó correctamente, ejecuta:
-- SELECT * FROM public.newsletters;
-- SELECT * FROM public.cursos;
-- SELECT * FROM public.eventos;

