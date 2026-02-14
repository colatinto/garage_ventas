# 🌐 Compartir Dashboard con Socios - Guía Completa

## Opción 1: GitHub Pages (GRATIS - Recomendado) 🎯

### Ventajas:
- ✅ Totalmente gratis
- ✅ Link permanente que funciona 24/7
- ✅ Se actualiza automáticamente cuando subís cambios
- ✅ No requiere servidor propio

### Pasos:

#### 1. Crear cuenta en GitHub (si no tenés)
- Andá a https://github.com
- Click en "Sign up"
- Usá un email que revises (te va a servir después)

#### 2. Instalar GitHub Desktop (opcional, más fácil)
- Descargá de: https://desktop.github.com
- Instalalo en tu Mac
- Iniciá sesión con tu cuenta de GitHub

#### 3. Crear un repositorio

**Opción A: Con GitHub Desktop (más fácil)**
1. Abrí GitHub Desktop
2. File → New Repository
   - Name: `garage-dashboard`
   - Local Path: Tu carpeta de Documents
   - ✅ Initialize with README
3. Click "Create Repository"

**Opción B: Desde el sitio web**
1. En github.com, click en el "+" arriba a la derecha
2. New repository
3. Nombre: `garage-dashboard`
4. Public
5. ✅ Add a README file
6. Create repository

#### 4. Subir los archivos

**Preparar los archivos:**

```bash
cd ~/Documents/garage_ventas

# Copiar solo los archivos necesarios a una carpeta nueva
mkdir dashboard_web
cp dashboard_pro.html dashboard_web/index.html
cp dashboard_data.json dashboard_web/
```

**Subir con GitHub Desktop:**
1. En GitHub Desktop, click en "Repository" → "Show in Finder"
2. Copiá los archivos de `dashboard_web` a esta carpeta
3. En GitHub Desktop verás los cambios
4. Escribí un mensaje: "Dashboard inicial"
5. Click "Commit to main"
6. Click "Push origin"

**O subir desde el sitio web:**
1. En tu repositorio en github.com
2. Click "Add file" → "Upload files"
3. Arrastrá `index.html` y `dashboard_data.json`
4. Click "Commit changes"

#### 5. Activar GitHub Pages

1. En tu repositorio en github.com
2. Settings (arriba a la derecha)
3. En el menú izquierdo: "Pages"
4. Source: `main` branch, carpeta `/ (root)`
5. Save

**¡Listo!** En 1-2 minutos tu dashboard estará online en:
```
https://TU-USUARIO.github.io/garage-dashboard/
```

#### 6. Compartir con tus socios

Mandales el link: `https://TU-USUARIO.github.io/garage-dashboard/`

Ellos solo necesitan abrir ese link en cualquier navegador (computadora, celular, tablet).

---

## Opción 2: Netlify (Alternativa, también GRATIS)

### Ventajas:
- ✅ Aún más fácil que GitHub
- ✅ Drag & drop de archivos
- ✅ Link automático
- ✅ Se puede conectar un dominio custom

### Pasos:

1. Andá a https://app.netlify.com
2. Sign up (podés usar tu cuenta de GitHub)
3. Click "Add new site" → "Deploy manually"
4. Arrastrá la carpeta `dashboard_web` (con index.html y dashboard_data.json)
5. ¡Listo! Te da un link como: `https://random-name-123.netlify.app`

**Para actualizar:**
- Solo arrastrá de nuevo los archivos actualizados

---

## 🔄 Actualizar el Dashboard Automáticamente

Para que tus socios vean siempre los datos frescos, necesitás actualizar `dashboard_data.json` regularmente.

### Opción A: Script automático (Recomendado)

Creá este script en `~/Documents/garage_ventas/actualizar_web.sh`:

