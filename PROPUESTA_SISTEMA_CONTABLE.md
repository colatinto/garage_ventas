# Propuesta: sistema de carga contable Growler Garage

**Fecha:** 02/07/2026
**Para:** Franco y Lila

---

## 1. Diagnóstico: qué encontré en las planillas actuales

Analicé archivo por archivo las planillas de Sueldos, Costos Fijos y Remitos.
El diseño general es razonable (la liquidación de sueldos en particular está
bien pensada), pero hay problemas de **carga y estructura** que hacen
imposible tener una foto confiable sin trabajo manual:

### Problemas de datos encontrados (ejemplos reales)

| # | Problema | Ejemplo concreto |
|---|----------|------------------|
| 1 | DNI pegado como monto | Marcela Giunta figura con sueldo $47.287.014 = su DNI. Igual Dante Rosso ($45.830.685) |
| 2 | Fechas imposibles en remitos | VIA VIEJA tiene remitos del 16/05/**2006** y del 19/10/2026 (futuro). COLEGIO tiene del 11/12/2026 |
| 3 | Meses sin cargar | Costos Fijos: enero tiene 1 fila, febrero 1 fila (marzo tiene 109) |
| 4 | Falta un archivo entero | No existe FC-Remitos 2026 de GG4 (solo 2025) → GG4 aparece sin costo de mercadería todo el año |
| 5 | Fórmulas rotas | GG2 tiene un remito con `#REF!` en Línea P&L; liquidación de junio sin ningún valor calculado |
| 6 | 49 categorías de gasto distintas, con duplicados | 'CleanCity' y 'Servicios de Limpieza' (lo mismo), 'AFIP 931' y 'AFIP 931 Administración', 4 categorías distintas 'Sueldos Administracion: <nombre>', 'Pintas Tato Growler' |
| 7 | Locales escritos a mano | 'adm', 'ADM', 'masa salarial' conviven como "local" en sueldos |
| 8 | % de distribución tipeado fila por fila | 52 filas con porcentajes manuales (40%/30%/20%...) que deberían salir de una sola regla |

### Problemas de diseño (los más graves)

**A. El mismo gasto puede estar en dos lugares (doble conteo)**
- Los sueldos de administración están en la liquidación (filas 'adm') **y**
  en Costos Fijos ('Sueldos Administracion: Lila' = $1.359.000, mismo valor).
- Vacaciones/liquidaciones finales aparecen como filas 'Sueldos' en Costos
  Fijos, pero la liquidación ya tiene columnas para eso.
- 'Mantenimiento', 'Limpieza', 'Gastos Personal' existen como línea P&L en
  los remitos **y** como categoría en Costos Fijos. Nadie sabe dónde va cada cosa.

**B. Los resúmenes pisan la historia**
Las hojas "Resumen Costos Fijos P&L" y "Check por cuenta" muestran solo el
mes seleccionado (hoy: Mayo). No queda registro de los meses anteriores;
cada mes se pisa el anterior.

**C. Los totales dependen de fórmulas encadenadas (VLOOKUP entre hojas)**
Si un nombre no matchea exacto en 'RRHH Valor Hora', el total da error o
cero en silencio. Y al exportar a CSV se pierde todo.

**D. No está definido el tratamiento del IVA**
Las ventas de MaxiREST y los remitos están (aparentemente) con IVA incluido,
y además se paga 'AFIP IVA' / 'IVA B' como gasto. Mezclar las dos cosas
infla o deforma el margen. Hay que elegir un criterio (ver punto 4).

---

## 2. Propuesta (opción recomendada): ajustar, no refundar

La liquidación de sueldos y los remitos **se mantienen** — funcionan bien si
se cargan completos. Lo que se reemplaza es la planilla de Costos Fijos y se
agregan reglas de carga. El sistema queda así:

```
┌─────────────────┐   ┌──────────────────┐   ┌──────────────────┐   ┌───────────┐
│ MaxiREST (mail) │   │ Liquidación      │   │ FC-Remitos       │   │ GASTOS    │
│ → ingresos      │   │ Sueldos (Lila,   │   │ (1 por local,    │   │ (planilla │
│   automáticos   │   │ igual que hoy)   │   │ igual que hoy)   │   │  NUEVA)   │
└────────┬────────┘   └────────┬─────────┘   └────────┬─────────┘   └─────┬─────┘
         │                     │                      │                   │
         └─────────────────────┴──────────┬───────────┴───────────────────┘
                                          ▼
                        Script automático (ya funciona hoy)
                                          ▼
                     Dashboard de márgenes + control de faltantes
```

### 2.1 Lo que NO cambia para Lila
- La liquidación de sueldos: misma planilla. El sistema lee la columna
  **"TOTAL COSTO SALARIAL (P&L)"** que ya existe y está bien armada.
- Los remitos por local: misma planilla.

### 2.2 Lo que SÍ cambia (5 reglas)

1. **Nueva planilla GASTOS** (reemplaza la hoja "COSTOS FIJOS Y OG"):
   una fila = un gasto, con **desplegables** en Mes, Local, Categoría y
   Forma de pago. Sin porcentajes manuales: los gastos de ADM Central se
   cargan como local "ADM CENTRAL" y el sistema los reparte solo
   (40/30/20/5/5). Ya armé la plantilla: `GROWLER - Gastos - PLANTILLA.xlsx`.

2. **Lista cerrada de categorías** (~22 en vez de 49). La lista vive en la
   pestaña PARAMETROS de la plantilla; si hace falta una nueva, se agrega
   ahí (no se inventa al cargar).

3. **Cada gasto vive en UN solo lugar:**
   - Mercadería y compras a proveedores → **Remitos** (como hoy)
   - Sueldos de locales (incl. vacaciones, SAC, liquidaciones) → **Liquidación**
   - Sueldos de administración → **GASTOS** (local ADM CENTRAL), y se
     eliminan las filas 'adm' del resumen de liquidación
   - Todo lo demás (alquileres, servicios, impuestos, eventos...) → **GASTOS**

4. **Validaciones en remitos:** fecha con formato controlado (rechazar años
   ≠ 2026), Línea P&L con desplegable. Y crear ya el archivo GG4 2026.

5. **Cierre mensual con checklist** (lo genera el sistema automáticamente):
   al cierre de cada mes tienen que estar los 4 componentes por local:
   ingresos ✓ / remitos ✓ / liquidación ✓ / gastos ✓. Si falta algo, el
   dashboard lo muestra en rojo en vez de calcular un margen mentiroso.

---

## 3. Alternativa (opción B): refundar todo en una sola planilla anual

Un solo archivo "GROWLER Contabilidad 2026" con 4 pestañas planas
(INGRESOS / COMPRAS / SUELDOS / GASTOS) y todo lo demás calculado.
Es más prolijo en el largo plazo, pero obliga a Lila a cambiar toda su
operatoria y a migrar los remitos (3.900+ filas). **No lo recomiendo ahora**:
la opción A logra el 90% del resultado cambiando solo una planilla.

---

## 4. Decisiones que hay que tomar (no son técnicas)

1. **IVA**: hoy comparamos ventas con IVA contra costos con IVA y además
   restamos los pagos de AFIP. Consultarlo con el contador. Propuesta
   simple mientras tanto: todo bruto (como está) y los pagos de IVA/AFIP
   como categoría IMPUESTOS separada, así al menos se ve cuánto pesa.
2. **La regla 40/30/20/5/5 de ADM Central**: ¿es fija o debería ser
   proporcional a la facturación de cada local? (Hoy COLEGIO recibe el 20%
   del costo central pero factura ~8% del total: eso le come el margen.)
3. **GG2 casi no tiene sueldos cargados** ($1,3M/mes vs $7M de GG4):
   ¿el personal de GG2 se liquida en otro lado o falta cargarlo?

---

## 5. Estado actual de la foto (con lo que hay cargado)

Márgenes calculados con sueldos correctos (columna TOTAL COSTO SALARIAL):

| Local | Ene | Feb | Mar | Abr | May | Jun |
|-------|-----|-----|-----|-----|-----|-----|
| CAFE | 41% | 41% | **24%** | **34%** | **37%** | 51%* |
| VIA VIEJA | 58% | 43% | **25%** | **39%** | **26%** | 44%* |
| COLEGIO | 24% | 31% | **21%** | **15%** | **1%** | 47%* |
| GG2 | 52% | 48% | **19%** | **35%** | **39%** | 35%* |
| GG4 | 87%† | 82%† | 59%† | 52%† | 54%† | 62%*† |

- **Negrita** = meses con datos más completos → ya dan cerca del 20-30% real
- Ene-Feb inflados porque casi no hay costos cargados
- † GG4 inflado todo el año porque falta su archivo de remitos 2026
- \* Junio sin liquidación de sueldos todavía

**Conclusión:** el sistema de cálculo ya funciona; lo que falta es que los
datos entren completos y sin errores. Con las 5 reglas del punto 2.2, la
foto mensual sale sola.
