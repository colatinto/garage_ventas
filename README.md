# 🚀 Sistema Automático de Análisis de Ventas - 5 Locales v2.0

**Extracción inteligente de reportes MaxiREST | Identificación por campo "Sucursal:" | Scheduler 4:00 AM**

---

## 📊 Descripción General

Sistema automático que extrae datos de ventas desde emails con reportes MaxiREST, identifica los 5 locales por el campo **"Sucursal:"** en los PDFs, y genera un dashboard en tiempo real.

**Características principales:**
- ✅ Identifica 5 locales automáticamente por "Sucursal:"
- ✅ Manejo especial para GROWLER CAFE (2 turnos)
- ✅ Extracción automática **UNA VEZ POR DÍA a las 4:00 AM**
- ✅ Dashboard HTML con gráficos en tiempo real
- ✅ Base de datos SQLite con histórico de 30 días
- ✅ Alertas automáticas por desempeño
- ✅ Compatible Windows / macOS / Linux

---

## 🏪 Los 5 Locales

| Código | Nombre | Ubicación | Turnos |
|--------|--------|-----------|--------|
| **GG Vol 4** | Galpón Pasco SAS | Pte Roca 1898 | 1 |
| **GG Vol 2** | Garage de Sabores SAS | Alvear 51 bis | 1 |
| **COLEGIO** | Garage de Sabores SAS | Belgrano 646 | 1 |
| **GROWLER CAFE** | Growler Garage SAS | Moreno 1835 | 2⭐ |
| **GROWLER VIA VIEJA** | Garage de Sabores SAS | Santa Fe 3329 | 1 |

⭐ *GROWLER CAFE* tiene 2 turnos: Tarde (~17hs) y Noche (~00/01hs)

---

## 🔧 Instalación Rápida

### 1️⃣ Requisitos Previos
- Python 3.7+
- Una cuenta de Gmail

### 2️⃣ Instalar Sistema

```bash
# Clonar o descargar archivos
cd tu_carpeta_del_proyecto

# Ejecutar setup
python setup.py
```

El setup automáticamente:
- ✓ Instala dependencias Python
- ✓ Crea directorios necesarios
- ✓ Configura credenciales de Gmail
- ✓ Crea base de datos SQLite
- ✓ Muestra instrucciones para scheduler

### 3️⃣ Configurar Gmail (IMPORTANTE)

#### Opción A: Contraseña de Aplicación (RECOMENDADO)
1. Ve a https://myaccount.google.com/apppasswords
2. Selecciona "Correo" y "Windows/Mac/Linux"
3. Copia la contraseña de 16 caracteres
4. Pégala cuando el setup lo pida

#### Opción B: Acceso Menos Seguro (DEPRECADO)
1. Ve a https://myaccount.google.com/lesssecureapps
2. Activa "Permitir aplicaciones menos seguras"

### 4️⃣ Activar Automatización

#### En Windows - Task Scheduler
```
1. Abre "Programador de tareas"
2. Crea tarea básica: "Extracción Ventas - 4:00 AM"
3. Desencadenador: Diariamente a las 04:00
4. Acción:
   Programa: python
   Argumentos: -m automation_service_v2
5. Guardar
```

#### En macOS - launchd
```bash
cat > ~/Library/LaunchAgents/com.ventas.extractor.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.ventas.extractor</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/bin/python3</string>
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

launchctl load ~/Library/LaunchAgents/com.ventas.extractor.plist
```

#### En Linux - crontab
```bash
crontab -e

# Agregar esta línea:
0 4 * * * cd /ruta/al/proyecto && python3 -m automation_service_v2
```

---

## 📖 Uso del Sistema

### Acceder al Dashboard
```bash
# Abre en tu navegador:
live_dashboard_v2.html
```

El dashboard muestra:
- 📈 Ventas totales del día
- 🎟️ Cantidad de tickets
- 💰 Ticket promedio
- 🏆 Mejor local del día
- 📊 Gráficos de tendencia (últimos 30 días)
- 💳 Desglose de formas de pago
- 🏪 Tarjetas detalladas de los 5 locales
- 🚨 Alertas automáticas

### Ejecutar Extracción Manual

```bash
# Extracción única (útil para probar)
python -c "from sales_extractor_v2 import SalesDataExtractor; SalesDataExtractor().run_extraction_cycle()"

# O ejecutar el servicio indefinidamente
python -m automation_service_v2
```

### Ver Datos en JSON
```bash
# Los datos se guardan en:
dashboard_data.json

# Contiene:
# - sales_data: Historial de ventas
# - alerts: Alertas del sistema
# - locations: Información de los 5 locales
# - last_updated: Timestamp de última actualización
```

---

## 📁 Estructura de Archivos

```
proyecto/
├── sales_extractor_v2.py ........... Extractor principal (identifica por "Sucursal:")
├── automation_service_v2.py ........ Servicio que corre a las 4:00 AM
├── config.json ..................... Configuración (credenciales, locales, alertas)
├── requirements.txt ................ Dependencias Python
├── setup.py ........................ Script de instalación automática
├── live_dashboard_v2.html .......... Dashboard web (5 locales + gráficos)
├── README.md ....................... Este archivo
├── sales_data.db ................... Base de datos SQLite (auto-creada)
├── dashboard_data.json ............ Datos JSON para dashboard (auto-generado)
├── sales_extractor.log ............ Logs de extracción
├── automation_service.log ......... Logs del servicio
└── temp_pdfs/ ..................... Almacenamiento temporal de PDFs
```

---

## ⚙️ Configuración (config.json)