```bash
#!/bin/bash
cd ~/Documents/garage_ventas

# Extraer datos nuevos
source venv/bin/activate
python3 -c "
from sales_extractor_v2 import SalesDataExtractor
e = SalesDataExtractor('config.json')
e.export_dashboard_data()
print('✅ Dashboard actualizado')
"

# Copiar a carpeta web
cp dashboard_data.json dashboard_web/

# Subir a GitHub (si usás GitHub Pages)
cd dashboard_web
git add dashboard_data.json
git commit -m "Actualización automática $(date)"
git push

echo "✅ Dashboard online actualizado"
```

Hacelo ejecutable:
```bash
chmod +x ~/Documents/garage_ventas/actualizar_web.sh
```

### Opción B: Ejecutar el servicio de automatización

El servicio `automation_service_v2.py` que ya tenés puede ejecutar esto automáticamente cada día a las 4 AM.

Agregá al final del método `run_scheduled_extraction` en `automation_service_v2.py`:

```python
# Actualizar dashboard web
os.system('cd ~/Documents/garage_ventas && ./actualizar_web.sh')
```

---

## 📱 Acceso desde Celular

El dashboard funciona perfecto en celulares. Tus socios pueden:

1. Abrir el link en Safari/Chrome en el celu
2. Agregar a Home Screen:
   - Safari: Compartir → "Agregar a pantalla de inicio"
   - Chrome: Menú → "Agregar a pantalla de inicio"
3. ¡Ahora tienen un icono del dashboard como si fuera una app!

---

## 🔒 Seguridad / Privacidad

### Dashboard Público (GitHub/Netlify gratis):
- ⚠️ Cualquiera que tenga el link puede ver los datos
- El link no es "adivinable" pero no está protegido por password

### Si necesitás privacidad:

**Opción 1: Link "secreto" de Netlify**
- Netlify te da un link random difícil de adivinar
- Solo compartilo con tus socios por WhatsApp/Email
- Si se filtra, podés cambiar el link

**Opción 2: Proteger con password (Netlify Pro - pago)**
- $19/mes
- Podés agregar usuario/password
- https://www.netlify.com/pricing/

**Opción 3: Hostear en tu propio servidor**
- Requiere conocimientos técnicos
- Podés usar Heroku, DigitalOcean, AWS, etc.

---

## 🎨 Personalizar el Dashboard para Compartir

Antes de compartir, podés hacer estos ajustes en `dashboard_pro.html`:

1. **Cambiar el título:**
   ```html
   <title>Garage Bars - Dashboard de Ventas</title>
   ```

2. **Agregar logo:**
   Buscá la línea con `<h1>` y agregá un logo si querés.

3. **Ocultar datos sensibles:**
   Si querés que NO vean ciertos datos (ej: desglose de métodos de pago), comentá esas secciones en el HTML.

---

## 🆘 Troubleshooting

**"Mi dashboard no muestra datos"**
- Verificá que `dashboard_data.json` esté en la misma carpeta que `index.html`
- Refrescá con Cmd+Shift+R

**"El link de GitHub Pages no funciona"**
- Esperá 2-3 minutos después de activar Pages
- Verificá en Settings → Pages que esté activado

**"Los datos no se actualizan"**
- Tenés que subir el nuevo `dashboard_data.json` cada vez
- Considerá usar el script de actualización automática

**"Mis socios ven datos viejos"**
- Que hagan Cmd+Shift+R (refresh forzado)
- O abrirlo en modo incógnito

---

## 📊 Resumen

### Para compartir rápido (5 minutos):
1. Usá Netlify
2. Arrastrá los archivos
3. Mandá el link

### Para mantenerlo actualizado:
1. Usá el script `actualizar_web.sh`
2. Ejecutalo después de cada extracción de datos
3. O agregalo al `automation_service_v2.py`

### Link para tus socios:
- GitHub Pages: `https://TU-USUARIO.github.io/garage-dashboard/`
- Netlify: `https://tu-nombre-123.netlify.app/`

¡Tus socios van a poder ver el dashboard desde cualquier lugar, en cualquier dispositivo, 24/7! 🚀
