#!/bin/bash
# Script para abrir el dashboard con un servidor web local

cd "$(dirname "$0")"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║            DASHBOARD DE VENTAS - SERVIDOR LOCAL           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "🚀 Iniciando servidor web local en el puerto 8000..."
echo ""
echo "📊 Abrí tu navegador en:"
echo "   http://localhost:8000/live_dashboard_v2.html"
echo ""
echo "💡 O presiona Cmd+clic en el link de arriba"
echo ""
echo "⚠️  Para detener el servidor: presiona Ctrl+C"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""

# Abrir automáticamente el navegador
sleep 2
open http://localhost:8000/live_dashboard_v2.html 2>/dev/null &

# Iniciar servidor web simple con Python
python3 -m http.server 8000
