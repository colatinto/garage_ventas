#!/usr/bin/env python3
"""
Setup e Instalación - Sistema de Análisis de Ventas v2.0
Instala dependencias y configura todo automáticamente
"""

import os
import sys
import json
import subprocess
import platform
from pathlib import Path

def print_banner():
    """Mostrar banner inicial"""
    print("\n" + "="*70)
    print("🚀 SETUP - Sistema de Análisis de Ventas v2.0 (5 Locales)")
    print("="*70)
    print("\nEste script instalará:")
    print("  ✓ Todas las dependencias Python")
    print("  ✓ Base de datos SQLite")
    print("  ✓ Configuración de Gmail IMAP")
    print("  ✓ Scheduler automático a las 4:00 AM")
    print("\n")

def install_requirements():
    """Instalar dependencias"""
    print("📦 Instalando dependencias Python...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencias instaladas correctamente\n")
        return True
    except Exception as e:
        print(f"❌ Error instalando dependencias: {e}\n")
        return False

def setup_gmail_config():
    """Configurar credenciales de Gmail"""
    print("📧 Configuración de Gmail")
    print("-" * 70)
    print("""
Para usar el sistema, necesitas:
1. Una cuenta de Gmail
2. Habilitar "Acceso de aplicaciones menos seguras" O
3. Crear una "Contraseña de aplicación" (RECOMENDADO)

📖 Instrucciones para crear contraseña de aplicación:
   a) Ve a https://myaccount.google.com/apppasswords
   b) Selecciona "Correo" y "Windows/Mac/Linux"
   c) Copia la contraseña de 16 caracteres

""")

    email = input("📧 Tu email de Gmail: ").strip()
    password = input("🔐 Contraseña de aplicación (16 caracteres): ").strip()

    if not email or not password:
        print("❌ Email y contraseña son requeridos\n")
        return False

    # Cargar y actualizar config.json
    try:
        with open('config.json', 'r', encoding='utf-8') as f:
            config = json.load(f)

        config['email']['username'] = email
        config['email']['password'] = password

        with open('config.json', 'w', encoding='utf-8') as f:
            json.dump(config, f, indent=4, ensure_ascii=False)

        print(f"✅ Configuración guardada para: {email}\n")
        return True
    except Exception as e:
        print(f"❌ Error guardando configuración: {e}\n")
        return False

def create_directories():
    """Crear directorios necesarios"""
    print("📁 Creando directorios...")
    directories = [
        'temp_pdfs',
        'logs',
        'data'
    ]

    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
        print(f"  ✓ {directory}/")

    print()

def setup_scheduler():
    """Mostrar instrucciones para scheduler del sistema"""
    print("⏰ Configuración del Scheduler (Automatización)")
    print("-" * 70)

    system = platform.system()

    if system == "Windows":
        print("""
En Windows, necesitas crear una Tarea Programada:

1. Abre "Programador de tareas" (Task Scheduler)
2. Haz clic en "Crear tarea básica"
3. Nombre: "Extracción Ventas - 4:00 AM"
4. Descripción: "Extrae automáticamente datos de ventas a las 4:00 AM"
5. En "Desencadenador": Selecciona "Diariamente" a las 04:00
6. En "Acción":
   - Programa: python
   - Argumentos: "{}" -m automation_service_v2
   - Directorio: ""{}""
7. En "Condiciones": Desmarca "Iniciar la tarea solo si el equipo está enchufado"
8. Haz clic en "Crear"

Alternativamente, ejecuta en PowerShell como Administrador:
    python -m automation_service_v2

""".format(sys.executable, os.path.abspath('.')))

    elif system == "Darwin":  # macOS
        print("""
En macOS, crea un archivo launchd:

1. Abre Terminal
2. Copia el siguiente contenido:

cat > ~/Library/LaunchAgents/com.ventas.extractor.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.ventas.extractor</string>
    <key>ProgramArguments</key>
    <array>
        <string>{}</string>
        <string>-m</string>
        <string>automation_service_v2</string>
    </array>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>4</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>
</dict>
</plist>
EOF

3. Ejecuta: launchctl load ~/Library/LaunchAgents/com.ventas.extractor.plist

""".format(sys.executable))

    elif system == "Linux":
        print("""
En Linux, usa crontab:

1. Abre la terminal
2. Ejecuta: crontab -e
3. Agrega esta línea:

0 4 * * * cd {} && {} -m automation_service_v2

Esto ejecutará el extractor diariamente a las 4:00 AM

4. Guarda con Ctrl+O, Enter, Ctrl+X

""".format(os.path.abspath('.'), sys.executable))

    print()

