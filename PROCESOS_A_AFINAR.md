# Growler Garage — Procesos a afinar (documento de trabajo Franco + Lila)

**Fecha:** 20/07/2026 · Para revisar juntos, decidir y firmar abajo.

## Cómo leer este documento

El sistema técnico ya funciona solo: ventas cada hora, márgenes y caja todas
las mañanas, reporte diario por mail a las 9:00. **Lo único que puede hacer
que mienta es la carga.** Acá están los 7 procesos que la sostienen, cada uno
con su dueño, su regla de oro y cómo se controla. La reunión es para ajustar
lo que haga falta y comprometer los dueños.

---

## P1 · Remitos y estados de pago 🔴 URGENTE

**Dueños:** encargados (carga) + Lila (pagos)

**Estado actual:** el dashboard muestra **$66M de deuda a proveedores, $60M
vencida (252 facturas)** — solo a Minga, GG2 le debe +$10M desde febrero.
Primero hay que saber si ese número es real o es carga desactualizada.

**Para la reunión:**
- [ ] Lila valida los 10 pendientes más grandes (están en la página Caja).
  ¿Se deben de verdad o están pagos y nadie actualizó el estado?
- [ ] Si son reales → plan de pagos. Si no → el proceso de actualizar estados
  está roto y hay que definir quién lo mantiene.

**Reglas de oro:**
1. Toda mercadería que entra = remito cargado ese mismo día, con proveedor
   del desplegable (cuando entre Remitos v2) y fecha real.
2. Nada se paga sin remito cargado. **Lila no autoriza pagos de lo que no ve.**
3. Cada pago se registra el día que se hace (estado + fecha + monto).

**Control:** la página Caja se actualiza sola cada mañana; el reporte diario
muestra la deuda. Si el número no baja cuando pagan, la carga está atrasada.

---

## P2 · Registro diario de personal (GG2/GG4) 🔴 URGENTE

**Dueños:** encargados de GG2 y GG4

**Estado actual:** GG2 paga ~$2,5M/mes de jornales que no figuran en ningún
registro (la planilla de horas de junio tiene 0 celdas cargadas). Hoy ese
costo está *estimado a mano* en el dashboard.

**Para la reunión:**
- [ ] Confirmar quiénes son los encargados responsables de cada bar.
- [ ] Convertir a Google Sheets las dos plantillas (están en PLANTILLAS V2)
  y compartírselas con permiso de edición.
- [ ] Fijar fecha de arranque (propuesta: lunes que viene).

**Regla de oro:** una fila por persona por día, al cierre, desde el celular
(~2 minutos). **Jornal que no está en el registro, no se paga.**

**Control:** cuando el registro ande, el dashboard reemplaza el estimado de
$2,5M por el dato real, y aparece el costo laboral por día/turno.

---

## P3 · Planilla GASTOS + posición de IVA 🟡 IMPORTANTE

**Dueña:** Lila

**Estado actual:** la planilla GASTOS v2 está lista con enero-junio migrado
(352 registros), pero Lila sigue cargando en la vieja "COSTOS FIJOS Y OG".
Además la posición de IVA está sub-cargada: hay ~$10M registrados en el
semestre cuando la posición real ronda los ~$127M — es la distorsión más
grande que queda en los márgenes.

**Para la reunión:**
- [ ] Recorrer juntos la planilla nueva (desplegables, sin % manuales). ¿Le
  falta algo para su operatoria? Ajusto lo que pida.
- [ ] Definir fecha de corte: desde ese día se carga solo en GASTOS v2.
- [ ] IVA: acordar con Juan Manuel que la posición mensual (devengada, se
  pague o no) se cargue todos los meses como categoría "AFIP IVA".
- [ ] Enero y febrero: ¿los costos de esos meses existen en otro lado o se
  reconstruyen? (hoy tienen 1 fila cada uno).

**Regla de oro:** un gasto = una fila, todo de desplegables, mes devengado.
Gastos centrales → local "ADM CENTRAL" (el sistema los reparte 40/30/20/5/5).

**Control:** checklist mensual del dashboard (ver P6).

---

## P4 · Liquidación de sueldos 🟡 IMPORTANTE

**Dueño:** Juan Manuel (con Lila)

**Estado actual:** la planilla es buena, pero: hubo DNIs pegados como montos
($47M de error), los sueldos de administración están duplicados (liquidación
Y costos), y los nombres de archivo son inconsistentes.

