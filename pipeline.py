#!/usr/bin/env python3
"""Pipeline de actualización automática - Growler Garage

Se llama DIRECTO desde el crontab con el python del venv (ruta absoluta):
    pipeline.py ventas    -> extrae ventas de Gmail y publica el dashboard
    pipeline.py margenes  -> sincroniza Excel desde Google Drive y publica la Foto Mensual

Nota: es un .py y no un .sh porque macOS bloquea la cadena cron->bash->python
al leer el venv dentro de Documents (TCC). cron->python directo funciona.
"""
import os
import subprocess
import sys
import urllib.request
from datetime import datetime
from pathlib import Path

PROJECT = Path('/Users/francotosto/Documents/garage_ventas')
DRIVE = Path.home() / ('Library/CloudStorage/GoogleDrive-francototi@gmail.com/'
                       '.shortcut-targets-by-id/1FPzFtpVT-s--OaKjjbCoy7xtmIsBNG--/'
                       'Proyecto Consultoria Growler/1 - GROWLER AREAS CENTRALES')

# Remitos: son Google Sheets (la app de Drive no baja su contenido).
# El export directo funciona solo si el archivo está compartido "cualquiera
# con el enlace"; si no, se mantiene el último snapshot en data_gastos/.
REMITOS = {
    '1a2csZX4xnsfe3bjq-7SH7vXr4_cbkFQ1wcPsvRNnil0': 'MORENO - FC-Remitos - AÑO 2026.xlsx',
    '1q6vgQSZBbrUqLMmwrBEqlu-0vrXrVcRxzpWdqebpEfU': 'VIA VIEJA - FC-Remitos - AÑO 2026.xlsx',
    '1q1TgXwcgOrLautJJrkcC0F_cXj-QQHa6R4YtxIAXEqw': 'COLEGIO - FC-Remitos - AÑO 2026.xlsx',
    '1zLsANvYgE4eRfm9ciD61Hn9DP6C8CnaRYp5_AoWFXtg': 'GG2 - FC-Remitos - AÑO 2026.xlsx',
    '17xD209H8P5uS6q_80j6eeK5J2Qg9RB-EjMeI_WM4iO8': 'GG4 - FC-Remitos - AÑO 2026.xlsx',
}


def git_publish(files, msg):
    subprocess.run(['git', 'add'] + files, cwd=PROJECT)
    subprocess.run(['git', 'commit', '-m', msg], cwd=PROJECT, capture_output=True)
    r = subprocess.run(['git', 'push'], cwd=PROJECT, capture_output=True, text=True)
    if r.returncode != 0:
        print(f"ERROR: fallo el push: {r.stderr.strip()[-200:]}")
    else:
        print("✓ publicado")


def copy_if_changed(src: Path, dest: Path) -> bool:
    # Los archivos del Drive "en la nube" (no descargados) pueden fallar con
    # EDEADLK bajo cron; en ese caso se sigue con el último snapshot local.
    try:
        if not src.exists():
            return False
        data = src.read_bytes()
    except OSError as e:
        print(f"· {src.name}: no se pudo leer del Drive ({e.strerror}) - se usa el snapshot local")
        return False
    if dest.exists() and dest.read_bytes() == data:
        return False
    dest.write_bytes(data)
    print(f"✓ actualizado: {dest.name}")
    return True


def ventas():
    import sales_extractor_v2
    sales_extractor_v2.main()
    git_publish(['dashboard_data.json'], 'auto update')


def margenes():
    print(f"=== margenes {datetime.now():%Y-%m-%d %H:%M} ===")
    if not DRIVE.exists():
        print("ERROR: carpeta de Drive no disponible (¿app de Google Drive corriendo?)")
        sys.exit(1)

    # 1) Liquidaciones de sueldos (xlsx reales; normaliza espacios del nombre)
    try:
        liquidaciones = list((DRIVE / 'Sueldos').glob('GROWLER - Liquidación Sueldos - *2026*.xlsx'))
    except OSError:
        liquidaciones = []
        print("· carpeta Sueldos del Drive no accesible - se usan los snapshots locales")
    for f in liquidaciones:
        clean_name = ' '.join(f.name.replace(' .xlsx', '.xlsx').split())
        copy_if_changed(f, PROJECT / 'data_gastos' / clean_name)

    # 2) Costos Fijos (y futura planilla GASTOS si aparece en el Drive)
    copy_if_changed(DRIVE / 'Costos Fijos' / 'GROWLER - Costos Fijos - AÑO 2026.xlsx',
                    PROJECT / 'data_gastos' / 'GROWLER - Costos Fijos - AÑO 2026.xlsx')
    copy_if_changed(DRIVE / 'Costos Fijos' / 'GROWLER - Gastos - 2026.xlsx',
                    PROJECT / 'data_gastos' / 'GROWLER - Gastos - 2026.xlsx')

    # 3) Remitos (Google Sheets: intenta export directo)
    for file_id, name in REMITOS.items():
        url = f'https://docs.google.com/spreadsheets/d/{file_id}/export?format=xlsx'
        try:
            data = urllib.request.urlopen(url, timeout=60).read()
        except Exception:
            data = b''
        if data[:2] == b'PK':
            dest = PROJECT / 'data_gastos' / name
            if not dest.exists() or dest.read_bytes() != data:
                dest.write_bytes(data)
                print(f"✓ actualizado: {name}")
        else:
            print(f"· remitos {name}: sin acceso público (se usa el último snapshot)")

    # 3b) Movimientos de caja (si Lila la carga en el Drive, viaja a data_gastos)
    copy_if_changed(Path.home() / ('Library/CloudStorage/GoogleDrive-francototi@gmail.com/'
                                   '.shortcut-targets-by-id/1FPzFtpVT-s--OaKjjbCoy7xtmIsBNG--/'
                                   'Proyecto Consultoria Growler/0 - PLANTILLAS V2 (propuesta Franco)/'
                                   'GROWLER - Movimientos de Caja - 2026.xlsx'),
                    PROJECT / 'data_gastos' / 'GROWLER - Movimientos de Caja - 2026.xlsx')

    # 4) Regenerar y publicar si cambió
    import margin_analyzer
    margin_analyzer.main()
    import caja_analyzer
    caja_analyzer.main()
    r = subprocess.run(['git', 'diff', '--quiet', 'dashboard_margin_data.json', 'dashboard_caja_data.json'], cwd=PROJECT)
    if r.returncode != 0:
        git_publish(['dashboard_margin_data.json', 'margenes_analisis_lila.csv', 'dashboard_caja_data.json'],
                    'auto update margins & caja')
    else:
        print("· sin cambios en márgenes/caja")


if __name__ == '__main__':
    os.chdir(PROJECT)
    sys.path.insert(0, str(PROJECT))
    mode = sys.argv[1] if len(sys.argv) > 1 else ''
    if mode == 'ventas':
        ventas()
    elif mode == 'margenes':
        margenes()
    else:
        print("Uso: pipeline.py [ventas|margenes]")
        sys.exit(1)
