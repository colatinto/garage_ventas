#!/usr/bin/env python3
"""
Sistema Automático de Extracción de Ventas - 5 Locales
Extrae datos de emails de MaxiREST y procesa PDFs automáticamente
Version 2.0 - Identificación por campo "Sucursal:" en PDFs
"""

import os
import re
import json
import sqlite3
import smtplib
import imaplib
import email
from email.header import decode_header
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import logging
try:
    import PyPDF2
except ImportError:
    from pypdf import PdfReader as PyPDF2_PdfReader
    # Crear un objeto compatible con PyPDF2
    class PyPDF2:
        PdfReader = PyPDF2_PdfReader

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('sales_extractor.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class SalesDataExtractor:
    """Extractor principal de datos de ventas desde emails y PDFs"""

    def __init__(self, config_file: str = "config.json"):
        """Inicializar el extractor con configuración"""
        self.config = self.load_config(config_file)
        self.db_path = "sales_data.db"
        self.setup_database()
        logger.info("Extractor de ventas inicializado (v2.0)")

    def load_config(self, config_file: str) -> Dict:
        """Cargar configuración desde archivo JSON"""
        default_config = {
            "email": {
                "provider": "gmail",
                "username": "",
                "password": "",
                "imap_server": "imap.gmail.com",
                "imap_port": 993
            },
            "filters": {
                "subject_patterns": [
                    "MaxiREST - Fin de turno",
                    "FINTURNO"
                ],
                "sender_patterns": [
                    "maxi",
                    "resto",
                    "garage"
                ]
            },
            "locations": {
                "GG Vol 4": {
                    "display_name": "GG Vol 4",
                    "business_name": "Galpón Pasco SAS",
                    "address": "Pte Roca 1898",
                    "shifts": 1
                },
                "GG Vol 2": {
                    "display_name": "GG Vol 2",
                    "business_name": "Garage de Sabores SAS",
                    "address": "Alvear 51 bis",
                    "shifts": 1
                },
                "COLEGIO": {
                    "display_name": "COLEGIO",
                    "business_name": "Garage de Sabores SAS",
                    "address": "Belgrano 646",
                    "shifts": 1
                },
                "GROWLER CAFE": {
                    "display_name": "GROWLER CAFE",
                    "business_name": "Growler Garage SAS",
                    "address": "Moreno 1835",
                    "shifts": 2
                },
                "GROWLER VIA VIEJA": {
                    "display_name": "GROWLER VIA VIEJA",
                    "business_name": "Garage de Sabores SAS",
                    "address": "Santa Fe 3329",
                    "shifts": 1
                }
            },
            "alerts": {
                "low_sales_threshold": -15,
                "high_sales_threshold": 25,
                "email_alerts": True,
                "whatsapp_alerts": False
            }
        }

        if os.path.exists(config_file):
            try:
                with open(config_file, 'r', encoding='utf-8') as f:
                    user_config = json.load(f)
                    default_config.update(user_config)
            except Exception as e:
                logger.warning(f"Error cargando config: {e}. Usando defaults.")
        else:
            # Crear archivo de configuración por defecto
            with open(config_file, 'w', encoding='utf-8') as f:
                json.dump(default_config, f, indent=4, ensure_ascii=False)
            logger.info(f"Creado archivo de configuración: {config_file}")

        return default_config

    def setup_database(self):
        """Crear base de datos SQLite para almacenar datos de ventas"""
        # Usar base temporal para evitar disk I/O errors en /mnt/Documents
        import shutil
        import tempfile
        temp_db = 'sales_data_temp.db'

        # Copiar BD existente a temp si existe
        if os.path.exists(self.db_path):
            shutil.copy(self.db_path, temp_db)

        conn = sqlite3.connect(temp_db)
        cursor = conn.cursor()

        # Tabla principal de ventas
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS sales_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date DATE NOT NULL,
            location TEXT NOT NULL,
            shift TEXT,
            total_sales REAL NOT NULL,
            total_tickets INTEGER NOT NULL,
            cash_sales REAL DEFAULT 0,
            card_sales REAL DEFAULT 0,
            transfer_sales REAL DEFAULT 0,
            mercadopago_sales REAL DEFAULT 0,
            other_sales REAL DEFAULT 0,
            salon_sales REAL DEFAULT 0,
            counter_sales REAL DEFAULT 0,
            opening_time TEXT,
            closing_time TEXT,
            closure_number INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(date, location, shift)
        )
        ''')

        # Tabla de alertas
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date DATE NOT NULL,
            location TEXT NOT NULL,
            alert_type TEXT NOT NULL,
            message TEXT NOT NULL,
            severity TEXT DEFAULT 'info',
            sent BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')

        # Tabla de procesamiento de emails
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS processed_emails (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email_id TEXT UNIQUE NOT NULL,
            subject TEXT,
            date_received TIMESTAMP,
            processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')

        # Tabla de productos
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

        # Crear índices para productos
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_products_location ON products(location)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_products_date ON products(date)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_products_name ON products(product_name)')

        conn.commit()
        conn.close()

        # Copiar BD temporal de vuelta a la ubicación original
        shutil.copy(temp_db, self.db_path)
        logger.info("Base de datos configurada correctamente")

    def extract_from_gmail(self) -> List[Dict]:
        """Extraer emails de Gmail usando IMAP"""
        try:
            # Conectar a Gmail
            mail = imaplib.IMAP4_SSL(
                self.config['email']['imap_server'],
                self.config['email']['imap_port']
            )
            mail.login(
                self.config['email']['username'],
                self.config['email']['password']
            )
            mail.select("inbox")

            # Buscar emails de MaxiREST de los últimos 7 días
            since_date = (datetime.now() - timedelta(days=7)).strftime("%d-%b-%Y")
            search_criteria = f'(SINCE "{since_date}" SUBJECT "MaxiREST")'

            status, messages = mail.search(None, search_criteria)
            email_ids = messages[0].split()

            extracted_emails = []
            for email_id in email_ids:  # Procesar todos los emails encontrados

                status, msg_data = mail.fetch(email_id, "(RFC822)")

                for response_part in msg_data:
                    if isinstance(response_part, tuple):
                        email_message = email.message_from_bytes(response_part[1])

                        # Extraer información del email
                        subject = self.decode_email_header(email_message["Subject"])
                        sender = email_message["From"]
                        date_received = email_message["Date"]

                        # Verificar si ya fue procesado
                        if self.is_email_processed(email_id.decode()):
                            continue

                        # Verificar si es un email de MaxiREST
                        if not self.is_maxi_rest_email(subject):
                            continue

                        # Extraer archivos adjuntos (PDFs)
                        attachments = self.extract_attachments(email_message)

                        email_data = {
                            'email_id': email_id.decode(),
                            'subject': subject,
                            'sender': sender,
                            'date_received': date_received,
                            'attachments': attachments
                        }

                        extracted_emails.append(email_data)
                        logger.info(f"Email extraído: {subject}")

            mail.close()
            mail.logout()
            logger.info(f"Extraídos {len(extracted_emails)} emails nuevos")
            return extracted_emails

        except Exception as e:
            logger.error(f"Error extrayendo emails: {e}")
            return []

    def decode_email_header(self, header):
        """Decodificar header de email"""
        if header:
            decoded_header = decode_header(header)[0]
            if decoded_header[1]:
                return decoded_header[0].decode(decoded_header[1])
            else:
                return str(decoded_header[0])
        return ""

    def is_maxi_rest_email(self, subject: str) -> bool:
        """Verificar si el email es de MaxiREST"""
        patterns = self.config['filters']['subject_patterns']
        for pattern in patterns:
            if pattern.lower() in subject.lower():
                return True
        return False

    def is_email_processed(self, email_id: str) -> bool:
        """Verificar si el email ya fue procesado"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM processed_emails WHERE email_id = ?", (email_id,))
        result = cursor.fetchone()
        conn.close()
        return result is not None

    def extract_attachments(self, email_message) -> List[Dict]:
        """Extraer archivos adjuntos PDF del email"""
        attachments = []

        for part in email_message.walk():
            if part.get_content_disposition() == 'attachment':
                filename = part.get_filename()
                if filename and filename.lower().endswith('.pdf'):
                    file_data = part.get_payload(decode=True)

                    # Guardar archivo temporalmente
                    temp_dir = Path("temp_pdfs")
                    temp_dir.mkdir(exist_ok=True)
                    temp_path = temp_dir / f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{filename}"

                    with open(temp_path, 'wb') as f:
                        f.write(file_data)

                    attachments.append({
                        'filename': filename,
                        'path': str(temp_path),
                        'size': len(file_data)
                    })

                    logger.info(f"PDF extraído: {filename}")

        return attachments

    def parse_pdf_data(self, pdf_path: str) -> Dict:
        """Extraer datos del PDF de MaxiREST"""
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text()

            # Identificar ubicación PRIMERO (por Sucursal:)
            location = self.identify_location(text)

            # Parsear datos usando expresiones regulares
            sales_data = self.parse_sales_text(text)
            sales_data['location'] = location

            # Extraer productos
            products = self.parse_products_from_text(text)
            sales_data['products'] = products

            # Guardar productos en BD si hay datos completos
            if products and sales_data.get('date') and sales_data.get('location'):
                self.save_products_data(
                    products,
                    sales_data['date'],
                    sales_data['location'],
                    sales_data.get('shift', 'Único')
                )

            logger.info(f"Datos extraídos del PDF: {location} ({len(products)} productos)")
            return sales_data

        except Exception as e:
            logger.error(f"Error procesando PDF {pdf_path}: {e}")
            return {}

    def identify_location(self, text: str) -> str:
        """Identificar ubicación del local por campo 'Sucursal:' en PDF"""
        # Buscar el campo "Sucursal:" en el texto
        sucursal_match = re.search(r'Sucursal:\s+([^\n]+)', text, re.IGNORECASE)

        if sucursal_match:
            sucursal_code = sucursal_match.group(1).strip()

            # Mapear códigos de sucursal a nuestros nombres internos
            # IMPORTANTE: Orden específico → genérico (los más específicos primero)
            sucursal_mapping = {
                'GG Vol 4': 'GG Vol 4',
                'GROWLER VV': 'GROWLER VIA VIEJA',  # Específico primero
                'GROWLER VIA VIEJA': 'GROWLER VIA VIEJA',
                'GROWLER CAFE': 'GROWLER CAFE',
                'GROWLER': 'GROWLER CAFE',  # Genérico al final
                'COLEGIO': 'COLEGIO',
                'GG': 'GG Vol 2',
            }

            for key, value in sucursal_mapping.items():
                if key.upper() in sucursal_code.upper():
                    logger.info(f"Ubicación identificada por Sucursal: {sucursal_code} → {value}")
                    return value

            # Si no coincide exactamente, intentar identificar por dirección
            logger.warning(f"Código de sucursal no reconocido: {sucursal_code}")

        # Fallback: intentar identificar por dirección
        if "PTE ROCA" in text.upper() or "PTE ROCA 1898" in text.upper():
            return "GG Vol 4"
        elif "ALVEAR 51" in text.upper():
            return "GG Vol 2"
        elif "BELGRANO 646" in text.upper():
            return "COLEGIO"
        elif "MORENO 1835" in text.upper():
            return "GROWLER CAFE"
        elif "SANTA FE 3329" in text.upper():
            return "GROWLER VIA VIEJA"

        return "unknown"

    def parse_sales_text(self, text: str) -> Dict:
        """Parsear datos de ventas del texto del PDF"""
        data = {}

        # Extraer fecha
        date_match = re.search(r'(\w+)\s+(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})', text)
        if date_match:
            day_name, day, month_name, year = date_match.groups()
            months = {
                'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4,
                'mayo': 5, 'junio': 6, 'julio': 7, 'agosto': 8,
                'septiembre': 9, 'octubre': 10, 'noviembre': 11, 'diciembre': 12
            }
            month_num = months.get(month_name.lower(), 1)
            data['date'] = f"{year}-{month_num:02d}-{int(day):02d}"

        # Extraer turno - Mejorado para capturar variantes
        shift_match = re.search(r'Turno\s+\d+\s+\[([^\]]+)\]', text, re.IGNORECASE)
        if shift_match:
            shift_text = shift_match.group(1).strip().lower()
            # Normalizar nombres de turnos
            if 'tarde' in shift_text:
                data['shift'] = 'Tarde'
            elif 'noche' in shift_text or 'madrugada' in shift_text:
                data['shift'] = 'Noche'
            elif 'manana' in shift_text or 'mañana' in shift_text:
                data['shift'] = 'Mañana'
            else:
                data['shift'] = shift_text.capitalize()
        else:
            data['shift'] = 'Único'

        # Extraer horarios
        opening_match = re.search(r'Apertura:\s+(\d{2}:\d{2})', text)
        closing_match = re.search(r'Cierre:\s+(\d{2}:\d{2})', text)
        data['opening_time'] = opening_match.group(1) if opening_match else None
        data['closing_time'] = closing_match.group(1) if closing_match else None

        # Extraer número de cierre
        closure_match = re.search(r'Cierre\s+n\|\s+(\d+)', text)
        data['closure_number'] = int(closure_match.group(1)) if closure_match else None

        # Extraer ventas totales - Buscar en sección "RESUMEN DE VENTAS"
        total_match = re.search(r'TOTAL\s+([\d.,]+)\s+(\d+)', text)
        if total_match:
            sales_str = total_match.group(1).replace('.', '').replace(',', '')
            data['total_sales'] = float(sales_str)
            data['total_tickets'] = int(total_match.group(2))
        else:
            data['total_sales'] = 0
            data['total_tickets'] = 0

        # Extraer ventas por forma de pago
        efectivo_match = re.search(r'Efectivo\s+([\d.,]+)', text)
        data['cash_sales'] = float(efectivo_match.group(1).replace('.', '').replace(',', '')) if efectivo_match else 0

        tarjetas_match = re.search(r'Tarjetas\s+([\d.,]+)', text)
        data['card_sales'] = float(tarjetas_match.group(1).replace('.', '').replace(',', '')) if tarjetas_match else 0

        transfer_match = re.search(r'Transferencia\s+([\d.,]+)', text)
        data['transfer_sales'] = float(transfer_match.group(1).replace('.', '').replace(',', '')) if transfer_match else 0

        mp_match = re.search(r'MERCADOPAGO\s+([\d.,]+)', text)
        data['mercadopago_sales'] = float(mp_match.group(1).replace('.', '').replace(',', '')) if mp_match else 0

        otros_match = re.search(r'Otros\s+([\d.,]+)', text)
        data['other_sales'] = float(otros_match.group(1).replace('.', '').replace(',', '')) if otros_match else 0

        # Extraer ventas por canal
        salon_match = re.search(r'Salón\s+([\d.,]+)', text)
        data['salon_sales'] = float(salon_match.group(1).replace('.', '').replace(',', '')) if salon_match else 0

        mostrador_match = re.search(r'Mostrador\s+([\d.,]+)', text)
        data['counter_sales'] = float(mostrador_match.group(1).replace('.', '').replace(',', '')) if mostrador_match else 0

        return data

    def parse_products_from_text(self, text: str) -> List[Dict]:
        """Extraer productos individuales del texto del PDF"""
        products = []

        # Buscar la sección de productos (después de TOTALES:)
        # Patrón para productos: código + nombre + cantidad + total
        # Ejemplo:  401 Ensalada Pollo    1.0      14600.00
        product_pattern = r'^\s*(\d{3,4})\s+([A-Za-z].{10,40}?)\s+([\d.]+)\s+([\d.,]+)$'

        # Buscar también el rubro/categoría actual
        category_pattern = r'Rubro:\s*\d+\s*-\s*([A-Z\s]+)'

        current_category = None

        for line in text.split('\n'):
            # Detectar cambio de categoría
            category_match = re.search(category_pattern, line)
            if category_match:
                current_category = category_match.group(1).strip()
                continue

            # Intentar parsear producto
            product_match = re.match(product_pattern, line)
            if product_match:
                code = product_match.group(1)
                name = product_match.group(2).strip()
                quantity = float(product_match.group(3))
                total_str = product_match.group(4).replace('.', '').replace(',', '')
                total = float(total_str)

                # Filtrar productos del sistema (propinas, menú personal, etc.)
                if code not in ['269', '654'] and quantity > 0:
                    products.append({
                        'product_code': code,
                        'product_name': name,
                        'category': current_category,
                        'quantity': quantity,
                        'total_amount': total
                    })

        return products

    def save_products_data(self, products: List[Dict], date: str, location: str, shift: str):
        """Guardar datos de productos en la base de datos"""
        if not products or not date or not location:
            return

        # Copiar BD a ubicación temporal para evitar disk I/O errors
        import shutil
        temp_db = 'sales_data_temp.db'
        shutil.copy(self.db_path, temp_db)

        conn = sqlite3.connect(temp_db)
        cursor = conn.cursor()

        try:
            for product in products:
                cursor.execute('''
                    INSERT OR REPLACE INTO products
                    (date, location, shift, product_code, product_name, category, quantity, total_amount)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    date,
                    location,
                    shift,
                    product['product_code'],
                    product['product_name'],
                    product.get('category'),
                    product['quantity'],
                    product['total_amount']
                ))

            conn.commit()
            logger.info(f"Guardados {len(products)} productos de {location} - {date}")

        except Exception as e:
            logger.error(f"Error guardando productos: {e}")
        finally:
            conn.close()

        # Copiar de vuelta
        shutil.copy(temp_db, self.db_path)

    def save_sales_data(self, sales_data: Dict):
        """Guardar datos de ventas en la base de datos"""
        if not sales_data.get('date') or not sales_data.get('location'):
            logger.warning("Datos incompletos, no se guardan")
            return

        # Usar base temporal para evitar disk I/O errors
        import shutil
        temp_db = 'sales_data_temp.db'
        shutil.copy(self.db_path, temp_db)

        conn = sqlite3.connect(temp_db)
        cursor = conn.cursor()

        # Preparar datos para inserción
        fields = [
            'date', 'location', 'shift', 'total_sales', 'total_tickets',
            'cash_sales', 'card_sales', 'transfer_sales', 'mercadopago_sales', 'other_sales',
            'salon_sales', 'counter_sales', 'opening_time', 'closing_time', 'closure_number'
        ]

        values = [sales_data.get(field, None) for field in fields]
        placeholders = ', '.join(['?' for _ in fields])

        try:
            cursor.execute(f'''
                INSERT OR REPLACE INTO sales_data
                ({', '.join(fields)})
                VALUES ({placeholders})
            ''', values)

            conn.commit()
            logger.info(f"Datos guardados: {sales_data['location']} - {sales_data['date']} ({sales_data.get('shift', 'N/A')})")

        except Exception as e:
            logger.error(f"Error guardando datos: {e}")
        finally:
            conn.close()

        # Copiar de vuelta
        shutil.copy(temp_db, self.db_path)

    def mark_email_processed(self, email_data: Dict):
        """Marcar email como procesado"""
        # Usar base temporal para evitar disk I/O errors
        import shutil
        temp_db = 'sales_data_temp.db'
        shutil.copy(self.db_path, temp_db)

        conn = sqlite3.connect(temp_db)
        cursor = conn.cursor()

        cursor.execute('''
            INSERT OR IGNORE INTO processed_emails
            (email_id, subject, date_received)
            VALUES (?, ?, ?)
        ''', (email_data['email_id'], email_data['subject'], email_data['date_received']))

        conn.commit()
        conn.close()

        # Copiar de vuelta
        shutil.copy(temp_db, self.db_path)

    def analyze_and_generate_alerts(self):
        """Analizar datos y generar alertas automáticas"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # Obtener ventas de los últimos 7 días por ubicación
        cursor.execute('''
            SELECT location, date, total_sales
            FROM sales_data
            WHERE date >= date('now', '-7 days')
            ORDER BY location, date
        ''')

        recent_sales = cursor.fetchall()

        # Calcular promedios y detectar anomalías
        location_data = {}
        for location, date, sales in recent_sales:
            if location not in location_data:
                location_data[location] = []
            location_data[location].append(sales)

        alerts = []
        for location, sales in location_data.items():
            if len(sales) < 2:
                continue

            avg_sales = sum(sales[:-1]) / len(sales[:-1]) if len(sales) > 1 else sales[0]
            latest_sales = sales[-1]
            change_percent = ((latest_sales - avg_sales) / avg_sales) * 100 if avg_sales > 0 else 0

            threshold_low = self.config['alerts']['low_sales_threshold']
            threshold_high = self.config['alerts']['high_sales_threshold']

            if change_percent <= threshold_low:
                alerts.append({
                    'location': location,
                    'alert_type': 'low_sales',
                    'message': f'{location}: Ventas {change_percent:.1f}% por debajo del promedio',
                    'severity': 'warning'
                })
            elif change_percent >= threshold_high:
                alerts.append({
                    'location': location,
                    'alert_type': 'high_sales',
                    'message': f'{location}: Excelente! Ventas {change_percent:.1f}% por encima del promedio',
                    'severity': 'success'
                })

        # Guardar alertas
        for alert in alerts:
            cursor.execute('''
                INSERT INTO alerts (date, location, alert_type, message, severity)
                VALUES (date('now'), ?, ?, ?, ?)
            ''', (alert['location'], alert['alert_type'], alert['message'], alert['severity']))

        conn.commit()
        conn.close()

        logger.info(f"Generadas {len(alerts)} alertas")
        return alerts

    def export_dashboard_data(self) -> str:
        """Exportar datos para el dashboard en formato JSON"""
        # Usar base temporal para evitar disk I/O errors
        import shutil
        temp_db = 'sales_data_temp.db'
        shutil.copy(self.db_path, temp_db)

        conn = sqlite3.connect(temp_db)
        cursor = conn.cursor()

        # Datos de los últimos 30 días
        cursor.execute('''
            SELECT * FROM sales_data
            WHERE date >= date('now', '-30 days')
            ORDER BY date DESC
        ''')

        sales_data = []
        for row in cursor.fetchall():
            sales_data.append({
                'id': row[0], 'date': row[1], 'location': row[2], 'shift': row[3],
                'total_sales': row[4], 'total_tickets': row[5], 'cash_sales': row[6],
                'card_sales': row[7], 'transfer_sales': row[8], 'mercadopago_sales': row[9],
                'other_sales': row[10], 'salon_sales': row[11], 'counter_sales': row[12],
                'opening_time': row[13], 'closing_time': row[14], 'closure_number': row[15]
            })

        # Alertas activas
        cursor.execute('''
            SELECT * FROM alerts
            WHERE date >= date('now', '-7 days')
            ORDER BY created_at DESC
        ''')

        alerts = []
        for row in cursor.fetchall():
            alerts.append({
                'id': row[0], 'date': row[1], 'location': row[2], 'alert_type': row[3],
                'message': row[4], 'severity': row[5], 'sent': row[6]
            })

        # Top 5 productos por local (por cantidad vendida)
        top_products_by_location = {}
        for location in self.config['locations'].keys():
            cursor.execute('''
                SELECT product_name, SUM(quantity) as total_qty, SUM(total_amount) as total_amount
                FROM products
                WHERE location = ?
                GROUP BY product_name
                ORDER BY total_qty DESC
                LIMIT 5
            ''', (location,))

            products = []
            for row in cursor.fetchall():
                products.append({
                    'name': row[0],
                    'quantity': row[1],
                    'total_amount': row[2]
                })

            if products:
                top_products_by_location[location] = products

        conn.close()

        dashboard_data = {
            'sales_data': sales_data,
            'alerts': alerts,
            'top_products': top_products_by_location,
            'last_updated': datetime.now().isoformat(),
            'locations': self.config['locations']
        }

        # Guardar en archivo JSON para el dashboard
        output_path = "dashboard_data.json"
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(dashboard_data, f, indent=2, ensure_ascii=False, default=str)

        logger.info("Datos exportados para dashboard")
        return output_path

    def run_extraction_cycle(self):
        """Ejecutar ciclo completo de extracción"""
        logger.info("=== Iniciando ciclo de extracción ===")

        try:
            # 1. Extraer emails
            emails = self.extract_from_gmail()

            # 2. Procesar cada email y sus PDFs
            processed_count = 0
            for email_data in emails:
                for attachment in email_data['attachments']:
                    sales_data = self.parse_pdf_data(attachment['path'])
                    if sales_data and sales_data.get('location') != 'unknown':
                        self.save_sales_data(sales_data)
                        processed_count += 1

                    # Limpiar archivo temporal
                    try:
                        os.remove(attachment['path'])
                    except:
                        pass

                # Marcar email como procesado
                self.mark_email_processed(email_data)

            # 3. Generar alertas
            alerts = self.analyze_and_generate_alerts()

            # 4. Exportar datos para dashboard
            dashboard_file = self.export_dashboard_data()

            logger.info(f"=== Ciclo completado: {processed_count} reportes procesados ===")

            return {
                'emails_processed': len(emails),
                'reports_processed': processed_count,
                'alerts_generated': len(alerts),
                'dashboard_updated': True,
                'dashboard_file': dashboard_file
            }

        except Exception as e:
            logger.error(f"Error en ciclo de extracción: {e}")
            return {'error': str(e)}

def main():
    """Función principal para ejecutar el extractor"""
    print("🚀 Sistema de Extracción de Ventas v2.0 - 5 Locales")
    print("=" * 60)

    extractor = SalesDataExtractor()

    # Verificar si tenemos configuración de email
    if not extractor.config['email']['username']:
        print("\n⚠️  CONFIGURACIÓN REQUERIDA:")
        print("1. Edita el archivo 'config.json'")
        print("2. Agrega tu email y contraseña de aplicación")
        print("3. Para Gmail, usa una contraseña de aplicación (no tu contraseña normal)")
        print("\nGenerando archivo de configuración...")
        return

    # Ejecutar extracción
    result = extractor.run_extraction_cycle()

    if 'error' in result:
        print(f"❌ Error: {result['error']}")
    else:
        print(f"✅ Procesamiento completado:")
        print(f"   📧 Emails procesados: {result['emails_processed']}")
        print(f"   📊 Reportes procesados: {result['reports_processed']}")
        print(f"   🚨 Alertas generadas: {result['alerts_generated']}")
        print(f"   📈 Dashboard actualizado: {result['dashboard_updated']}")
        print(f"\n📁 Datos disponibles en: {result['dashboard_file']}")

if __name__ == "__main__":
    main()
