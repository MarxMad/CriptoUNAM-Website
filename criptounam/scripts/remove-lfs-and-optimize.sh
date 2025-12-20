#!/bin/bash

# Script para remover imágenes de Git LFS y optimizarlas
# Esto permite usar Git normal en lugar de LFS

echo "🔄 Removiendo imágenes de Git LFS y optimizándolas..."
echo ""

cd "$(dirname "$0")/.." || exit 1

# 1. Primero, asegurarse de que los archivos LFS estén descargados
echo "📥 Descargando archivos LFS..."
git lfs pull || echo "⚠️ No se pudieron descargar algunos archivos LFS"

# 2. Optimizar imágenes JPG existentes (reducir calidad a 85% si son muy grandes)
echo ""
echo "🖼️ Optimizando imágenes JPG..."
find public/images -type f \( -iname "*.jpg" -o -iname "*.JPG" \) | while read -r img; do
    size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
    # Si la imagen es mayor a 500KB, optimizarla
    if [ "$size" -gt 512000 ]; then
        echo "   Optimizando: $(basename "$img") ($(numfmt --to=iec-i --suffix=B "$size" 2>/dev/null || echo "${size} bytes"))"
        # Usar sips en macOS para optimizar
        if command -v sips &> /dev/null; then
            sips -s format jpeg -s formatOptions 85 "$img" --out "$img.tmp" 2>/dev/null && mv "$img.tmp" "$img"
        fi
    fi
done

# 3. Remover archivos de Git LFS tracking
echo ""
echo "🗑️ Removiendo archivos de Git LFS..."
git lfs untrack "*.jpg" 2>/dev/null || true
git lfs untrack "*.JPG" 2>/dev/null || true
git lfs untrack "*.png" 2>/dev/null || true
git lfs untrack "*.PNG" 2>/dev/null || true
git lfs untrack "*.jpeg" 2>/dev/null || true
git lfs untrack "*.JPEG" 2>/dev/null || true

# 4. Actualizar .gitattributes para NO usar LFS en imágenes
echo ""
echo "📝 Actualizando .gitattributes..."
cat > .gitattributes << 'EOF'
# Remover LFS de imágenes - usar Git normal
# *.jpg filter=lfs diff=lfs merge=lfs -text
# *.JPG filter=lfs diff=lfs merge=lfs -text
# *.png filter=lfs diff=lfs merge=lfs -text
# *.PNG filter=lfs diff=lfs merge=lfs -text

# Mantener LFS solo para archivos muy grandes (HEIC, MOV)
*.HEIC filter=lfs diff=lfs merge=lfs -text
*.heic filter=lfs diff=lfs merge=lfs -text
*.HEIF filter=lfs diff=lfs merge=lfs -text
*.heif filter=lfs diff=lfs merge=lfs -text
*.MOV filter=lfs diff=lfs merge=lfs -text
*.mov filter=lfs diff=lfs merge=lfs -text
EOF

echo ""
echo "✅ Proceso completado!"
echo ""
echo "📋 Próximos pasos:"
echo "   1. git add .gitattributes"
echo "   2. git add public/images/"
echo "   3. git commit -m 'Remove images from Git LFS, use normal Git'"
echo "   4. git push"
echo ""
echo "⚠️  Nota: El primer push puede tardar si hay muchas imágenes,"
echo "   pero después será más rápido y funcionará en Vercel sin problemas."