```json
{
    "email": {
        "username": "tu_email@gmail.com",
        "password": "contraseña_app_16_caracteres"
    },
    "scheduler": {
        "extraction_time": "04:00",
        "extraction_frequency": "daily"
    },
    "locations": {
        "GG Vol 4": { "display_name": "GG Vol 4", ... },
        "GG Vol 2": { "display_name": "GG Vol 2", ... },
        "COLEGIO": { "display_name": "COLEGIO", ... },
        "GROWLER CAFE": { "display_name": "GROWLER CAFE", "shifts": 2 },
        "GROWLER VIA VIEJA": { "display_name": "GROWLER VIA VIEJA", ... }
    },
    "alerts": {
        "low_sales_threshold": -15,
        "high_sales_threshold": 25
    }
}
```

---

## 🔍 Cómo Identifica los Locales

El sistema busca el campo `Sucursal:` en los PDFs:

```
Sucursal: GG Vol 4     ➜ Galpón Pasco
Sucursal: GG           ➜ Garage de Sabores (Alvear 51 bis)
Sucursal: COLEGIO      ➜ Garage de Sabores (Belgrano 646)
Sucursal: GROWLER      ➜ Growler Garage (Moreno 1835)
Sucursal: GROWLER VV   ➜ Growler Vía Vieja (Santa Fe 3329)
```

Si el campo no se encuentra, intenta identificar por dirección como fallback.

---

## 📊 Datos Extraídos del PDF

Por cada reporte se extrae:

```python
{
    "date": "2026-02-10",
    "location": "GG Vol 4",
    "shift": "Tarde",
    "opening_time": "18:06",
    "closing_time": "00:30",
    "closure_number": 122,

    "total_sales": 1095500.00,
    "total_tickets": 45,

    # Por forma de pago
    "cash_sales": 428000.00,
    "card_sales": 496500.00,
    "transfer_sales": 146000.00,
    "mercadopago_sales": 181000.00,
    "other_sales": 25000.00,

    # Por canal
    "salon_sales": 957000.00,
    "counter_sales": 138500.00
}
```

---

## 🚨 Alertas Automáticas

El sistema genera alertas cuando:

- **Ventas bajas**: Caen 15% o más vs promedio
- **Ventas altas**: Suben 25% o más vs promedio
- **Alertas personalizadas**: Configurables en `config.json`

Las alertas se envían:
- 📊 Al dashboard en tiempo real
- 📧 Por email (si está habilitado)

---

## 🐛 Solucionar Problemas

### "No se encuentran emails"
- ✓ Verifica que los emails lleguen a tu inbox
- ✓ Confirma credenciales en `config.json`
- ✓ Revisa logs: `sales_extractor.log`

### "No se identifican los locales"
- ✓ Abre un PDF en editor de texto
- ✓ Busca la línea "Sucursal: XXX"
- ✓ Verifica que coincida con la tabla de arriba
- ✓ Revisa logs para ver qué código encontró

### "El dashboard no se actualiza"
- ✓ Recarga la página (F5)
- ✓ Abre la consola (F12) para ver errores
- ✓ Verifica que `dashboard_data.json` exista
- ✓ Revisa que hayas ejecutado una extracción

### "El scheduler no funciona"
- **Windows**: Verifica Task Scheduler > Historial
- **macOS**: Ejecuta `log stream --predicate 'process == "launchd"'`
- **Linux**: Ejecuta `grep CRON /var/log/syslog`

---

## 📞 Logs y Debugging

### Ver logs en tiempo real

```bash
# Extracción
tail -f sales_extractor.log

# Servicio
tail -f automation_service.log
```

### Habilitar debug verbose

En `sales_extractor_v2.py`, cambiar:
```python
logging.basicConfig(level=logging.DEBUG)  # En lugar de INFO
```

---

## 🔒 Seguridad

⚠️ **IMPORTANTE:**
- Nunca compartas `config.json` con las credenciales
- La contraseña de Gmail NO se guarda en git
- Usa contraseña de aplicación, NO tu contraseña personal
- Los PDFs se borran automáticamente después de procesarse

---

## 📝 Ejemplos de Uso

### Exportar datos a CSV
```python
import sqlite3
import csv

conn = sqlite3.connect('sales_data.db')
cursor = conn.cursor()
cursor.execute('SELECT * FROM sales_data WHERE date >= date("now", "-30 days")')

with open('ventas_30dias.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['date', 'location', 'shift', 'total_sales', 'tickets'])
    writer.writerows(cursor.fetchall())

conn.close()
```

### Generar reporte personalizado
```python
from sales_extractor_v2 import SalesDataExtractor

extractor = SalesDataExtractor()
extractor.run_extraction_cycle()

# Luego consulta dashboard_data.json
import json
with open('dashboard_data.json') as f:
    data = json.load(f)
    print(f"Total de reportes: {len(data['sales_data'])}")
```

---

## 📈 Próximas Mejoras (Roadmap)

- [ ] Envío de resumen diario por email
- [ ] Reporte semanal automático
- [ ] Integración con Google Sheets
- [ ] API REST para acceso remoto
- [ ] Notificaciones en Slack/WhatsApp
- [ ] Gráficos de comparativa entre locales

---

## 👨‍💻 Soporte y Contacto

Si tienes preguntas o problemas:
1. Revisa los logs: `sales_extractor.log` y `automation_service.log`
2. Verifica la configuración en `config.json`
3. Ejecuta una prueba manual: `python -c "from sales_extractor_v2 import SalesDataExtractor; SalesDataExtractor().run_extraction_cycle()"`

---

## 📄 Licencia

Este sistema está desarrollado para Garage de Sabores.

---

**¡Listo para usar! 🎉**

Ejecuta `python setup.py` y sigue las instrucciones para começar.
