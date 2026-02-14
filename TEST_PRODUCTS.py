#!/usr/bin/env python3
"""
Script para probar extracción de productos de un PDF
"""
import sys
import os
from sales_extractor_v2 import SalesDataExtractor

print("=" * 60)
print("🧪 TEST - EXTRACCIÓN DE PRODUCTOS")
print("=" * 60)

# Inicializar extractor
extractor = SalesDataExtractor('config.json')

# Procesar un PDF de prueba
pdf_path = 'temp_pdfs/20260211_135410_FINTURNO.PDF'

if not os.path.exists(pdf_path):
    print(f"❌ PDF no encontrado: {pdf_path}")
    print("Buscando otros PDFs...")
    pdfs = [f for f in os.listdir('temp_pdfs') if f.endswith('.PDF')]
    if pdfs:
        pdf_path = os.path.join('temp_pdfs', pdfs[0])
        print(f"✅ Usando: {pdf_path}")
    else:
        print("❌ No hay PDFs disponibles")
        sys.exit(1)

print(f"\n📄 Procesando: {pdf_path}")
sales_data = extractor.parse_pdf_data(pdf_path)

if sales_data:
    print(f"\n📍 Local: {sales_data.get('location')}")
    print(f"📅 Fecha: {sales_data.get('date')}")
    print(f"🕐 Turno: {sales_data.get('shift')}")
    print(f"💰 Total ventas: ${sales_data.get('total_sales', 0)/100:,.2f}")

    products = sales_data.get('products', [])
    print(f"\n📦 Productos extraídos: {len(products)}")

    if products:
        print("\n🏆 Top 10 productos:")
        # Ordenar por cantidad vendida
        top_products = sorted(products, key=lambda x: x['quantity'], reverse=True)[:10]

        for i, prod in enumerate(top_products, 1):
            print(f"   {i}. {prod['product_name'][:25]:25} | Cant: {prod['quantity']:>5.1f} | Total: ${prod['total_amount']/100:>8,.2f}")

        # Verificar en BD (copiar primero para evitar disk I/O errors)
        print("\n🔍 Verificando en base de datos...")
        import sqlite3
        import shutil
        temp_db = '/sessions/amazing-practical-hypatia/sales_data_temp.db'
        shutil.copy('sales_data.db', temp_db)

        conn = sqlite3.connect(temp_db)
        cursor = conn.cursor()

        cursor.execute('SELECT COUNT(*) FROM products')
        total = cursor.fetchone()[0]
        print(f"   Total productos en BD: {total}")

        cursor.execute('''
            SELECT location, COUNT(*) as count
            FROM products
            GROUP BY location
            ORDER BY count DESC
        ''')
        print("\n   Productos por local:")
        for row in cursor.fetchall():
            print(f"      {row[0]}: {row[1]} productos")

        conn.close()
    else:
        print("⚠️  No se extrajeron productos")
else:
    print("❌ Error al procesar PDF")

print("\n" + "=" * 60)
print("✅ TEST COMPLETADO")
print("=" * 60)
