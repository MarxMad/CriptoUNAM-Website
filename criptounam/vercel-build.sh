#!/bin/bash
set -e

echo "🔧 Instalando Git LFS..."
# Verificar si git-lfs está disponible
if ! command -v git-lfs &> /dev/null; then
  echo "⚠️ Git LFS no está instalado, intentando instalar..."
  # Intentar instalar desde el repositorio oficial
  curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | bash || true
  apt-get update || true
  apt-get install -y git-lfs || true
fi

# Inicializar Git LFS
git lfs install || true

echo "📥 Descargando archivos de Git LFS..."
cd /vercel/workpath0 || cd "$(pwd)"
git lfs pull || echo "⚠️ git lfs pull falló, continuando..."

echo "📦 Instalando dependencias..."
cd criptounam || cd "$(pwd)"
npm install

echo "🏗️ Compilando TypeScript y construyendo..."
npm run build

echo "✅ Build completado!"
