-- Configuración de base de datos para sistema de likes
-- Tabla de likes
CREATE TABLE IF NOT EXISTS newsletter_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  newsletter_id UUID NOT NULL REFERENCES newsletters(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, newsletter_id)
);

-- Tabla de estadísticas de likes
CREATE TABLE IF NOT EXISTS newsletter_like_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  newsletter_id UUID NOT NULL REFERENCES newsletters(id) ON DELETE CASCADE,
  total_likes INTEGER DEFAULT 0,
  unique_users INTEGER DEFAULT 0,
  likes_today INTEGER DEFAULT 0,
  likes_this_week INTEGER DEFAULT 0,
  likes_this_month INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de historial de likes por usuario
CREATE TABLE IF NOT EXISTS user_like_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_likes INTEGER DEFAULT 0,
  likes_this_week INTEGER DEFAULT 0,
  likes_this_month INTEGER DEFAULT 0,
  favorite_categories TEXT[],
  last_like_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de analytics de likes
CREATE TABLE IF NOT EXISTS like_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  newsletter_id UUID NOT NULL REFERENCES newsletters(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action VARCHAR(10) NOT NULL CHECK (action IN ('like', 'unlike')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  ip_address INET
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_newsletter_likes_user_id ON newsletter_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_likes_newsletter_id ON newsletter_likes(newsletter_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_likes_created_at ON newsletter_likes(created_at);
CREATE INDEX IF NOT EXISTS idx_like_stats_newsletter_id ON newsletter_like_stats(newsletter_id);
CREATE INDEX IF NOT EXISTS idx_like_stats_total_likes ON newsletter_like_stats(total_likes);
CREATE INDEX IF NOT EXISTS idx_user_like_history_user_id ON user_like_history(user_id);
CREATE INDEX IF NOT EXISTS idx_like_analytics_newsletter_id ON like_analytics(newsletter_id);
CREATE INDEX IF NOT EXISTS idx_like_analytics_user_id ON like_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_like_analytics_timestamp ON like_analytics(timestamp);

-- Función para actualizar estadísticas de likes
CREATE OR REPLACE FUNCTION update_newsletter_like_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO newsletter_like_stats (newsletter_id, total_likes, unique_users)
    VALUES (NEW.newsletter_id, 1, 1)
    ON CONFLICT (newsletter_id) 
    DO UPDATE SET 
      total_likes = newsletter_like_stats.total_likes + 1,
      unique_users = newsletter_like_stats.unique_users + 1,
      last_updated = NOW();
    
    -- Actualizar historial del usuario
    INSERT INTO user_like_history (user_id, total_likes, likes_this_week, likes_this_month, last_like_at)
    VALUES (NEW.user_id, 1, 1, 1, NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET 
      total_likes = user_like_history.total_likes + 1,
      likes_this_week = user_like_history.likes_this_week + 1,
      likes_this_month = user_like_history.likes_this_month + 1,
      last_like_at = NOW(),
      updated_at = NOW();
    
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE newsletter_like_stats 
    SET 
      total_likes = GREATEST(0, total_likes - 1),
      last_updated = NOW()
    WHERE newsletter_id = OLD.newsletter_id;
    
    -- Actualizar historial del usuario
    UPDATE user_like_history 
    SET 
      total_likes = GREATEST(0, total_likes - 1),
      likes_this_week = GREATEST(0, likes_this_week - 1),
      likes_this_month = GREATEST(0, likes_this_month - 1),
      updated_at = NOW()
    WHERE user_id = OLD.user_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar estadísticas automáticamente
CREATE TRIGGER trigger_update_like_stats_insert
  AFTER INSERT ON newsletter_likes
  FOR EACH ROW EXECUTE FUNCTION update_newsletter_like_stats();

CREATE TRIGGER trigger_update_like_stats_delete
  AFTER DELETE ON newsletter_likes
  FOR EACH ROW EXECUTE FUNCTION update_newsletter_like_stats();

-- Función para obtener newsletters trending
CREATE OR REPLACE FUNCTION get_trending_newsletters(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  title TEXT,
  author TEXT,
  likes INTEGER,
  views INTEGER,
  published_at TIMESTAMP WITH TIME ZONE,
  category TEXT,
  trending_score DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    n.id,
    n.title,
    n.author,
    COALESCE(ls.total_likes, 0) as likes,
    COALESCE(n.views, 0) as views,
    n.published_at,
    n.category,
    (COALESCE(ls.total_likes, 0) * 0.7 + COALESCE(n.views, 0) * 0.3) as trending_score
  FROM newsletters n
  LEFT JOIN newsletter_like_stats ls ON n.id = ls.newsletter_id
  WHERE n.published_at >= NOW() - INTERVAL '7 days'
  ORDER BY trending_score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
