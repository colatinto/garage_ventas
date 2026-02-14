#!/bin/bash
# Instalador automático del sistema de actualización del dashboard

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     🤖 INSTALACIÓN DE ACTUALIZACIÓN AUTOMÁTICA             ║"
echo "║     Dashboard se actualizará solo todos los días           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Verificar que estamos en la carpeta correcta
if [ ! -f "sales_extractor_v2.py" ]; then
    echo "❌ Error: Ejecutá este script desde la carpeta garage_ventas"
    exit 1
fi

echo "📋 ¿Qué sistema querés usar para publicar?"
echo ""
echo "1) GitHub Pages (recomendado - gratis, automático)"
echo "2) Netlify (más fácil setup inicial, pero requiere CLI)"
echo "3) Solo preparar archivos (actualizar manualmente)"
echo ""
read -p "Elegí una opción (1, 2 o 3): " opcion

case $opcion in
    1)
        echo ""
        echo "📤 Configurando GitHub Pages..."
        echo ""
        chmod +x SETUP_AUTO_GITHUB.sh
        ./SETUP_AUTO_GITHUB.sh
        ;;
    2)
        echo ""
        echo "📤 Configurando Netlify..."
        echo ""
        echo "Primero necesitás instalar Netlify CLI:"
        echo ""
        echo "1. Abrí Terminal y ejecutá:"
        echo "   npm install -g netlify-cli"
        echo ""
        echo "2. Luego ejecutá:"
        echo "   netlify login"
        echo ""
        echo "3. Y después:"
        echo "   cd ~/Documents/garage_ventas/dashboard_web"
        echo "   netlify deploy --prod"
        echo ""
        read -p "Presioná Enter cuando hayas hecho esto..."
        ;;
    3)
        echo ""
        echo "✅ Solo se prepararán los archivos"
        echo "   Tendrás que subirlos manualmente a tu hosting"
        ;;
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac

echo ""
echo "⏰ Configurando ejecución automática diaria..."

# Hacer ejecutable el script de actualización
chmod +x actualizar_web.sh

# Instalar el launchd agent
PLIST_SOURCE="$(pwd)/com.garage.dashboard.plist"
PLIST_DEST="$HOME/Library/LaunchAgents/com.garage.dashboard.plist"

# Crear directorio si no existe
mkdir -p "$HOME/Library/LaunchAgents"

# Copiar plist
cp "$PLIST_SOURCE" "$PLIST_DEST"

# Cargar el agente
launchctl unload "$PLIST_DEST" 2>/dev/null
launchctl load "$PLIST_DEST"

echo "✅ Automatización instalada!"
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🎉 ¡TODO CONFIGURADO!                                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📅 El dashboard se actualizará automáticamente:"
echo "   • Todos los días a las 4:10 AM"
echo "   • Extrae datos nuevos de los emails"
echo "   • Genera dashboard_data.json actualizado"
if [ "$opcion" = "1" ]; then
    echo "   • Sube automáticamente a GitHub Pages"
    echo ""
    echo "🌐 Link para tus socios:"
    echo "   https://TU-USUARIO.github.io/dashboard/"
elif [ "$opcion" = "2" ]; then
    echo "   • Ejecuta: netlify deploy --prod"
fi
echo ""
echo "🔍 Para verificar:"
echo "   cat ~/Documents/garage_ventas/auto_update.log"
echo ""
echo "🧪 Para probar ahora mismo:"
echo "   ./actualizar_web.sh"
echo ""
echo "❌ Para desinstalar la automatización:"
echo "   launchctl unload ~/Library/LaunchAgents/com.garage.dashboard.plist"
echo "   rm ~/Library/LaunchAgents/com.garage.dashboard.plist"
echo ""
