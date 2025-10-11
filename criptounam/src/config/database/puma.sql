-- Configuración de base de datos para sistema de recompensas $PUMA
-- Tabla de tokens PUMA por usuario
CREATE TABLE IF NOT EXISTS puma_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance DECIMAL(18,8) DEFAULT 0.00000000,
  total_earned DECIMAL(18,8) DEFAULT 0.00000000,
  total_spent DECIMAL(18,8) DEFAULT 0.00000000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Tabla de transacciones PUMA
CREATE TABLE IF NOT EXISTS puma_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(10) NOT NULL CHECK (type IN ('earn', 'spend', 'transfer', 'reward')),
  amount DECIMAL(18,8) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de categorías de recompensas
CREATE TABLE IF NOT EXISTS puma_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  multiplier DECIMAL(3,2) DEFAULT 1.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de recompensas
CREATE TABLE IF NOT EXISTS puma_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(18,8) NOT NULL,
  reason TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'claimed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  claimed_at TIMESTAMP WITH TIME ZONE
);

-- Tabla de misiones
CREATE TABLE IF NOT EXISTS puma_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  reward DECIMAL(18,8) NOT NULL,
  requirements JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  max_completions INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de completación de misiones
CREATE TABLE IF NOT EXISTS puma_mission_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id UUID NOT NULL REFERENCES puma_missions(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reward_claimed DECIMAL(18,8) NOT NULL,
  UNIQUE(user_id, mission_id)
);

-- Tabla de niveles de usuario
CREATE TABLE IF NOT EXISTS puma_user_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  level INTEGER DEFAULT 1,
  experience_points INTEGER DEFAULT 0,
  total_earned DECIMAL(18,8) DEFAULT 0.00000000,
  badges TEXT[],
  achievements JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Tabla de referidos
CREATE TABLE IF NOT EXISTS puma_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_amount DECIMAL(18,8) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(referred_id)
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_puma_tokens_user_id ON puma_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_puma_tokens_balance ON puma_tokens(balance);
CREATE INDEX IF NOT EXISTS idx_puma_transactions_user_id ON puma_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_puma_transactions_type ON puma_transactions(type);
CREATE INDEX IF NOT EXISTS idx_puma_transactions_category ON puma_transactions(category);
CREATE INDEX IF NOT EXISTS idx_puma_transactions_created_at ON puma_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_puma_rewards_user_id ON puma_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_puma_rewards_status ON puma_rewards(status);
CREATE INDEX IF NOT EXISTS idx_puma_rewards_category ON puma_rewards(category);
CREATE INDEX IF NOT EXISTS idx_puma_missions_is_active ON puma_missions(is_active);
CREATE INDEX IF NOT EXISTS idx_puma_mission_completions_user_id ON puma_mission_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_puma_mission_completions_mission_id ON puma_mission_completions(mission_id);
CREATE INDEX IF NOT EXISTS idx_puma_user_levels_user_id ON puma_user_levels(user_id);
CREATE INDEX IF NOT EXISTS idx_puma_user_levels_level ON puma_user_levels(level);
CREATE INDEX IF NOT EXISTS idx_puma_referrals_referrer_id ON puma_referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_puma_referrals_referred_id ON puma_referrals(referred_id);

-- Función para actualizar balance de tokens
CREATE OR REPLACE FUNCTION update_puma_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Actualizar balance del usuario
    INSERT INTO puma_tokens (user_id, balance, total_earned)
    VALUES (NEW.user_id, NEW.amount, NEW.amount)
    ON CONFLICT (user_id)
    DO UPDATE SET 
      balance = puma_tokens.balance + NEW.amount,
      total_earned = puma_tokens.total_earned + NEW.amount,
      updated_at = NOW();
    
    -- Actualizar nivel del usuario si es necesario
    UPDATE puma_user_levels 
    SET 
      experience_points = experience_points + NEW.amount::INTEGER,
      total_earned = total_earned + NEW.amount,
      updated_at = NOW()
    WHERE user_id = NEW.user_id;
    
  ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status AND NEW.status = 'approved' THEN
    -- Aprobar recompensa
    UPDATE puma_tokens 
    SET 
      balance = balance + NEW.amount,
      total_earned = total_earned + NEW.amount,
      updated_at = NOW()
    WHERE user_id = NEW.user_id;
    
  ELSIF TG_OP = 'DELETE' THEN
    -- Revertir transacción
    UPDATE puma_tokens 
    SET 
      balance = GREATEST(0, balance - OLD.amount),
      total_spent = total_spent + OLD.amount,
      updated_at = NOW()
    WHERE user_id = OLD.user_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar balance automáticamente
CREATE TRIGGER trigger_update_puma_balance_insert
  AFTER INSERT ON puma_transactions
  FOR EACH ROW EXECUTE FUNCTION update_puma_balance();

CREATE TRIGGER trigger_update_puma_balance_update
  AFTER UPDATE ON puma_rewards
  FOR EACH ROW EXECUTE FUNCTION update_puma_balance();

-- Función para obtener leaderboard
CREATE OR REPLACE FUNCTION get_puma_leaderboard(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  user_id UUID,
  username TEXT,
  total_earned DECIMAL(18,8),
  rank INTEGER,
  level INTEGER,
  badges TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pt.user_id,
    COALESCE(au.username, 'Usuario') as username,
    pt.total_earned,
    ROW_NUMBER() OVER (ORDER BY pt.total_earned DESC)::INTEGER as rank,
    COALESCE(pul.level, 1) as level,
    COALESCE(pul.badges, ARRAY[]::TEXT[]) as badges
  FROM puma_tokens pt
  LEFT JOIN puma_user_levels pul ON pt.user_id = pul.user_id
  LEFT JOIN auth.users au ON pt.user_id = au.id
  ORDER BY pt.total_earned DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Función para calcular nivel del usuario
CREATE OR REPLACE FUNCTION calculate_user_level(total_earned DECIMAL)
RETURNS INTEGER AS $$
BEGIN
  RETURN GREATEST(1, FLOOR(total_earned / 1000)::INTEGER);
END;
$$ LANGUAGE plpgsql;

-- Insertar categorías por defecto
INSERT INTO puma_categories (name, description, multiplier) VALUES
('like', 'Recompensa por dar like', 1.0),
('newsletter', 'Recompensa por suscribirse al newsletter', 2.0),
('referral', 'Recompensa por referir usuarios', 5.0),
('daily_login', 'Recompensa por login diario', 1.5),
('content_creation', 'Recompensa por crear contenido', 3.0),
('participation', 'Recompensa por participación', 1.2),
('achievement', 'Recompensa por logros', 4.0),
('event', 'Recompensa por asistir a eventos', 2.5)
ON CONFLICT (name) DO NOTHING;
