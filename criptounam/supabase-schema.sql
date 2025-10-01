-- =============================================
-- SCHEMA DE BASE DE DATOS PARA CRIPTOUNAM
-- =============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLA DE EVENTOS
-- =============================================
-- Eliminar tabla si existe para recrearla
DROP TABLE IF EXISTS eventos CASCADE;

CREATE TABLE eventos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('proximo', 'anterior')),
    titulo VARCHAR(255) NOT NULL,
    fecha VARCHAR(100) NOT NULL,
    hora VARCHAR(20),
    lugar VARCHAR(255) NOT NULL,
    cupo INTEGER NOT NULL CHECK (cupo > 0),
    descripcion TEXT,
    imagen TEXT, -- URL de imagen principal para eventos próximos
    imagenPrincipal TEXT, -- URL de imagen principal para eventos pasados
    fotos TEXT[], -- Array de URLs de fotos
    videos TEXT[], -- Array de URLs de videos
    presentaciones TEXT[], -- Array de URLs de presentaciones
    registroLink TEXT, -- Link de registro para eventos
    creadoEn TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizadoEn TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para eventos
CREATE INDEX idx_eventos_tipo ON eventos(tipo);
CREATE INDEX idx_eventos_fecha ON eventos(fecha);
CREATE INDEX idx_eventos_creadoEn ON eventos(creadoEn);

-- =============================================
-- TABLA DE CURSOS
-- =============================================
CREATE TABLE cursos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    duracion VARCHAR(100) NOT NULL,
    nivel VARCHAR(50) NOT NULL,
    instructor VARCHAR(255) NOT NULL,
    imagen TEXT NOT NULL, -- URL de imagen del curso
    precio DECIMAL(10,2) DEFAULT 0,
    fechaInicio DATE NOT NULL,
    fechaFin DATE NOT NULL,
    cupo INTEGER NOT NULL CHECK (cupo > 0),
    creadoEn TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizadoEn TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para cursos
CREATE INDEX idx_cursos_fechaInicio ON cursos(fechaInicio);
CREATE INDEX idx_cursos_nivel ON cursos(nivel);
CREATE INDEX idx_cursos_creadoEn ON cursos(creadoEn);

