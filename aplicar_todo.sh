#!/bin/bash
# Script todo-en-uno: aplica arreglos y actualiza dashboard
cd ~/Documents/garage_ventas
source venv/bin/activate

echo "=== PASO 1: Arreglando consultas del extractor ==="
python3 fix_queries.py

echo ""
echo "=== PASO 2: Regenerando datos ==="
python3 sales_extractor_v2.py 2>&1 | tail -5

echo ""
echo "=== PASO 3: Subiendo a Netlify ==="
/opt/homebrew/bin/npx netlify-cli deploy --prod --dir=.

echo ""
echo "=== LISTO! Abrí el dashboard para verificar ==="
