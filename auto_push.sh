#!/bin/bash
cd /Users/francotosto/Documents/garage_ventas || { echo "ERROR: sin acceso a la carpeta del proyecto (¿permiso Full Disk Access de cron?)"; exit 1; }

# Cargar token de GitHub desde .env.local
if [ -f .env.local ]; then
    export $(cat .env.local | xargs)
fi

# Ejecutar extracción de ventas
venv/bin/python3 sales_extractor_v2.py || echo "ERROR: fallo el extractor"

# Agregar cambios y hacer commit
git add dashboard_data.json
git commit -m "auto update" || true

# Push (dejar errores visibles en el log)
if [ -n "$GITHUB_TOKEN" ]; then
    git push "https://colatinto:${GITHUB_TOKEN}@github.com/colatinto/garage_ventas.git" main || echo "ERROR: fallo el push (token)"
else
    git push || echo "ERROR: fallo el push"
fi