def create_test_data():
    """Crear datos de prueba iniciales"""
    print("🧪 Creando base de datos inicial...")
    try:
        from sales_extractor_v2 import SalesDataExtractor
        extractor = SalesDataExtractor()
        print("✅ Base de datos SQLite creada: sales_data.db\n")
        return True
    except Exception as e:
        print(f"⚠️  Aviso: {e}\n")
        return False

def test_extraction():
    """Prueba rápida de extracción"""
    print("🧪 Prueba de Extracción")
    print("-" * 70)
    print("""
Para probar el sistema sin esperar a las 4:00 AM:

1. Asegúrate de tener emails con reportes de MaxiREST
2. Ejecuta en terminal:

   python -c "from sales_extractor_v2 import SalesDataExtractor; SalesDataExtractor().run_extraction_cycle()"

3. Revisa el dashboard en live_dashboard_v2.html

""")

def final_instructions():
    """Mostrar instrucciones finales"""
    print("=" * 70)
    print("✅ INSTALACIÓN COMPLETADA")
    print("=" * 70)
    print("""
📋 Próximos pasos:

1. 🌐 ABRIR EL DASHBOARD
   - Abre el archivo: live_dashboard_v2.html en tu navegador
   - Verás un dashboard vacío hasta que se procesen datos

2. ⏰ ACTIVAR EXTRACCIÓN AUTOMÁTICA
   - Sigue las instrucciones de scheduler arriba (según tu SO)
   - El sistema extraerá datos automáticamente a las 4:00 AM

3. 🧪 PRUEBA RÁPIDA (Opcional)
   - Ejecuta: python -c "from sales_extractor_v2 import SalesDataExtractor; SalesDataExtractor().run_extraction_cycle()"
   - Si tienes emails, verás los datos en 2-3 segundos

4. 📊 DATOS EN TIEMPO REAL
   - El dashboard se actualiza automáticamente cada 5 minutos
   - Busca: dashboard_data.json (datos en JSON)

⚙️  ARCHIVOS PRINCIPALES:

  sales_extractor_v2.py ......... Extrae datos de PDFs por "Sucursal:"
  automation_service_v2.py ...... Servicio que corre a las 4:00 AM
  config.json ................... Configuración (email, locales, alertas)
  live_dashboard_v2.html ........ Dashboard web (5 locales)
  requirements.txt .............. Dependencias Python
  sales_data.db ................. Base de datos SQLite (se crea auto)

📧 SOPORTE:

Si tienes problemas:
  1. Revisa los logs: sales_extractor.log, automation_service.log
  2. Verifica credenciales de Gmail en config.json
  3. Confirma que recibís emails de MaxiREST

🎉 ¡Sistema listo para usar!

""")

def main():
    """Función principal"""
    print_banner()

    # Instalar dependencias
    if not install_requirements():
        sys.exit(1)

    # Crear directorios
    create_directories()

    # Configurar Gmail
    if not setup_gmail_config():
        print("⚠️  Puedes configurar Gmail después en config.json")

    # Crear base de datos
    create_test_data()

    # Setup scheduler
    setup_scheduler()

    # Instrucciones de prueba
    test_extraction()

    # Instrucciones finales
    final_instructions()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Setup cancelado por el usuario")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error durante setup: {e}")
        sys.exit(1)