**Para la reunión (después coordinar con Juan Manuel):**
- [ ] Sacar las filas 'adm' del RESUMEN LOCALES (van solo en GASTOS).
- [ ] Agregar 3 validaciones a su plantilla: monto máximo $5M por celda,
  local con desplegable, empleado desde lista.
- [ ] Nombre de archivo fijo: `GROWLER - Liquidación Sueldos - <MES> 2026.xlsx`
  (sin espacios extra).
- [ ] Cerrar la liquidación del mes antes del día 5 del mes siguiente.

**Control:** el sistema ya avisa cuando una liquidación viene vacía o con
montos sospechosos.

---

## P5 · Movimientos de Caja (la mitad que falta) 🔴 URGENTE

**Dueña:** Lila (con datos de los socios)

**Estado actual:** los retiros de socios, pagos de deuda vieja e inversión
en GG3 no se registran en ningún lado — por eso no se puede responder "dónde
está la plata". La planilla ya existe: **"GROWLER - Movimientos de Caja -
2026"** en PLANTILLAS V2 (fecha, tipo, quién, monto, detalle).

**Para la reunión:**
- [ ] Reconstruir el semestre grueso aunque sea aproximado: total retirado
  por cada socio, total pagado de deuda vieja, total invertido en GG3.
- [ ] De acá en adelante: todo movimiento se carga la semana que ocurre.

**Regla de oro:** si salió plata del negocio y no es un gasto operativo,
va en Movimientos. Sin excepciones, sin importar el socio.

**Control:** cuando esté cargada, la página Caja muestra la conciliación:
margen del mes → a dónde fue.

---

## P6 · Cierre mensual (el ritual) 🟢 ORDENA TODO

**Dueña:** Lila · **Cuándo:** día 5 de cada mes

Checklist de cierre del mes anterior — 15 minutos:

1. ✅ Remitos completos en los 5 bares (última fecha ≈ fin de mes)
2. ✅ Liquidación de sueldos cerrada (Juan Manuel)
3. ✅ GASTOS del mes cargados, incluida posición de IVA
4. ✅ Movimientos de caja del mes cargados
5. ✅ Estados de pago actualizados (la deuda de la página Caja es real)
6. ✅ Mirar la Foto Mensual: si un margen da raro (>40% o negativo), buscar
   qué falta ANTES de creerle

**Para la reunión:** [ ] acordar el día y que el reporte del día 5 le llegue
a Lila como recordatorio (lo automatizo).

---

## P7 · GG3 nace con el sistema bueno 🟢 OPORTUNIDAD

**Para la reunión:** [ ] decidir que GG3 (Funes) arranca directo con:
Remitos v2, registro diario de personal, y sus reportes MaxiREST entrando
al dashboard desde el día uno. Es el único bar que puede nacer sin vicios —
configurarlo me lleva un día una vez que esté definido el local en MaxiREST.

---

# Decisiones que tienen que salir de la reunión

| # | Decisión | Respuesta |
|---|---|---|
| 1 | ¿La deuda de $66M es real? (validar top 10) | |
| 2 | Fecha de corte para GASTOS v2 | |
| 3 | Fecha de arranque del registro diario GG2/GG4 y responsables | |
| 4 | ¿Quién carga la posición de IVA mensual y cuándo? | |
| 5 | ¿Se reconstruyen los movimientos de caja del semestre? ¿Quién junta los datos? | |
| 6 | Feedback de Lila sobre Remitos v2: ¿se pilotea en GG2/GG4? | |
| 7 | Día de cierre mensual acordado | |

# Ritmo de trabajo propuesto

- **Diario (encargados):** remitos del día + registro de personal → 5 min
- **Semanal (Lila):** estados de pago + gastos + movimientos de caja → 30 min
- **Mensual (Lila, día 5):** checklist de cierre P6 → 15 min
- **Mensual (socios):** reunión con la Foto Mensual y Caja en pantalla

# Los 30 días que vienen

**Semana 1:** validar deuda (P1) + arrancar registro diario (P2)
**Semana 2:** corte a GASTOS v2 (P3) + reconstrucción de movimientos (P5)
**Semana 3:** IVA mensual + ajustes de liquidación con Juan Manuel (P3/P4)
**Semana 4:** primer cierre mensual completo con checklist (P6) → julio
cerrado con datos confiables de punta a punta

---

*Links: Ventas → colatinto.github.io/garage_ventas/dashboard_pro.html ·
Foto Mensual → /dashboard_margin.html · Caja → /dashboard_caja.html ·
Plantillas → Drive: "0 - PLANTILLAS V2 (propuesta Franco)"*
