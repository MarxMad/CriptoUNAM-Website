#!/bin/bash
# Script de build para Vercel que descarga archivos de Git LFS

# Instalar Git LFS si no está instalado
if ! command -v git-lfs &> /dev/null; then
  echo "Instalando Git LFS..."
  # En Vercel, Git LFS debería estar disponible, pero verificamos
  git lfs version || echo "Git LFS no disponible"
fi

# Descargar archivos LFS
echo "Descargando archivos de Git LFS..."
git lfs pull || echo "No se pudieron descargar archivos LFS (puede ser normal si no hay LFS)"

# Ejecutar build normal
echo "Ejecutando build..."
npm run build

