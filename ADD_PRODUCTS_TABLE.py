#!/usr/bin/env python3
"""
Script para agregar tabla de productos a la base de datos
"""
import sqlite3

print("=" * 60)
print("🔧 AGREGAR TABLA DE PRODUCTOS")
print("=" * 60)

# Conectar a la base de datos
conn = sqlite3.connect('sales_data.db')
cursor = conn.cursor()

# Crear tabla de productos
cursor.execute('''
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        location TEXT NOT NULL,
        shift TEXT,
        product_code TEXT,
        product_name TEXT NOT NULL,
        category TEXT,
        quantity REAL NOT NULL,
        total_amount REAL NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(date, location, shift, product_code)
    )
''')

# Crear índices para búsquedas rápidas
cursor.execute('CREATE INDEX IF NOT EXISTS idx_products_location ON products(location)')
cursor.execute('CREATE INDEX IF NOT EXISTS idx_products_date ON products(date)')
cursor.execute('CREATE INDEX IF NOT EXISTS idx_products_name ON products(product_name)')

conn.commit()

# Verificar creación
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='products'")
if cursor.fetchone():
    print("✅ Tabla 'products' creada exitosamente")

    # Mostrar estructura
    cursor.execute("PRAGMA table_info(products)")
    print("\n📋 Estructura de la tabla:")
    for col in cursor.fetchall():
        print(f"   {col[1]}: {col[2]}")
else:
    print("❌ Error al crear tabla")

conn.close()

print("\n" + "=" * 60)
print("✅ PROCESO COMPLETADO")
print("=" * 60)
