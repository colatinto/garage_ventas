#!/bin/bash
# Script para actualizar el dashboard web automáticamente

cd "$(dirname "$0")"

echo "🔄 Actualizando dashboard web..."

# Crear carpeta web si no existe
mkdir -p dashboard_web

# Exportar datos actualizados desde la BD
source venv/bin/activate
python3 << 'EOF'
from sales_extractor_v2 import SalesDataExtractor
try:
    extractor = SalesDataExtractor('config.json')
    extractor.export_dashboard_data()
    print("✅ Datos exportados desde BD")
except Exception as e:
    print(f"⚠️  Error exportando datos: {e}")
EOF

# Copiar archivos necesarios
cp dashboard_pro.html dashboard_web/index.html
cp dashboard_data.json dashboard_web/

echo "✅ Archivos actualizados en dashboard_web/"

# Si existe el repositorio git, hacer push automático
if [ -d "dashboard_web/.git" ]; then
    cd dashboard_web
    git add .
    git commit -m "Actualización automática $(date '+%Y-%m-%d %H:%M')" 2>/dev/null

    if git push origin main 2>/dev/null; then
        echo "✅ Dashboard publicado en GitHub Pages"
        echo "   Tus socios verán los cambios en 1-2 minutos"
    else
        echo "⚠️  No se pudo hacer push (verificá la conexión a internet)"
    fi
# Si existe configuración de Netlify, hacer deploy automático
elif [ -f "dashboard_web/.netlify/site-id.txt" ]; then
    cd dashboard_web
    if command -v netlify &> /dev/null; then
        echo "📤 Subiendo a Netlify..."
        if netlify deploy --prod --dir . 2>/dev/null; then
            echo "✅ Dashboard publicado en Netlify"
            echo "   https://snazzy-platypus-56587c.netlify.app/"
            echo "   Tus socios verán los cambios en 1-2 minutos"
        else
            echo "⚠️  Error subiendo a Netlify (verificá la conexión)"
        fi
    else
        echo "⚠️  Netlify CLI no está instalado"
        echo "   Ejecutá: ./SETUP_NETLIFY_AUTO.sh"
    fi
else
    echo ""
    echo "📤 Para configurar actualización automática:"
    echo "   GitHub Pages: ./SETUP_AUTO_GITHUB.sh"
    echo "   Netlify: ./SETUP_NETLIFY_AUTO.sh"
    echo ""
    echo "📤 O subir manualmente a Netlify:"
    echo "   Arrastrá la carpeta dashboard_web/ al sitio de Netlify"
fi

echo ""
echo "✅ Actualización completada - $(date '+%H:%M:%S')"
