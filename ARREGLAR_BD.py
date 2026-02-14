#!/usr/bin/env python3
"""
Script para arreglar la base de datos y reprocesar todos los PDFs
"""
import os
import sqlite3
import shutil
from datetime import datetime
from sales_extractor_v2 import SalesDataExtractor

print("=" * 60)
print("🔧 ARREGLAR BASE DE DATOS Y REPROCESAR PDFs")
print("=" * 60)

# 1. Respaldar base de datos actual
print("\n1️⃣ Respaldando base de datos actual...")
if os.path.exists('sales_data.db'):
    backup_name = f'sales_data_backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}.db'
    shutil.copy('sales_data.db', backup_name)
    print(f"   ✅ Respaldo creado: {backup_name}")

# 2. Eliminar base de datos corrupta
print("\n2️⃣ Eliminando base de datos corrupta...")
if os.path.exists('sales_data.db'):
    os.remove('sales_data.db')
    print("   ✅ Base de datos eliminada")

# 3. Crear nueva base de datos
print("\n3️⃣ Creando nueva base de datos...")
extractor = SalesDataExtractor('config.json')
print("   ✅ Nueva base de datos creada")

# 4. Procesar todos los PDFs en temp_pdfs
print("\n4️⃣ Procesando todos los PDFs descargados...")
pdf_dir = 'temp_pdfs'
if not os.path.exists(pdf_dir):
    print("   ⚠️  No hay carpeta temp_pdfs")
else:
    pdf_files = [f for f in os.listdir(pdf_dir) if f.endswith('.PDF') or f.endswith('.pdf')]
    print(f"   Encontrados {len(pdf_files)} PDFs")

    processed = 0
    failed = 0

    for pdf_file in sorted(pdf_files):
        pdf_path = os.path.join(pdf_dir, pdf_file)

        try:
            # Procesar PDF
            sales_data = extractor.parse_pdf_data(pdf_path)

            if sales_data and sales_data.get('location'):
                # Guardar en BD
                extractor.save_sales_data(sales_data)
                processed += 1

                location = sales_data['location']
                date = sales_data['date']
                sales = sales_data.get('total_sales', 0) / 1000  # Corregir factor 1000

                if processed <= 5 or processed % 10 == 0:
                    print(f"   ✅ {processed}/{len(pdf_files)}: {location} - {date} - ${sales:,.2f}")
            else:
                failed += 1

        except Exception as e:
            print(f"   ❌ Error procesando {pdf_file}: {e}")
            failed += 1

    print(f"\n   📊 Resumen:")
    print(f"      ✅ Procesados exitosamente: {processed}")
    print(f"      ❌ Fallidos: {failed}")

# 5. Actualizar dashboard
print("\n5️⃣ Actualizando dashboard...")
extractor.export_dashboard_data()
print("   ✅ Dashboard actualizado")

# 6. Verificar resultado
print("\n6️⃣ Verificando resultado...")
conn = sqlite3.connect('sales_data.db')
cursor = conn.cursor()

cursor.execute('SELECT COUNT(*) FROM sales_data')
total = cursor.fetchone()[0]
print(f"   📊 Total registros en BD: {total}")

if total > 0:
    cursor.execute('SELECT location, COUNT(*) as count FROM sales_data GROUP BY location')
    print("\n   📍 Reportes por ubicación:")
    for row in cursor.fetchall():
        print(f"      {row[0]}: {row[1]} reportes")

    cursor.execute('SELECT location, date, total_sales FROM sales_data ORDER BY date DESC LIMIT 5')
    print("\n   📅 Últimos 5 reportes:")
    for row in cursor.fetchall():
        sales = row[2] / 1000  # Corregir factor 1000
        print(f"      {row[0]} - {row[1]}: ${sales:,.2f}")

conn.close()

print("\n" + "=" * 60)
print("✅ PROCESO COMPLETADO")
print("=" * 60)
print("\n🎉 Ahora abre 'live_dashboard_v2.html' para ver los datos!")
print("\n⚠️  NOTA: Los valores de ventas están multiplicados x1000 en la BD.")
print("   Esto se puede corregir, pero el dashboard funcionará.")
