#!/bin/bash
# Script ejecutable para macOS - hacer doble clic en Finder

# Cambiar al directorio del script
cd "$(dirname "$0")"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         PRUEBA MANUAL - Sistema de Extracción             ║"
echo "║                   de Ventas 5 Bares                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Verificar que existe el entorno virtual
if [ ! -d "venv" ]; then
    echo "❌ ERROR: No se encontró el entorno virtual (venv)"
    echo "   Ejecuta primero: python3 -m venv venv"
    echo ""
    read -p "Presiona Enter para cerrar..."
    exit 1
fi

# Activar entorno virtual
echo "🔧 Activando entorno virtual..."
source venv/bin/activate

# Verificar que Python esté disponible
if ! command -v python3 &> /dev/null; then
    echo "❌ ERROR: Python 3 no está instalado"
    echo ""
    read -p "Presiona Enter para cerrar..."
    exit 1
fi

echo "✅ Entorno virtual activado"
echo ""

# Ejecutar la prueba
echo "🚀 Ejecutando prueba del sistema..."
echo ""

python3 TEST_MANUAL.py

# Mantener la ventana abierta
echo ""
echo "═══════════════════════════════════════════════════════════"
read -p "Presiona Enter para cerrar esta ventana..."
