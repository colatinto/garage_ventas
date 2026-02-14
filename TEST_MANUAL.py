#!/usr/bin/env python3
"""
SCRIPT DE PRUEBA MANUAL - Sistema de Extracción de Ventas
Ejecutar esto para verificar que el sistema funciona correctamente
"""
import sys
import os

# Asegurarse de que estamos en el directorio correcto
os.chdir(os.path.dirname(os.path.abspath(__file__)))

from sales_extractor_v2 import SalesDataExtractor
import json

print("=" * 60)
print("🔧 PRUEBA MANUAL DEL SISTEMA DE EXTRACCIÓN DE VENTAS")
print("=" * 60)

try:
    # 1. Verificar configuración
    print("\n1️⃣ Verificando configuración...")
    with open('config.json', 'r') as f:
        config = json.load(f)

    print(f"   ✅ Email configurado: {config['email']['username']}")
    print(f"   ✅ Locales configurados: {len(config['locations'])}")
    for loc in config['locations'].keys():
        print(f"      • {loc}")

    # 2. Inicializar extractor
    print("\n2️⃣ Inicializando extractor...")
    extractor = SalesDataExtractor('config.json')
    print("   ✅ Extractor inicializado correctamente")

    # 3. Probar conexión y extracción de emails
    print("\n3️⃣ Extrayendo emails de Gmail...")
    print("   ⏳ Conectando a Gmail (esto puede tomar unos segundos)...")

    emails = extractor.extract_from_gmail()

    if emails:
        print(f"   ✅ ¡Éxito! Se encontraron {len(emails)} emails nuevos")
        print("\n   📧 Detalles de los emails encontrados:")
        for i, email_data in enumerate(emails, 1):
            print(f"\n      Email #{i}:")
            print(f"         Asunto: {email_data.get('subject', 'N/A')}")
            print(f"         Adjuntos: {len(email_data.get('attachments', []))}")
            if email_data.get('attachments'):
                for att in email_data.get('attachments', []):
                    filename = att.get('filename') if isinstance(att, dict) else str(att)
                    print(f"            • {filename}")
    else:
        print("   ⚠️  No se encontraron emails nuevos")
        print("      Esto puede significar:")
        print("      • Todos los emails ya fueron procesados")
        print("      • No hay emails de MaxiREST en los últimos 7 días")
        print("      • Hay un problema de conexión con Gmail")

    # 4. Procesar reportes si hay emails
    if emails:
        print("\n4️⃣ Procesando reportes encontrados...")
        processed_count = 0

        for email_data in emails:
            for attachment in email_data.get('attachments', []):
                # attachment es un diccionario con 'filename', 'path', 'size'
                pdf_path = attachment.get('path') if isinstance(attachment, dict) else attachment

                if pdf_path and str(pdf_path).endswith('.pdf'):
                    filename = attachment.get('filename') if isinstance(attachment, dict) else os.path.basename(pdf_path)
                    print(f"\n   📄 Procesando: {filename}")
                    sales_data = extractor.parse_pdf_data(pdf_path)

                    if sales_data and sales_data.get('location'):
                        print(f"      ✅ Local identificado: {sales_data['location']}")
                        print(f"      💰 Ventas totales: ${sales_data.get('total_sales', 0):,.2f}")

                        # Guardar en la base de datos
                        extractor.save_sales_data(sales_data)
                        extractor.mark_email_processed(email_data['email_id'])
                        processed_count += 1
                    else:
                        print(f"      ⚠️  No se pudo extraer datos del PDF")

        print(f"\n   ✅ Procesados {processed_count} reportes exitosamente")

    # 5. Generar datos para dashboard
    print("\n5️⃣ Actualizando dashboard...")
    extractor.export_dashboard_data()
    print("   ✅ Dashboard actualizado")

    # 6. Resumen final
    print("\n" + "=" * 60)
    print("✅ PRUEBA COMPLETADA EXITOSAMENTE")
    print("=" * 60)

    if emails:
        print("\n🎉 El sistema está funcionando correctamente!")
        print("   Ahora puedes abrir 'live_dashboard_v2.html' en tu navegador")
        print("   para ver los datos extraídos.")
    else:
        print("\n⚠️  El sistema funciona, pero no hay datos nuevos para procesar")
        print("   Espera a que lleguen nuevos emails de MaxiREST e intenta nuevamente.")

    print("\n📝 Para automatizar las extracciones diarias a las 4:00 AM:")
    print("   Ejecuta: python3 automation_service_v2.py")

except Exception as e:
    print("\n" + "=" * 60)
    print("❌ ERROR DURANTE LA PRUEBA")
    print("=" * 60)
    print(f"\nError: {e}")
    print("\n🔧 Detalles técnicos:")
    import traceback
    traceback.print_exc()
    print("\n💡 Si el error es de conexión, verifica:")
    print("   • Que tengas conexión a internet")
    print("   • Que las credenciales de Gmail sean correctas en config.json")
    print("   • Que la contraseña de aplicación de Gmail esté activa")

print("\n")
