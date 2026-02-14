#!/usr/bin/env python3
"""
Script para reprocesar PDFs y corregir el problema de GROWLER VIA VIEJA
"""
import os
import sqlite3
from sales_extractor_v2 import SalesDataExtractor

print("=" * 60)
print("🔄 REPROCESAR PDFs - CORREGIR VIA VIEJA")
print("=" * 60)

# Inicializar extractor
extractor = SalesDataExtractor('config.json')

# Procesar todos los PDFs en temp_pdfs
print("\n📄 Procesando PDFs...")
pdf_dir = 'temp_pdfs'
pdf_files = [f for f in os.listdir(pdf_dir) if f.endswith('.PDF') or f.endswith('.pdf')]

# Contadores
vv_count = 0
total_processed = 0

for pdf_file in sorted(pdf_files):
    pdf_path = os.path.join(pdf_dir, pdf_file)

    try:
        # Procesar PDF
        sales_data = extractor.parse_pdf_data(pdf_path)

        if sales_data and sales_data.get('location'):
            location = sales_data['location']

            # Contar Via Vieja
            if location == 'GROWLER VIA VIEJA':
                vv_count += 1
                if vv_count <= 3:  # Mostrar solo los primeros 3
                    print(f"   ✅ Via Vieja encontrado: {sales_data['date']}")

            # Guardar/actualizar en BD
            extractor.save_sales_data(sales_data)
            total_processed += 1

    except Exception as e:
        print(f"   ❌ Error: {pdf_file}: {e}")

print(f"\n📊 Resumen:")
print(f"   Total PDFs procesados: {total_processed}")
print(f"   PDFs de Via Vieja: {vv_count}")

# Verificar resultado en BD
print("\n🔍 Verificando base de datos...")
conn = sqlite3.connect('sales_data.db')
cursor = conn.cursor()

cursor.execute('SELECT location, COUNT(*) FROM sales_data GROUP BY location ORDER BY location')
print("\n📍 Reportes por local:")
for row in cursor.fetchall():
    print(f"   {row[0]}: {row[1]} reportes")

# Verificar ventas de Via Vieja
cursor.execute('SELECT SUM(total_sales) FROM sales_data WHERE location = "GROWLER VIA VIEJA"')
vv_sales = cursor.fetchone()[0]
if vv_sales:
    print(f"\n💰 Ventas totales Via Vieja: ${vv_sales/100:,.2f}")
else:
    print("\n⚠️  No hay ventas de Via Vieja en la BD")

conn.close()

# Actualizar dashboard
print("\n📊 Actualizando dashboard...")
extractor.export_dashboard_data()
print("   ✅ Dashboard actualizado")

print("\n" + "=" * 60)
print("✅ PROCESO COMPLETADO")
print("=" * 60)
print("\n🔄 Refrescá el dashboard en tu navegador (Cmd+R)")
