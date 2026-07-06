# Informe: plantillas de administración Growler Garage → nivel profesional

**Fecha:** 06/07/2026 · **Para validar con:** Franco (antes de generar archivos)

---

# FASE 1 — DIAGNÓSTICO

Relevé las 4 familias de plantillas del Drive ("Proyecto Consultoria Growler"):

## 1.1 FC-Remitos (una por bar y año — compras de mercadería)

**Qué captura:** proveedor, fecha recepción, comprobante, total, IVA, vencimiento,
pago, estado, forma de pago, línea P&L. Hojas: Mapping, Paso a paso, LOCAL
(la de carga), MAESTRO proveedores, ADM P&L.

**Lo bueno:** la estructura es **idéntica en los 5 bares** (17 columnas iguales
— verificado). Existe un MAESTRO de proveedores con 77 proveedores y todos
tienen línea P&L asignada. El diseño de base es correcto.

**Problemas encontrados (con ejemplos reales):**

| Problema | Evidencia | Impacto |
|---|---|---|
| Proveedor escrito a mano (texto libre) en LOCAL, aunque existe el maestro | 49 variantes en Moreno, 39 en VV | roto el vínculo con línea P&L → clasificación manual |
| Línea P&L tipeada por fila en vez de salir del maestro | GG2 tiene un `#REF!`; GG4 filas sin línea | CMV mal clasificado |
| Fechas sin validación | remitos del año **2006**, de octubre y diciembre 2026 (futuro), números de factura pegados en columna fecha | meses fantasma en el dashboard |
| Headers en fila 2, fila 1 con una fecha suelta | las 5 planillas | parsing frágil |
| Volumen de carga muy dispar | Moreno 1.982 remitos vs GG2 427 | GG2/GG4 subregistran compras |

**Parseabilidad hoy: 6/10.** El pipeline ya las lee, pero cada error de fecha
o clasificación pasa en silencio.

## 1.2 Liquidación de Sueldos (una por mes — la arma Juan Manuel)

**Qué captura:** por empleado: categoría, valor hora, horas, local, DNI,
modalidad, adelantos/jornales/feriados/licencias, y la columna Z
"TOTAL COSTO SALARIAL (P&L)" que es la que consume el dashboard.

**Lo bueno:** es la plantilla mejor diseñada. La columna Z ya resuelve el
costo total real. Hay maestro de tarifas (RRHH Valor Hora: categoría → valor).

**Problemas:**

| Problema | Evidencia | Impacto |
|---|---|---|
| Todo depende de VLOOKUP por nombre exacto | "Matías De Angelis" sin categoría → total en blanco silencioso | sueldos que desaparecen |
| DNI pegado en columna de monto | Marcela Giunta $47.287.014 (su DNI); Dante Rosso ídem | 47M de error en un mes |
| Local a texto libre | 'adm', 'ADM', 'masa salarial' como "local" | filas inclasificables |
| Sueldos ADM duplicados | están acá Y en Costos Fijos con el mismo valor | doble conteo |
| Un archivo nuevo por mes, nombres inconsistentes | "JUNIO 2026 .xlsx" (espacio antes del punto) | globs frágiles |

**Parseabilidad hoy: 7/10** (leyendo col Z con data_only).

## 1.3 Hs Reales - Pagos Personal (una por bar y MES — la base de la liquidación)

**Qué captura:** entrada/salida diaria por empleado, pagos, resúmenes.
Es el "registro diario de personal" que pide la Fase 3 — **ya existe**, pero:

| Problema | Evidencia | Impacto |
|---|---|---|
| Matriz horizontal de **122 columnas** (3 por empleado) | GG4 junio | imposible de cargar desde celular; hay que scrollear a buscar tu columna |
| GG2 directamente no la carga | junio 2026: **0 celdas** de entrada/salida | los ~$2,5M/mes de jornales de GG2 no existen en ningún registro |
| Archivos duplicados del mismo mes | GG2 tiene DOS archivos de junio y DOS de mayo, nombres distintos ("JUNIO 2026 - GG2" y "JUNIO 2026- GG2") | nadie sabe cuál vale |
| 12 archivos pre-creados por año × 5 bares + carpeta por año | 60+ archivos/año | mantenimiento absurdo |
| Base Empleados repetida en cada archivo mensual | sin DNI cargado en GG4 | maestro desactualizado en 60 lugares |

