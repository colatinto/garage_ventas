#!/usr/bin/env python3
"""
Servicio de Automatización v2.0 - 5 Locales
Ejecuta el extractor de ventas automáticamente UNA VEZ POR DÍA a las 4:00 AM
"""

import time
import schedule
import logging
from datetime import datetime
from sales_extractor_v2 import SalesDataExtractor

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('automation_service.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class AutomationService:
    """Servicio que automatiza la extracción de datos de ventas"""

    def __init__(self):
        self.extractor = SalesDataExtractor()
        logger.info("Servicio de automatización inicializado (v2.0)")

    def run_scheduled_extraction(self):
        """Ejecutar extracción programada - UNA VEZ POR DÍA"""
        logger.info(f"=== Extracción automática iniciada: {datetime.now()} ===")

        try:
            result = self.extractor.run_extraction_cycle()

            if 'error' in result:
                logger.error(f"Error en extracción: {result['error']}")
            else:
                logger.info(f"Extracción completada exitosamente:")
                logger.info(f"  - Emails: {result['emails_processed']}")
                logger.info(f"  - Reportes: {result['reports_processed']}")
                logger.info(f"  - Alertas: {result['alerts_generated']}")
                logger.info(f"  - Dashboard: {result['dashboard_file']}")

        except Exception as e:
            logger.error(f"Error inesperado en extracción: {e}")

    def send_daily_summary(self):
        """Enviar resumen diario de ventas"""
        logger.info("Enviando resumen diario")
        # TODO: Implementar envío de resumen por email
        pass

    def send_weekly_report(self):
        """Enviar reporte semanal"""
        logger.info("Enviando reporte semanal")
        # TODO: Implementar reporte semanal
        pass

    def start_service(self):
        """Iniciar el servicio de automatización"""
        logger.info("🚀 Iniciando servicio de automatización v2.0")

        # Programar tareas
        # IMPORTANTE: Extracción UNA VEZ POR DÍA a las 4:00 AM
        schedule.every().day.at("04:00").do(self.run_scheduled_extraction)
        schedule.every().day.at("08:00").do(self.send_daily_summary)
        schedule.every().monday.at("09:00").do(self.send_weekly_report)

        # Ejecutar una extracción inmediata al inicio (opcional, comentar para solo usar scheduler)
        logger.info("Ejecutando extracción inicial...")
        self.run_scheduled_extraction()

        # Loop principal
        logger.info("Servicio en funcionamiento. Presiona Ctrl+C para detener.")
        logger.info("📅 Programación:")
        logger.info("  - Extracción: Diariamente a las 4:00 AM")
        logger.info("  - Resumen diario: Diariamente a las 8:00 AM")
        logger.info("  - Reporte semanal: Lunes a las 9:00 AM")

        try:
            while True:
                schedule.run_pending()
                time.sleep(60)  # Verificar cada minuto

        except KeyboardInterrupt:
            logger.info("Servicio detenido por el usuario")
        except Exception as e:
            logger.error(f"Error en el servicio: {e}")

def main():
    """Función principal"""
    print("🤖 Servicio de Automatización v2.0 - 5 Locales")
    print("=" * 60)
    print("Este servicio extraerá automáticamente los datos de ventas")
    print("de tus emails DIARIAMENTE A LAS 4:00 AM")
    print()

    service = AutomationService()
    service.start_service()

if __name__ == "__main__":
    main()
