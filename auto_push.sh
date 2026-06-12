#!/bin/bash
cd /Users/francotosto/Documents/garage_ventas
venv/bin/python3 sales_extractor_v2.py
git add dashboard_data.json dashboard_pro.html sales_extractor_v2.py
git commit -m "auto update" || true
git push || true