**Parseabilidad hoy: 3/10.** Es la peor de todas y es la fuente del principal
agujero de datos (jornales GG2/GG4).

## 1.4 Costos Fijos / GASTOS (central — la carga Lila)

Ya diagnosticada en detalle (PROPUESTA_SISTEMA_CONTABLE.md): 49 categorías
duplicadas, % manuales, meses vacíos, resúmenes que pisan historia.
**La plantilla GASTOS v2 ya está construida y con los 352 registros migrados**
— falta que Lila la adopte.

**Parseabilidad hoy: 5/10 → v2: 9/10.**

---

# FASE 2 — PROPUESTA

## Principio rector
No refundar: **misma lógica de trabajo, menos tipeo**. Todo lo que hoy se
escribe a mano y ya existe en un maestro pasa a desplegable o a fórmula
protegida. Una fila = un registro, headers en fila 1, sin celdas combinadas
en zonas de datos, un archivo por AÑO (no por mes).

## 2.1 MAESTROS (hoja compartida, dueña: Lila)
Un archivo único "GROWLER - MAESTROS" con 4 pestañas:
- **PROVEEDORES**: nombre, CUIT, línea P&L, forma de pago habitual (ya existe dentro de cada remito; se unifica)
- **CATEGORIAS_GASTO**: las 23 de la plantilla GASTOS
- **EMPLEADOS**: nombre, DNI, bar, categoría, modalidad (hoy repetido en 60 archivos de Hs Reales + liquidación)
- **LOCALES y reglas** (distribución ADM 40/30/20/5/5)

Cada plantilla operativa lleva una copia de su pestaña relevante (los
desplegables locales son más robustos que IMPORTRANGE); el pipeline avisa si
una copia quedó desactualizada respecto del maestro.

## 2.2 Remitos v2 (por bar, un archivo por año)
La carga del encargado queda en **6 campos, 4 con desplegable**:

| Campo | Cómo |
|---|---|
| FECHA | validada: solo año en curso, no futura |
| PROVEEDOR | desplegable del maestro |
| COMPROBANTE | desplegable (Remito/Factura A/B/C/Ticket) |
| NÚMERO | texto |
| TOTAL $ | número validado > 0 |
| FORMA DE PAGO | desplegable |

**Línea P&L, IVA proveedor y estado de pago salen solos** (fórmula protegida
que busca en el maestro / la completa Lila). El encargado ya no clasifica nada.
Columnas de gestión de pago (vencimiento, pagado, pendiente) quedan en zona
"solo Lila" protegida.

## 2.3 Liquidación de Sueldos v2 (cambios mínimos — es de Juan Manuel)
1. Columna Local → desplegable (se eliminan 'adm'/'ADM': los sueldos de
   administración viven en GASTOS).
2. Validación en columnas de montos: rechazar valores > $5M (mata el
   error del DNI pegado).
3. Empleado → desplegable desde maestro EMPLEADOS (mata el VLOOKUP roto).
4. Nombre de archivo normalizado: `GROWLER - Liquidación Sueldos - 2026-07.xlsx`.

## 2.4 GASTOS v2
Ya construida y migrada. Sin cambios: entra en el plan de adopción.

---

# FASE 3 — REGISTRO DIARIO DE PERSONAL (GG2/GG4)

**Reemplaza** a "Hs Reales - Pagos Personal" en GG2/GG4 (no convive: un solo
lugar de carga). Un archivo por bar por AÑO, una sola pestaña de carga.

**Formato log — una fila = una persona en un día:**

| FECHA | EMPLEADO ▾ | ENTRADA | SALIDA | HORAS (auto) | TURNO ▾ | ENCARGADO ▾ |
|---|---|---|---|---|---|---|
| 05/07 | Timoteo Flores | 17:30 | 01:00 | 7,5 | Noche | Franco T. |
| 05/07 | Delfina Urquidi | 19:00 | 00:00 | 5,0 | Noche | Franco T. |

**Por qué así:**
- Desde el celular (app de Google Sheets) es agregar N filas al final —
  nada de buscar tu columna entre 122. Con desplegables: **~15 segundos por
  empleado**, menos de 2 minutos el cierre del día.
