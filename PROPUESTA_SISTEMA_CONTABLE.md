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
| 2 | Fechas imposibles en remitos | VIA VIEJA tiene remitos del 16/05/**2006** y del 19/10/2026 (futuro). GG4 2026 tiene números de factura pegados en columnas de fecha |
| 3 | Meses sin cargar | Costos Fijos: enero tiene 1 fila, febrero 1 fila (marzo tiene 109) |
| 4 | Fórmulas rotas | GG2 tiene un remito con `#REF!` en Línea P&L; liquidación de junio sin ningún valor calculado |
| 5 | 49 categorías de gasto distintas, con duplicados | 'CleanCity' y 'Servicios de Limpieza' (lo mismo), 'AFIP 931' y 'AFIP 931 Administración', 4 categorías distintas 'Sueldos Administracion: <nombre>' |
| 6 | Locales escritos a mano | 'adm', 'ADM', 'masa salarial' conviven como "local" en sueldos |
| 7 | % de distribución tipeado fila por fila | 52 filas con porcentajes manuales que salen de una sola regla (40/30/20/5/5) |

### Problemas de diseño (los más graves)

**A. El mismo gasto puede estar en dos lugares (doble conteo)**
- Sueldos de administración: en la liquidación (filas 'adm') **y** en Costos
  Fijos ('Sueldos Administracion: Lila' = $1.359.000, mismo valor).
- Vacaciones/liquidaciones finales: como filas 'Sueldos' en Costos Fijos,
  pero la liquidación ya tiene columnas para eso.
- 'Mantenimiento', 'Limpieza', 'Gastos Personal' existen como línea P&L en
  los remitos **y** como categoría en Costos Fijos.

**B. Los resúmenes pisan la historia**
Las hojas "Resumen Costos Fijos P&L" y "Check por cuenta" muestran solo el
mes seleccionado. Cada mes se pisa el anterior; no queda registro.

**C. Los totales dependen de fórmulas encadenadas (VLOOKUP entre hojas)**
Si un nombre no matchea exacto en 'RRHH Valor Hora', el total da error o
cero en silencio.

---

## 2. Decisiones ya tomadas (02/07/2026)

1. **IVA — ingresos y compras quedan brutos (con IVA), y los pagos de
   IVA/AFIP se cargan como gasto.** Matemáticamente eso equivale al margen
   neto real (el pago de IVA es exactamente la diferencia entre el IVA de
   ventas y el crédito de compras). **Condición para que funcione: la
   posición de IVA tiene que cargarse TODOS los meses** — hoy hay ~$1-3M/mes
   cargados de IVA cuando la posición real de un negocio que factura ~$250M
   brutos mensuales es mucho mayor. Si hay deuda o planes de pago, cargar
   igual el devengado del mes (aunque no se pague) o el margen queda inflado.

2. **La distribución de ADM Central es 40% Moreno / 30% Via Vieja /
   20% Colegio / 5% GG2 / 5% GG4.** Decidido y ya implementado en el sistema.

3. **GG4 2026: archivo de remitos recibido e integrado.** Sus márgenes
   pasaron de un irreal 87-93% a 7-21% (ver tabla abajo).

4. **GG2 y GG4 tienen registración deficiente** → protocolo simple para el
   encargado (punto 4).

---

## 3. Propuesta: ajustar, no refundar

La liquidación de sueldos y los remitos **se mantienen** — funcionan bien si
se cargan completos. Lo que se reemplaza es la planilla de Costos Fijos:

```
┌─────────────────┐   ┌──────────────────┐   ┌──────────────────┐   ┌───────────┐
│ MaxiREST (mail) │   │ Liquidación      │   │ FC-Remitos       │   │ GASTOS    │
│ → ingresos      │   │ Sueldos (Lila,   │   │ (1 por local,    │   │ (planilla │
│   automáticos   │   │ igual que hoy)   │   │ igual que hoy)   │   │  NUEVA)   │
└────────┬────────┘   └────────┬─────────┘   └────────┬─────────┘   └─────┬─────┘
         └─────────────────────┴──────────┬───────────┴───────────────────┘
                                          ▼
                        Script automático (ya funciona hoy)
                                          ▼
                     Dashboard de márgenes + control de faltantes
```

### Las 5 reglas

1. **Nueva planilla GASTOS** (reemplaza "COSTOS FIJOS Y OG"): una fila = un
   gasto, con **desplegables** en Mes, Local, Categoría y Forma de pago.
   Sin porcentajes manuales: los gastos centrales se cargan con local
   "ADM CENTRAL" y el sistema los reparte solo.
   → Ya está armada: `GROWLER - Gastos - PLANTILLA 2026.xlsx`
   → Y ya migré los 352 gastos existentes con totales verificados:
     `GROWLER - Gastos - 2026 (migrado).xlsx` — Lila sigue cargando ahí
     desde julio, no tiene que recargar nada.

2. **Lista cerrada de 23 categorías** (antes: 49 variantes). Vive en la
   pestaña PARAMETROS; si falta una, se agrega ahí, no se inventa al cargar.

3. **Cada gasto vive en UN solo lugar:**
   - Mercadería y compras a proveedores → **Remitos**
   - Sueldos de locales (incl. vacaciones, SAC, liquidaciones) → **Liquidación**
   - Sueldos de administración → **GASTOS** (local ADM CENTRAL), y se
     eliminan las filas 'adm' del resumen de liquidación
   - Todo lo demás (alquileres, servicios, impuestos, eventos) → **GASTOS**

4. **Validaciones en remitos**: fecha con formato controlado (rechazar años
   ≠ 2026 — hoy hay remitos de 2006 y de meses futuros), Línea P&L con
   desplegable.

5. **Cierre mensual con checklist automático**: por cada local y mes tienen
   que estar los 4 componentes: ingresos ✓ / remitos ✓ / liquidación ✓ /
   gastos ✓ (incluida la posición de IVA). Si falta algo, el dashboard lo
   marca en vez de calcular un margen mentiroso.

---

## 4. Protocolo mínimo para el encargado de GG2/GG4

La registración de GG2 es deficiente y GG4 venía igual. Regla simple y
controlable:

1. **Toda mercadería que entra = un remito cargado ese mismo día** en la
   planilla del local (proveedor, fecha, total, línea P&L del desplegable).
2. **Nada se paga sin remito cargado.** Si Lila no lo ve en la planilla,
   no autoriza el pago. (Este es el verdadero control: le conviene cargarlo.)
3. Los sueldos de GG2 hoy figuran $1,3M/mes contra $7M de GG4 — falta
   personal en la liquidación o se paga por otro canal. Definir con Lila
   dónde se registra y sostenerlo.

---

## 5. La foto actual (con sueldos y GG4 corregidos)

| Local | Ene* | Feb* | Mar | Abr | May | Jun** |
|-------|------|------|-----|-----|-----|-------|
| CAFE | 41% | 41% | **24%** | **34%** | **37%** | 51% |
| VIA VIEJA | 58% | 43% | **25%** | **39%** | **26%** | 44% |
| COLEGIO | 24% | 31% | **21%** | **15%** | **1%** | 47% |
| GG2 | 52% | 48% | **19%** | **35%** | **39%** | 35% |
| GG4 | 48% | 43% | **21%** | **7%** | **20%** | 15% |

- **Negrita** = meses con datos completos → dan la zona del 20% real
- \* Ene-Feb inflados: costos casi sin cargar (1 fila cada mes)
- \** Junio sin liquidación de sueldos todavía
- Meses completos aún algo inflados por el IVA sub-cargado (punto 2.1)

**Pendientes de carga (en orden de impacto):**
1. Posición de IVA mensual completa (afecta todos los meses)
2. Costos fijos de enero y febrero
3. Liquidación de junio
4. Sueldos reales de GG2

**Conclusión:** el motor de cálculo ya funciona y lee todo automáticamente.
Con la planilla nueva de GASTOS + el protocolo de carga, la foto mensual
sale sola y confiable.
