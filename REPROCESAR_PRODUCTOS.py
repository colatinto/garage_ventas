#!/usr/bin/env python3
"""
Script para reprocesar todos los PDFs y extraer datos de productos
"""
import os
from sales_extractor_v2 import SalesDataExtractor

print("=" * 60)
print("🔄 REPROCESAR PDFs - EXTRAER PRODUCTOS")
print("=" * 60)

# Inicializar extractor
extractor = SalesDataExtractor('config.json')

# Procesar todos los PDFs en temp_pdfs
print("\n📄 Procesando PDFs...")
pdf_dir = 'temp_pdfs'
pdf_files = [f for f in os.listdir(pdf_dir) if f.endswith('.PDF') or f.endswith('.pdf')]

# Contadores
total_processed = 0
total_products = 0
products_by_location = {}

for pdf_file in sorted(pdf_files):
    pdf_path = os.path.join(pdf_dir, pdf_file)

    try:
        # Procesar PDF (extrae ventas Y productos)
        sales_data = extractor.parse_pdf_data(pdf_path)

        if sales_data and sales_data.get('location'):
            location = sales_data['location']
            products = sales_data.get('products', [])

            # Guardar ventas (si no existe)
            extractor.save_sales_data(sales_data)

            # Contar productos por local
            if location not in products_by_location:
                products_by_location[location] = 0
            products_by_location[location] += len(products)
            total_products += len(products)

            total_processed += 1

            if total_processed <= 5 or total_processed % 10 == 0:
                print(f"   ✅ {total_processed}/{len(pdf_files)}: {location} - {len(products)} productos")

    except Exception as e:
        print(f"   ❌ Error: {pdf_file}: {e}")

print(f"\n📊 Resumen:")
print(f"   Total PDFs procesados: {total_processed}")
print(f"   Total productos extraídos: {total_products}")

print(f"\n📍 Productos por local:")
for location, count in sorted(products_by_location.items()):
    print(f"   {location}: {count} productos")

# Verificar resultado en BD
print("\n🔍 Verificando base de datos...")
import sqlite3
import shutil

temp_db = '/sessions/amazing-practical-hypatia/sales_data_temp.db'
shutil.copy('sales_data.db', temp_db)
conn = sqlite3.connect(temp_db)
cursor = conn.cursor()

cursor.execute('SELECT location, COUNT(*) as count FROM products GROUP BY location ORDER BY location')
print("\n📦 Productos en BD por local:")
for row in cursor.fetchall():
    print(f"   {row[0]}: {row[1]} productos")

# Top 5 productos más vendidos globalmente (por cantidad)
cursor.execute('''
    SELECT product_name, SUM(quantity) as total_qty, location
    FROM products
    GROUP BY product_name
    ORDER BY total_qty DESC
    LIMIT 10
''')
print("\n🏆 Top 10 productos más vendidos (global):")
for i, row in enumerate(cursor.fetchall(), 1):
    print(f"   {i}. {row[0][:30]:30} | Cantidad: {row[1]:>6.1f}")

conn.close()

print("\n" + "=" * 60)
print("✅ PROCESO COMPLETADO")
print("=" * 60)
print("\n📊 Próximo paso: actualizar dashboard para visualizar productos")