-- =============================================
-- TABLA DE NEWSLETTER
-- =============================================
CREATE TABLE newsletter (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    autor VARCHAR(255) NOT NULL,
    fecha DATE NOT NULL,
    imagen TEXT, -- URL de imagen del artículo
    tags TEXT[], -- Array de tags
    creadoEn TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizadoEn TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para newsletter
CREATE INDEX idx_newsletter_fecha ON newsletter(fecha);
CREATE INDEX idx_newsletter_autor ON newsletter(autor);
CREATE INDEX idx_newsletter_creadoEn ON newsletter(creadoEn);

-- =============================================
-- TABLA DE SUSCRIPCIONES NEWSLETTER
-- =============================================
CREATE TABLE suscripciones_newsletter (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    fuente VARCHAR(50) DEFAULT 'home', -- 'home' o 'newsletter'
    activo BOOLEAN DEFAULT true,
    creadoEn TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para suscripciones
CREATE INDEX idx_suscripciones_email ON suscripciones_newsletter(email);
CREATE INDEX idx_suscripciones_activo ON suscripciones_newsletter(activo);

-- =============================================
-- TABLA DE REGISTROS DE COMUNIDAD
-- =============================================
CREATE TABLE registros_comunidad (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    carrera VARCHAR(255) NOT NULL,
    plantel VARCHAR(255) NOT NULL,
    numeroCuenta VARCHAR(50) NOT NULL,
    edad INTEGER NOT NULL,
    motivacion TEXT NOT NULL,
    twitter VARCHAR(255),
    instagram VARCHAR(255),
    linkedin VARCHAR(255),
    facebook VARCHAR(255),
    telegram VARCHAR(255),
    creadoEn TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para registros
CREATE INDEX idx_registros_creadoEn ON registros_comunidad(creadoEn);
CREATE INDEX idx_registros_plantel ON registros_comunidad(plantel);

-- =============================================
-- TABLA DE WALLETS CONECTADAS
-- =============================================
CREATE TABLE wallets_conectadas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    address VARCHAR(42) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    conectadoEn TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para wallets
CREATE INDEX idx_wallets_address ON wallets_conectadas(address);
CREATE INDEX idx_wallets_conectadoEn ON wallets_conectadas(conectadoEn);

-- =============================================
-- FUNCIONES DE ACTUALIZACIÓN AUTOMÁTICA
-- =============================================

-- Función para actualizar updatedAt automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizadoEn = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updatedAt
CREATE TRIGGER update_eventos_updated_at 
    BEFORE UPDATE ON eventos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cursos_updated_at 
    BEFORE UPDATE ON cursos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_updated_at 
    BEFORE UPDATE ON newsletter 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- POLÍTICAS RLS (Row Level Security)
-- =============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;
ALTER TABLE suscripciones_newsletter ENABLE ROW LEVEL SECURITY;
ALTER TABLE registros_comunidad ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets_conectadas ENABLE ROW LEVEL SECURITY;

-- Políticas para lectura pública (todos pueden leer)
CREATE POLICY "Permitir lectura pública de eventos" ON eventos FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública de cursos" ON cursos FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública de newsletter" ON newsletter FOR SELECT USING (true);

-- Políticas para escritura (solo usuarios autenticados pueden escribir)
CREATE POLICY "Permitir inserción de eventos" ON eventos FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualización de eventos" ON eventos FOR UPDATE USING (true);
CREATE POLICY "Permitir eliminación de eventos" ON eventos FOR DELETE USING (true);

CREATE POLICY "Permitir inserción de cursos" ON cursos FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualización de cursos" ON cursos FOR UPDATE USING (true);
CREATE POLICY "Permitir eliminación de cursos" ON cursos FOR DELETE USING (true);

CREATE POLICY "Permitir inserción de newsletter" ON newsletter FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualización de newsletter" ON newsletter FOR UPDATE USING (true);
CREATE POLICY "Permitir eliminación de newsletter" ON newsletter FOR DELETE USING (true);

-- Políticas para suscripciones (cualquiera puede suscribirse)
CREATE POLICY "Permitir suscripción newsletter" ON suscripciones_newsletter FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir lectura suscripciones" ON suscripciones_newsletter FOR SELECT USING (true);

-- Políticas para registros de comunidad (cualquiera puede registrarse)
CREATE POLICY "Permitir registro comunidad" ON registros_comunidad FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir lectura registros" ON registros_comunidad FOR SELECT USING (true);

-- Políticas para wallets (cualquiera puede registrar wallet)
CREATE POLICY "Permitir registro wallet" ON wallets_conectadas FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir lectura wallets" ON wallets_conectadas FOR SELECT USING (true);

-- =============================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- =============================================

-- Insertar algunos eventos de ejemplo
INSERT INTO eventos (tipo, titulo, fecha, hora, lugar, cupo, descripcion, registroLink) VALUES
('proximo', 'Workshop de Blockchain', '15 de Diciembre, 2024', '16:00', 'Facultad de Ingeniería', 50, 'Aprende los fundamentos de blockchain y criptomonedas', 'https://forms.gle/ejemplo'),
('anterior', 'Hackathon Web3', 'Noviembre 2024', NULL, 'Centro de Innovación', 100, 'Competencia de desarrollo de aplicaciones Web3', NULL);

-- Insertar algunos cursos de ejemplo
INSERT INTO cursos (titulo, descripcion, duracion, nivel, instructor, imagen, precio, fechaInicio, fechaFin, cupo) VALUES
('Introducción a Solidity', 'Aprende a programar smart contracts', '8 semanas', 'Principiante', 'Dr. Juan Pérez', 'https://ejemplo.com/imagen1.jpg', 0, '2024-01-15', '2024-03-15', 30),
('DeFi Avanzado', 'Protocolos de finanzas descentralizadas', '12 semanas', 'Intermedio', 'Dra. María García', 'https://ejemplo.com/imagen2.jpg', 0, '2024-02-01', '2024-04-30', 25);

-- Insertar algunos artículos de newsletter de ejemplo
INSERT INTO newsletter (titulo, contenido, autor, fecha, imagen, tags) VALUES
('El futuro de las criptomonedas', 'Análisis del mercado y tendencias futuras...', 'Equipo CriptoUNAM', '2024-01-01', 'https://ejemplo.com/newsletter1.jpg', ARRAY['criptomonedas', 'análisis', 'tendencias']),
('Guía de seguridad en Web3', 'Mejores prácticas para mantener tus activos seguros...', 'Equipo CriptoUNAM', '2024-01-15', 'https://ejemplo.com/newsletter2.jpg', ARRAY['seguridad', 'web3', 'guía']);
