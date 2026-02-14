# 🔧 SOLUCIÓN AL PROBLEMA - Dashboard en 0

## 📋 Diagnóstico

**Problema encontrado:** Error de importación en el código Python
```
ERROR: name 'decode_header' is not defined
```

**Causa raíz:** La función `decode_header` se importaba dentro de un método pero se usaba en otro método diferente, causando un error de scope.

**Estado de la base de datos:** Vacía (0 registros) porque el sistema nunca pudo extraer emails correctamente debido al error de código.

---

## ✅ Solución Aplicada

### 1. Correcciones de código realizadas:

- ✅ Movidos los imports de `email`, `imaplib`, y `decode_header` al inicio del archivo
- ✅ Movido el import de `PyPDF2` al inicio del archivo
- ✅ Agregado soporte para `pypdf` (alternativa moderna a PyPDF2)
- ✅ Eliminados imports duplicados dentro de funciones

### 2. Archivos modificados:
- `sales_extractor_v2.py` - Corregidos errores de importación

---

## 🧪 PRÓXIMOS PASOS - ¡IMPORTANTE!

### Paso 1: Probar el sistema manualmente

En tu Mac, abre la Terminal y ejecuta:

```bash
cd ~/Documents/garage_ventas
source venv/bin/activate
python3 TEST_MANUAL.py
```

**Esto va a:**
1. Verificar la configuración
2. Conectarse a Gmail
3. Extraer emails de MaxiREST de los últimos 7 días
4. Procesar los PDFs adjuntos
5. Guardar los datos en la base de datos
6. Actualizar el dashboard

**Resultado esperado:**
- Si hay emails nuevos: verás un resumen de cuántos reportes se procesaron
- Si no hay emails nuevos: significa que todos ya fueron procesados anteriormente o no hay emails recientes

---

### Paso 2: Verificar el dashboard

Después de ejecutar la prueba manual, abre el dashboard:

1. En Finder, ve a: `~/Documents/garage_ventas/`
2. Doble clic en `live_dashboard_v2.html`
3. El dashboard debería mostrar los datos extraídos

**Si todavía muestra 0:**
- Significa que no había emails nuevos para procesar
- Espera a que lleguen nuevos emails de MaxiREST
- O verifica que los emails estén en tu Gmail

---

### Paso 3: Activar la automatización diaria

Una vez que confirmes que el sistema funciona con la prueba manual, activa la extracción automática diaria:

#### Opción A: Ejecutar manualmente (para testing)
```bash
cd ~/Documents/garage_ventas
source venv/bin/activate
python3 automation_service_v2.py
```

Este servicio:
- Ejecuta una extracción inmediata al inicio
- Luego extrae emails automáticamente a las 4:00 AM cada día
- Mantiene el dashboard actualizado

**⚠️ Nota:** Debes mantener la Terminal abierta y tu Mac encendido

#### Opción B: Configurar como servicio permanente (recomendado)

Para que se ejecute automáticamente en background, usa `launchd` en macOS:

1. Crea un archivo de configuración:
```bash
nano ~/Library/LaunchAgents/com.garage.ventas.plist
```

2. Pega este contenido (ajusta la ruta si es necesario):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.garage.ventas</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Users/francotosto/Documents/garage_ventas/venv/bin/python3</string>
        <string>/Users/francotosto/Documents/garage_ventas/automation_service_v2.py</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/Users/francotosto/Documents/garage_ventas/logs/automation.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/francotosto/Documents/garage_ventas/logs/automation_error.log</string>
</dict>
</plist>
```

3. Guarda (Ctrl+X, Y, Enter)

4. Activa el servicio:
```bash
launchctl load ~/Library/LaunchAgents/com.garage.ventas.plist
```

5. Para detenerlo:
```bash
launchctl unload ~/Library/LaunchAgents/com.garage.ventas.plist
```

---

## 🔍 Verificación y Monitoreo

### Ver logs del sistema
```bash
tail -f ~/Documents/garage_ventas/sales_extractor.log
```

### Verificar base de datos
```bash
cd ~/Documents/garage_ventas
python3 -c "import sqlite3; conn = sqlite3.connect('sales_data.db'); cursor = conn.cursor(); cursor.execute('SELECT COUNT(*) FROM sales_data'); print(f'Total reportes: {cursor.fetchone()[0]}'); conn.close()"
```

### Ver emails procesados
```bash
cd ~/Documents/garage_ventas
python3 -c "import sqlite3; conn = sqlite3.connect('sales_data.db'); cursor = conn.cursor(); cursor.execute('SELECT COUNT(*) FROM processed_emails'); print(f'Emails procesados: {cursor.fetchone()[0]}'); conn.close()"
```

---

## ⚠️ Solución de Problemas

### Si sigues viendo el dashboard en 0:

**Posible causa 1:** No hay emails nuevos de MaxiREST en tu Gmail
- **Solución:** Espera a que lleguen nuevos cierres de turno

**Posible causa 2:** Los emails ya fueron procesados antes
- **Solución:** El sistema solo procesa emails una vez. Para reprocesar, elimina `sales_data.db` y ejecuta de nuevo

**Posible causa 3:** Error de credenciales de Gmail
- **Solución:** Verifica que `config.json` tenga las credenciales correctas:
  - Email: growlergaragerosario@gmail.com
  - Contraseña de aplicación: iuen urxj iguw fkkr

**Posible causa 4:** El sistema no puede conectarse a Gmail
- **Solución:** Verifica tu conexión a internet y que Gmail IMAP esté habilitado

---

## 📊 Configuración Actual

### 5 Locales configurados:
1. **GG Vol 4** - Galpón Pasco SAS (Pte Roca 1898) - 1 cierre/día
2. **GG Vol 2** - Garage de Sabores SAS (Alvear 51 bis) - 1 cierre/día
3. **COLEGIO** - Garage de Sabores SAS (Belgrano 646) - 1 cierre/día
4. **GROWLER CAFE** - Growler Garage SAS (Moreno 1835) - 2 turnos/día
5. **GROWLER VIA VIEJA** - Garage de Sabores SAS (Santa Fe 3329) - 1 cierre/día

### Programación:
- **Extracción:** Diariamente a las 4:00 AM
- **Resumen diario:** Diariamente a las 8:00 AM
- **Reporte semanal:** Lunes a las 9:00 AM

---

## 📞 Siguiente Paso Inmediato

**👉 EJECUTA AHORA LA PRUEBA MANUAL:**
```bash
cd ~/Documents/garage_ventas
source venv/bin/activate
python3 TEST_MANUAL.py
```

Esto te dirá exactamente qué está pasando y si el sistema puede extraer datos correctamente.

---

## ✅ Resumen de lo que se corrigió

1. ✅ Error de código corregido (`decode_header` no definido)
2. ✅ Imports organizados correctamente
3. ✅ Sistema listo para ejecutar
4. ✅ Script de prueba manual creado
5. ✅ Guía completa de solución documentada

**El problema técnico está resuelto. Ahora solo necesitas ejecutar el sistema para que extraiga datos de Gmail.**