- HORAS se calcula sola (maneja cruce de medianoche); TURNO opcional.
- ENCARGADO en cada fila (pedido tuyo) — con desplegable es un toque.
- Para el pipeline es trivial: `pandas.read_excel`, groupby fecha/turno →
  costo laboral por día/turno en el dashboard (horas × valor hora de la
  categoría del maestro).
- Escala a los otros 3 bares copiando el archivo y cambiando la pestaña
  EMPLEADOS.
- Una pestaña RESUMEN (protegida, solo fórmulas) muestra horas por empleado
  por semana/mes → es exactamente lo que Juan Manuel copia hoy a la
  liquidación, así que su flujo no cambia.

---

# PRIORIZACIÓN (impacto × esfuerzo)

| # | Acción | Impacto | Esfuerzo | Quién |
|---|---|---|---|---|
| 1 | Registro diario GG2/GG4 | ALTO — tapa el agujero de jornales (~$2,5M/mes invisibles) | Bajo (plantilla nueva) | encargados |
| 2 | Adoptar GASTOS v2 (ya construida) | ALTO — mata 49 categorías y % manuales | Ya hecho | Lila |
| 3 | Remitos v2 | ALTO — CMV confiable, cero clasificación manual | Medio (migrar 5 archivos) | encargados + Lila |
| 4 | MAESTROS unificado | MEDIO — sostiene todo lo anterior | Bajo | Lila |
| 5 | Liquidación v2 (validaciones) | MEDIO — evita errores de $47M | Bajo (tocar plantilla de JM) | Juan Manuel |

# PLAN DE ADOPCIÓN (orden propuesto)

**Semana 1 — Registro diario en GG2 y GG4.** Les cambia: al cierre, el
encargado agrega una fila por persona desde el celular. A Lila: deja de
perseguir los jornales; los ve en el archivo. *Regla de control: jornal que
no está en el registro, no se paga.*

**Semana 1 — Lila arranca julio en GASTOS v2** (el archivo migrado ya tiene
enero-junio). Le cambia: elige de desplegables en vez de tipear; no
distribuye porcentajes nunca más.

**Semana 2-3 — Remitos v2 en GG2/GG4** (piloto en los bares chicos), después
los 3 grandes al cierre de julio. Al encargado le cambia: 6 campos, 4
desplegables, no clasifica P&L.

**Mes 2 — MAESTROS + ajustes de liquidación** con Juan Manuel, y extender el
registro diario a Moreno/VV/Colegio si funcionó en GG2/GG4.

El pipeline del dashboard ya está preparado: lee las versiones nuevas si
existen y cae a las viejas si no — la migración puede ser gradual sin romper
nada.

---

# DECISIONES DE FRANCO (06/07/2026) — reflejadas en las plantillas generadas

1. **Horas del registro diario**: entrada/salida con cálculo automático, PERO
   si el encargado no las sabe puede escribir las horas directamente encima
   (la fórmula se pisa solo en esa fila). Implementado así.
2. **Hs Reales convive** con el registro diario (no se reemplaza por ahora).
   El registro nuevo alimenta el dashboard; la liquidación sigue su flujo.
3. **Formato**: Google Sheet nativo. Las plantillas .xlsx generadas se suben
   a Drive y se convierten (Archivo → Guardar como hoja de cálculo de Google);
   los desplegables y fórmulas sobreviven la conversión. Para que el pipeline
   las lea automáticamente: compartir "cualquiera con el enlace: lector"
   (solo contienen horas y nombres, sin montos).
4. **Remitos v2 NO se migra todavía**: el archivo
   `REMITOS v2 - PROPUESTA (para Lila).xlsx` es para que Lila lo revise y
   opine sobre su adaptabilidad (pregunta incluida en la pestaña LEEME).

# ARCHIVOS GENERADOS (carpeta plantillas_v2/, originales del Drive intactos)

- `REGISTRO DIARIO PERSONAL - GG2 - 2026.xlsx` (nómina precargada, 10 empleados)
- `REGISTRO DIARIO PERSONAL - GG4 - 2026.xlsx` (nómina precargada, 11 empleados)
- `GROWLER - MAESTROS.xlsx` (77 proveedores con P&L, 23 categorías, empleados GG2/GG4, locales y reglas)
- `REMITOS v2 - PROPUESTA (para Lila).xlsx` (con maestro embebido y P&L automática)
- `GROWLER - Gastos - PLANTILLA 2026.xlsx` (la ya construida, copiada acá)
