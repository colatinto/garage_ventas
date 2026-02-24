#!/usr/bin/env python3
"""
Script para aplicar todos los arreglos pendientes en sales_extractor_v2.py:
1. Cambiar export de -30 dias a todo desde 2026-01-01
2. Cambiar consultas de -7 dias a todo desde 2026-01-01
"""
import re

filepath = 'sales_extractor_v2.py'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

original = content

# Fix 1: Export dashboard - cambiar -30 days por desde 2026-01-01
content = content.replace(
    "WHERE date >= date('now', '-30 days')",
    "WHERE date >= '2026-01-01'"
)

# Fix 2: Otras consultas - cambiar -7 days por desde 2026-01-01
content = content.replace(
    "WHERE date >= date('now', '-7 days')",
    "WHERE date >= '2026-01-01'"
)

if content != original:
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    changes = 0
    changes += original.count("date('now', '-30 days')") 
    changes += original.count("date('now', '-7 days')")
    print(f"OK - {changes} consultas corregidas en {filepath}")
else:
    print("No se encontraron consultas para corregir (ya estaban arregladas)")
