#!/usr/bin/env python3
"""
Script de diagnóstico y reparación para datos del 11/02/2026
"""
import os
import sys
import sqlite3
import shutil
from sales_extractor_v2 import SalesDataExtractor

def main():
    print("🔍 Buscando y procesando datos del 11/02/2026...")
    print("")

    # Rutas
    work_dir = os.path.dirname(os.path.abspath(__file__))
    mounted_db = os.path.join(work_dir, 'sales_data_temp.db')
    temp_db = '/sessions/amazing-practical-hypatia/sales_data_temp.db'

    # Copiar BD a directorio temporal para evitar disk I/O errors
    print("📋 Copiando base de datos a directorio temporal...")
    if os.path.exists(mounted_db):
        shutil.copy2(mounted_db, temp_db)
        print(f"   ✅ BD copiada a {temp_db}")
    else:
        print(f"   ⚠️  No existe BD en {mounted_db}")
    print("")

    # Primero, desmarcar los emails del 11/02 para que se vuelvan a procesar
    print("🔄 Desmarcando emails del 11/02 para reprocesar...")
    conn = sqlite3.connect(temp_db)
    cursor = conn.cursor()

    # Buscar emails con el asunto que contenga 11/02/2026
    cursor.execute("SELECT COUNT(*) FROM processed_emails WHERE subject LIKE '%11/02/2026%'")
    count = cursor.fetchone()[0]
    print(f"   Emails del 11/02 marcados como procesados: {count}")

    cursor.execute("DELETE FROM processed_emails WHERE subject LIKE '%11/02/2026%'")
    deleted = cursor.rowcount
    conn.commit()
    print(f"   Desmarcados: {deleted} emails")
    print("")

    # Borrar datos anteriores del 11/02 para evitar duplicados
    print("🗑️  Limpiando datos anteriores del 11/02...")
    cursor.execute("DELETE FROM sales_data WHERE date = '2026-02-11'")
    deleted_sales = cursor.rowcount
    cursor.execute("DELETE FROM products WHERE date = '2026-02-11'")
    deleted_products = cursor.rowcount
    conn.commit()
    print(f"   Borrados: {deleted_sales} reportes, {deleted_products} productos")
    print("")
    conn.close()

    # Copiar de vuelta la BD modificada
    print("📋 Copiando BD modificada de vuelta...")
    shutil.copy2(temp_db, mounted_db)
    print("   ✅ BD actualizada")
    print("")

    # Inicializar extractor
    extractor = SalesDataExtractor('config.json')

    # Ahora procesar los emails del 11/02
    print("📥 Descargando y procesando emails del 11/02/2026...")
    extractor.run_extraction_cycle()
    print("")

    # Copiar BD procesada de vuelta para verificar
    if os.path.exists(temp_db):
        shutil.copy2(temp_db, mounted_db)

    # Verificar datos en BD
    print("🔍 Verificando datos del 11/02 en BD...")
    conn = sqlite3.connect(temp_db)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT location, shift, total_sales, date
        FROM sales_data
        WHERE date = '2026-02-11'
        ORDER BY location, shift
    """)

    results = cursor.fetchall()
    if results:
        print(f"   ✅ Reportes en BD para 2026-02-11: {len(results)}")
        for row in results:
            print(f"      - {row[0]} ({row[1]}): ${row[2]:,.2f}")
    else:
        print("   ❌ No hay datos del 11/02 en BD")
    print("")

    # Verificar productos
    cursor.execute("""
        SELECT COUNT(DISTINCT product_name) as unique_products,
               COUNT(*) as total_entries
        FROM products
        WHERE date = '2026-02-11'
    """)
    prod_stats = cursor.fetchone()
    if prod_stats and prod_stats[1] > 0:
        print(f"   📦 Productos del 11/02: {prod_stats[1]} entradas ({prod_stats[0]} únicos)")
    conn.close()
    print("")

    # Copiar BD final de vuelta
    print("📋 Guardando cambios...")
    shutil.copy2(temp_db, mounted_db)
    print("   ✅ BD guardada")
    print("")

    # Exportar datos actualizados
    print("📤 Exportando dashboard actualizado...")
    extractor.export_dashboard_data()
    print("✅ Dashboard exportado a dashboard_data.json")
    print("")

    print("✅ Proceso completado")
    print("")
    print("🚀 Ahora ejecutá:")
    print("   ./actualizar_web.sh")
    print("")
    print("Para subir los cambios a Netlify")

if __name__ == "__main__":
    main()
