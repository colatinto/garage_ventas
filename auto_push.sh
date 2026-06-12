#!/bin/bash
cd /Users/francotosto/Documents/garage_ventas

# Cargar token de GitHub desde .env.local
if [ -f .env.local ]; then
    export $(cat .env.local | xargs)
fi

# Ejecutar extracción de ventas
venv/bin/python3 sales_extractor_v2.py

# Agregar cambios y hacer commit
git add dashboard_data.json dashboard_pro.html sales_extractor_v2.py
git commit -m "auto update" || true

# Push automático con token
if [ -n "$GITHUB_TOKEN" ]; then
    git push https://colatinto:${GITHUB_TOKEN}@github.com/colatinto/garage_ventas.git main 2>/dev/null || true
else
    git push || true
fi
