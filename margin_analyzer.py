#!/usr/bin/env python3
"""
Sistema de Análisis de Margen - Growler Garage
Consolida: Ingresos (BD) + Gastos (FC REMITOS) + Sueldos + Costos Fijos
"""

import csv
import json
import sqlite3
from collections import defaultdict
from datetime import datetime
from pathlib import Path

# Configuración
PROJECT_DIR = Path(__file__).parent
DATA_GASTOS_DIR = PROJECT_DIR / 'data_gastos'
DB_PATH = PROJECT_DIR / 'sales_data.db'
OUTPUT_FILE = PROJECT_DIR / 'dashboard_margin_data.json'

# Mapeo de locales
LOCATION_MAP = {
    'MORENO': 'GROWLER CAFE',
    'VIA VIEJA': 'GROWLER VIA VIEJA',
    'COLEGIO': 'COLEGIO',
    'GG2': 'GG Vol 2',
    'GG4': 'GG Vol 4'
}

def parse_number(s):
    """Parsea números con formato argentino"""
    if not s or s.strip() == '' or s.strip() == '-':
        return 0
    s = s.replace('$', '').replace('.', '').replace(',', '.').strip()
    try:
        return float(s)
    except:
        return 0

def extract_month(date_str):
    """Extrae mes de fecha formato DD/MM/YYYY"""
    try:
        d = datetime.strptime(date_str.strip(), '%d/%m/%Y')
        return d.strftime('%Y-%m')
    except:
        return None

def read_fc_remitos():
    """Lee gastos de mercadería de FC REMITOS por local y mes"""
    cmv_by_local_month = defaultdict(lambda: defaultdict(float))

    # Datos extraídos de archivos FC-Remitos CSV (con linea_pl = 'CMV')
    # Nota: GG4 no tiene datos de 2026 (archivo es de 2025)
    cmv_data = {
        '2026-01': {
            'GROWLER CAFE': 23_633_503,
            'GROWLER VIA VIEJA': 12_952_685,
            'COLEGIO': 722_584,
            'GG Vol 2': 16_873_051,
            'GG Vol 4': 0  # Sin datos 2026
        },
        '2026-02': {
            'GROWLER CAFE': 25_557_924,
            'GROWLER VIA VIEJA': 16_179_494,
            'COLEGIO': 3_759_046,
            'GG Vol 2': 16_506_535,
            'GG Vol 4': 0  # Sin datos 2026
        },
        '2026-03': {
            'GROWLER CAFE': 28_947_372,
            'GROWLER VIA VIEJA': 18_361_036,
            'COLEGIO': 5_047_517,
            'GG Vol 2': 19_173_817,
            'GG Vol 4': 0  # Sin datos 2026
        },
        '2026-04': {
            'GROWLER CAFE': 28_033_555,
            'GROWLER VIA VIEJA': 15_810_879,
            'COLEGIO': 4_813_331,
            'GG Vol 2': 19_498_265,
            'GG Vol 4': 0  # Sin datos 2026
        },
        '2026-05': {
            'GROWLER CAFE': 25_573_755,
            'GROWLER VIA VIEJA': 17_294_143,
            'COLEGIO': 8_059_912,
            'GG Vol 2': 11_362_215,
            'GG Vol 4': 0  # Sin datos 2026
        },
        '2026-06': {
            'GROWLER CAFE': 23_537_691,
            'GROWLER VIA VIEJA': 14_698_285,
            'COLEGIO': 3_957_147,
            'GG Vol 2': 12_611_969,
            'GG Vol 4': 0  # Sin datos 2026
        }
    }

    for month, locals_dict in cmv_data.items():
        for local, amount in locals_dict.items():
            cmv_by_local_month[local][month] = amount

    return cmv_by_local_month

def read_costos_fijos():
    """Lee costos fijos por local y mes desde COSTOS FIJOS Y OG

    Distribuye ADM Central según: MORENO 40%, VIA VIEJA 30%, COLEGIO 20%, GG2 5%, GG4 5%
    """
    costos_by_local_month = defaultdict(lambda: defaultdict(float))

    # Datos extraídos de 'COSTOS FIJOS Y OG' sheet
    # Locales + ADM Central por distribuir
    costos_data = {
        '2026-01': {
            'GROWLER CAFE': 0,
            'GROWLER VIA VIEJA': 0,
            'COLEGIO': 0,
            'GG Vol 2': 0,
            'GG Vol 4': 0,
            'ADM Central': 292_000
        },
        '2026-02': {
            'GROWLER CAFE': 0,
            'GROWLER VIA VIEJA': 0,
            'COLEGIO': 0,
            'GG Vol 2': 0,
            'GG Vol 4': 0,
            'ADM Central': 292_000
        },
        '2026-03': {
            'GROWLER CAFE': 8_714_461,
            'GROWLER VIA VIEJA': 6_950_327,
            'COLEGIO': 1_094_844,
            'GG Vol 2': 3_406_808,
            'GG Vol 4': 7_469_649,
            'ADM Central': 11_697_381
        },
        '2026-04': {
            'GROWLER CAFE': 7_027_069,
            'GROWLER VIA VIEJA': 6_426_617,
            'COLEGIO': 1_102_188,
            'GG Vol 2': 2_566_819,
            'GG Vol 4': 6_306_938,
            'ADM Central': 11_332_749
        },
        '2026-05': {
            'GROWLER CAFE': 7_634_501,
            'GROWLER VIA VIEJA': 7_164_935,
            'COLEGIO': 1_576_134,
            'GG Vol 2': 5_641_368,
            'GG Vol 4': 5_878_495,
            'ADM Central': 11_411_785
        },
        '2026-06': {
            'GROWLER CAFE': 14_843_001,
            'GROWLER VIA VIEJA': 10_516_416,
            'COLEGIO': 2_454_729,
            'GG Vol 2': 8_460_820,
            'GG Vol 4': 10_133_908,
            'ADM Central': 4_864_984
        }
    }

    # Distribución de ADM Central
    adm_distribution = {
        'GROWLER CAFE': 0.40,
        'GROWLER VIA VIEJA': 0.30,
        'COLEGIO': 0.20,
        'GG Vol 2': 0.05,
        'GG Vol 4': 0.05
    }

    for month, locals_dict in costos_data.items():
        adm_amount = locals_dict.get('ADM Central', 0)

        for local, amount in locals_dict.items():
            if local != 'ADM Central':
                # Sumar costos directos + porción de ADM Central
                adm_portion = adm_amount * adm_distribution.get(local, 0)
                costos_by_local_month[local][month] = amount + adm_portion

    return costos_by_local_month

def read_sueldos():
    """Lee sueldos por local y mes desde liquidaciones de Lila"""
    sueldos_by_local_month = defaultdict(lambda: defaultdict(float))

    # Datos extraídos de archivos Excel RESUMEN LOCALES (usando openpyxl con data_only=True)
    sueldos_data = {
        '2026-01': {
            'GROWLER CAFE': 14_192_188,
            'GROWLER VIA VIEJA': 5_003_300,
            'COLEGIO': 1_332_750,
            'GG Vol 2': 2_320_000,
            'GG Vol 4': 3_386_000
        },
        '2026-02': {
            'GROWLER CAFE': 12_777_342,
            'GROWLER VIA VIEJA': 5_432_200,
            'COLEGIO': 2_045_125,
            'GG Vol 2': 2_320_000,
            'GG Vol 4': 4_370_000
        },
        '2026-03': {
            'GROWLER CAFE': 15_977_738,
            'GROWLER VIA VIEJA': 6_327_396,
            'COLEGIO': 3_258_733,
            'GG Vol 2': 2_600_000,
            'GG Vol 4': 4_326_050
        },
        '2026-04': {
            'GROWLER CAFE': 15_993_084,
            'GROWLER VIA VIEJA': 0,  # Sin datos en archivo
            'COLEGIO': 0,             # Sin datos en archivo
            'GG Vol 2': 1_300_000,
            'GG Vol 4': 4_461_650
        },
        '2026-05': {
            'GROWLER CAFE': 15_382_817,
            'GROWLER VIA VIEJA': 6_552_264,
            'COLEGIO': 2_984_729,
            'GG Vol 2': 1_300_000,
            'GG Vol 4': 4_461_650
        },
        '2026-06': {  # Junio aún sin datos
            'GROWLER CAFE': 0,
            'GROWLER VIA VIEJA': 0,
            'COLEGIO': 0,
            'GG Vol 2': 0,
            'GG Vol 4': 0
        }
    }

    for month, locals_dict in sueldos_data.items():
        for local, amount in locals_dict.items():
            sueldos_by_local_month[local][month] = amount

    return sueldos_by_local_month

def read_ingresos():
    """Lee ingresos de la BD SQLite"""
    ingresos_by_local_month = defaultdict(lambda: defaultdict(float))

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('''
            SELECT date, location, SUM(total_sales) as sales
            FROM sales_data
            GROUP BY date, location
            ORDER BY date
        ''')

        for date_str, location, sales in cursor.fetchall():
            date_obj = datetime.strptime(date_str, '%Y-%m-%d')
            month = date_obj.strftime('%Y-%m')
            ingresos_by_local_month[location][month] += sales

        conn.close()
    except Exception as e:
        print(f"Error leyendo ingresos: {e}")

    return ingresos_by_local_month

def calculate_margins():
    """Calcula márgenes por local y mes"""
    ingresos = read_ingresos()
    cmv = read_fc_remitos()
    costos = read_costos_fijos()
    sueldos = read_sueldos()

    margin_data = {}

    for local in LOCATION_MAP.values():
        margin_data[local] = {}

        for month in sorted(set(list(ingresos[local].keys()) + list(cmv[local].keys()))):
            ing = ingresos[local].get(month, 0)
            cmv_val = cmv[local].get(month, 0)
            costos_val = costos[local].get(month, 0)
            sueldos_val = sueldos[local].get(month, 0)  # Datos reales por mes

            margen = ing - cmv_val - costos_val - sueldos_val
            margen_pct = (margen / ing * 100) if ing > 0 else 0

            margin_data[local][month] = {
                'ingresos': round(ing, 2),
                'cmv': round(cmv_val, 2),
                'costos_fijos': round(costos_val, 2),
                'sueldos': round(sueldos_val, 2),
                'margen': round(margen, 2),
                'margen_pct': round(margen_pct, 2)
            }

    return margin_data

def main():
    print("📊 Analizando márgenes...")

    margins = calculate_margins()

    # Guardar en JSON
    output = {
        'last_updated': datetime.now().isoformat(),
        'margins': margins
    }

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"✓ Datos guardados en {OUTPUT_FILE}")

    # Mostrar resumen
    print("\n" + "=" * 80)
    print("RESUMEN DE MÁRGENES")
    print("=" * 80)

    for local, months in margins.items():
        print(f"\n{local}:")
        for month in sorted(months.keys()):
            data = months[month]
            print(f"  {month}: Margen ${data['margen']:>12,.0f} ({data['margen_pct']:>6.1f}%)")

if __name__ == '__main__':
    main()
