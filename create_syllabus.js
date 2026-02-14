const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, 
        AlignmentType, BorderStyle, WidthType, ShadingType, PageBreak, PageOrientation } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "999999" };
const borders = { top: border, bottom: border, left: border, right: border };

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: "1F4E78" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 180, after: 100 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 120, after: 60 }, outlineLevel: 2 } }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "PLAN DE CLASES", bold: true, size: 36, color: "1F4E78" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [new TextRun({ text: "Sociedades y Asociaciones - 2025", size: 26, color: "2E75B6" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: [new TextRun({ text: "Profesor F | Universidad Nacional de Rosario", size: 22, italics: true })]
      }),

      // Summary
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Resumen Ejecutivo")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("Clases asignadas al Profesor F: 25 clases (37.5 horas)")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("Primer Cuatrimestre: 13 clases | Segundo Cuatrimestre: 12 clases")]
      }),
      new Paragraph({
        spacing: { after: 240 },
        children: [new TextRun("Enfoque: Teoría + Casos prácticos + Jurisprudencia selecta, diseñado para Contadores y Licenciados en Administración")]
      }),

      // 1Q
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("PRIMER CUATRIMESTRE 2025")]
      }),
      new Paragraph({
        spacing: { after: 240 },
        children: [new TextRun("13 clases de 1.5 horas (19.5 horas totales)")]
      }),

      // Table 1Q
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [900, 2100, 3000, 3360],
        rows: [
          new TableRow({
            children: [
              new TableCell({ borders, shading: { fill: "1F4E78", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Clase", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders, shading: { fill: "1F4E78", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Fecha", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders, shading: { fill: "1F4E78", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Bolilla / Temas", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders, shading: { fill: "1F4E78", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Enfoques Pedagógicos", bold: true, color: "FFFFFF" })] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("1")] }),
              new TableCell({ borders, children: [new Paragraph("1-abr")] }),
              new TableCell({ borders, children: [new Paragraph("Bolilla I (Pts 1-2)")] }),
              new TableCell({ borders, children: [new Paragraph("Conceptos asociativos, marco legal")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("3")] }),
              new TableCell({ borders, children: [new Paragraph("8-abr")] }),
              new TableCell({ borders, children: [new Paragraph("Bolilla II (Pts 1-2)")] }),
              new TableCell({ borders, children: [new Paragraph("Estructura de sociedades comerciales")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("5")] }),
              new TableCell({ borders, children: [new Paragraph("15-abr")] }),
              new TableCell({ borders, children: [new Paragraph("Bolilla III (Pts 1-2)")] }),
              new TableCell({ borders, children: [new Paragraph("Constitución societaria, requisitos")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("6")] }),
              new TableCell({ borders, children: [new Paragraph("22-abr")] }),
              new TableCell({ borders, children: [new Paragraph("Bolilla III (Pts 3-4)")] }),
              new TableCell({ borders, children: [new Paragraph("Tipos de sociedades, características")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("9")] }),
              new TableCell({ borders, children: [new Paragraph("13-may")] }),
              new TableCell({ borders, children: [new Paragraph("Bolilla V")] }),
              new TableCell({ borders, children: [new Paragraph("Órganos de administración")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("11")] }),
              new TableCell({ borders, children: [new Paragraph("20-may")] }),
              new TableCell({ borders, children: [new Paragraph("Bolilla VII")] }),
              new TableCell({ borders, children: [new Paragraph("Responsabilidad de socios y administradores")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("13")] }),
              new TableCell({ borders, children: [new Paragraph("27-may")] }),
              new TableCell({ borders, children: [new Paragraph("Bolilla IX")] }),
              new TableCell({ borders, children: [new Paragraph("Transferencia de participaciones")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("15")] }),
              new TableCell({ borders, children: [new Paragraph("3-jun")] }),
              new TableCell({ borders, children: [new Paragraph("Bolilla X")] }),
              new TableCell({ borders, children: [new Paragraph("Disolución y liquidación")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("17")] }),
              new TableCell({ borders, children: [new Paragraph("10-jun")] }),
              new TableCell({ borders, children: [new Paragraph("Bolilla XI (Pts 3-6)")] }),
              new TableCell({ borders, children: [new Paragraph("Sociedades especiales (I)")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("19")] }),
              new TableCell({ borders, children: [new Paragraph("17-jun")] }),
              new TableCell({ borders, children: [new Paragraph("Bolilla XII (Pts 3-9)")] }),
              new TableCell({ borders, children: [new Paragraph("Sociedades especiales (II)")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("20")] }),
              new TableCell({ borders, children: [new Paragraph("24-jun")] }),
              new TableCell({ borders, children: [new Paragraph("Bolilla XIII")] }),
              new TableCell({ borders, children: [new Paragraph("Asociaciones civiles")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("22")] }),
              new TableCell({ borders, children: [new Paragraph("1-jul")] }),
              new TableCell({ borders, children: [new Paragraph("Bolilla XV")] }),
              new TableCell({ borders, children: [new Paragraph("Fusión y escisión de sociedades")] })
            ]
          })
        ]
      }),

      new Paragraph({ spacing: { after: 240 }, children: [new TextRun("")] }),

      // 2Q
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("SEGUNDO CUATRIMESTRE 2025")]
      }),
      new Paragraph({
        spacing: { after: 240 },
        children: [new TextRun("12 clases de 1.5 horas (18 horas totales)")]
      }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [900, 2100, 3000, 3360],
        rows: [
          new TableRow({
            children: [
              new TableCell({ borders, shading: { fill: "1F4E78", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Clase", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders, shading: { fill: "1F4E78", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Fecha", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders, shading: { fill: "1F4E78", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Bolilla / Temas", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders, shading: { fill: "1F4E78", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Enfoques Pedagógicos", bold: true, color: "FFFFFF" })] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("1")] }),
              new TableCell({ borders, children: [new Paragraph("6-ago")] }),
              new TableCell({ borders, children: [new Paragraph("Bolilla I (Pts 1-2)")] }),
              new TableCell({ borders, children: [new Paragraph("Repaso conceptos asociativos")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("3")] }),
              new TableCell({ borders, children: [new Paragraph("13-ago")] }),
              new TableCell({ borders, children: [new Paragraph("Bolilla II (Pts 1-2)")] }),
              new TableCell({ borders, children: [new Paragraph("Estructura de sociedades comerciales")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("5")] }),
              new TableCell({ borders, children: [new Paragraph("20-ago")] }),
              new TableCell({ borders, children: [new Paragraph("Bolilla III (Pts 1-2)")] }),
              new TableCell({ borders, children: [new Paragraph("Constitución y requisitos")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("7")] }),
              new TableCell({ borders, children: [new Paragraph("27-ago")] }),
              new TableCell({ borders, children: [new Paragraph("Bolilla IV")] }),
              new TableCell({ borders, children: [new Paragraph("Tipos de sociedades (continuación)")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("9")] }),
              new TableCell({ borders, children: [new Paragraph("3-sep")] }),
              new TableCell({ borders, children: [new Paragraph("Bolilla VI (Pts 1-4)")] }),
              new TableCell({ borders, children: [new Paragraph("Sociedad anónima (I)")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("11")] }),
              new TableCell({ borders, children: [new Paragraph("17-sep")] }),
              new TableCell({ borders, children: [new Paragraph("Bolilla VII")] }),
              new TableCell({ borders, children: [new Paragraph("Responsabilidad de socios y administradores")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("13")] }),
              new TableCell({ borders, children: [new Paragraph("24-sep")] }),
              new TableCell({ borders, children: [new Paragraph("Bolilla VIII (Pts 3-4)")] }),
              new TableCell({ borders, children: [new Paragraph("Derecho de preferencia en participaciones")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("23")] }),
              new TableCell({ borders, children: [new Paragraph("29-oct")] }),
              new TableCell({ borders, children: [new Paragraph("Bolilla IX")] }),
              new TableCell({ borders, children: [new Paragraph("Transferencia de participaciones")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("24")] }),
              new TableCell({ borders, children: [new Paragraph("5-nov")] }),
              new TableCell({ borders, children: [new Paragraph("Bolilla XI (Pts 3-6)")] }),
              new TableCell({ borders, children: [new Paragraph("Sociedades especiales (I)")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("26")] }),
              new TableCell({ borders, children: [new Paragraph("12-nov")] }),
              new TableCell({ borders, children: [new Paragraph("Bolilla XII (Pts 3-9)")] }),
              new TableCell({ borders, children: [new Paragraph("Sociedades especiales (II)")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("28*")] }),
              new TableCell({ borders, children: [new Paragraph("27-nov")] }),
              new TableCell({ borders, children: [new Paragraph("Bolilla XVII")] }),
              new TableCell({ borders, children: [new Paragraph("Temas finales y repaso")] })
            ]
          })
        ]
      }),

      new Paragraph({ spacing: { after: 120 }, children: [new TextRun("")] }),
      new Paragraph({
        spacing: { after: 240 },
        children: [new TextRun({ text: "*Nota: Algunas clases posteriores al parcial incluyen temas de cierre", italics: true, size: 20 })]
      }),

      // Page break
      new Paragraph({ children: [new PageBreak()] }),

      // Estrategia pedagógica
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Estrategia Pedagógica")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("1. Balance Teoría - Práctica")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("60% Teoría (Fundamentos legales, definiciones, marco normativo) + 40% Práctica (Casos reales, jurisprudencia selecta, ejemplos empresariales)")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("2. Enfoque para la Audiencia")]
      }),
      new Paragraph({
        spacing: { after: 240 },
        children: [new TextRun("Estudiantes con formación contable/administrativa pero sin formación legal previa. Enfasis en aplicación práctica y terminología clara.")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("3. Estructura de Cada Clase (1.5 horas)")]
      }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2340, 2340, 2340, 2340],
        rows: [
          new TableRow({
            children: [
              new TableCell({ borders, shading: { fill: "2E75B6", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Fase", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders, shading: { fill: "2E75B6", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Duración", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders, shading: { fill: "2E75B6", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Contenido", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders, shading: { fill: "2E75B6", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Recursos", bold: true, color: "FFFFFF" })] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("Introducción")] }),
              new TableCell({ borders, children: [new Paragraph("10 min")] }),
              new TableCell({ borders, children: [new Paragraph("Contexto, objetivos de la clase")] }),
              new TableCell({ borders, children: [new Paragraph("Presentación PowerPoint")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("Teoría")] }),
              new TableCell({ borders, children: [new Paragraph("30 min")] }),
              new TableCell({ borders, children: [new Paragraph("Conceptos legales, definiciones, marco normativo")] }),
              new TableCell({ borders, children: [new Paragraph("Slides + Legislación (CCYM)")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("Casos/Ejemplos")] }),
              new TableCell({ borders, children: [new Paragraph("40 min")] }),
              new TableCell({ borders, children: [new Paragraph("Casos prácticos, jurisprudencia, ejemplos empresariales")] }),
              new TableCell({ borders, children: [new Paragraph("Análisis grupal, Q&A")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("Cierre")] }),
              new TableCell({ borders, children: [new Paragraph("10 min")] }),
              new TableCell({ borders, children: [new Paragraph("Resumen, preguntas frecuentes, vista previa")] }),
              new TableCell({ borders, children: [new Paragraph("Guía de estudio")] })
            ]
          })
        ]
      }),

      new Paragraph({ spacing: { after: 240 }, children: [new TextRun("")] }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("4. Evaluación y Examen")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("Formato: Múltiple choice (preguntas teóricas), 25 preguntas")]
      }),
      new Paragraph({
        spacing: { after: 240 },
        children: [new TextRun("Preparación: Énfasis en comprensión teórica desde casos prácticos; las respuestas correctas emergen de entender cómo funciona la ley en situaciones reales")]
      }),

      // Page break
      new Paragraph({ children: [new PageBreak()] }),

      // Contenidos por Bolilla
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Contenidos por Bolilla (Referencia)")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Bolilla I: Asociaciones y Concepto de Sociedad")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("Puntos 1-2 (Profesor F): Concepto de asociación, contrato de sociedad, elementos constitutivos, sujetos de derecho, personalidad jurídica")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Bolilla II: Estructura de Sociedades Comerciales")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("Puntos 1-2 (Profesor F): Clasificación de sociedades, sociedades civiles vs comerciales, tipología según responsabilidad de socios")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Bolilla III: Constitución y Formas de Organización")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("Puntos 1-4 (Profesor F): Requisitos de constitución, acta constitutiva, inscripción registral, estatutos y reglamentos internos")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Bolilla IV: Tipos de Sociedades (continuación)")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("Profesor J principalmente, pero Profesor F profundiza en jurisprudencia relevante")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Bolilla V: Órganos de Administración")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("Profesor F: Asamblea de socios, junta directiva, administrador único, poderes y atribuciones, deberes fiduciarios")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Bolilla VI: Sociedad Anónima")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("Profesor J principalmente (Pts 1-2), Profesor F continúa en 2Q (Pts 1-4): Capital social, acciones, emisión de valores")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Bolilla VII: Responsabilidad de Socios y Administradores")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("Profesor F: Responsabilidad civil y penal, conflictos de interés, abuso de personalidad jurídica (piercing the corporate veil), jurisprudencia")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Bolilla VIII: Derecho de Preferencia")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("Profesor J (Pts 1-2), Profesor F (Pts 3-4): Derechos de preferencia en participaciones, exclusión de socios")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Bolilla IX: Transferencia de Participaciones")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("Profesor F: Transferencia de participaciones, cesión de derechos, formalidades y restricciones, casos de terceros adquirentes")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Bolilla X: Disolución y Liquidación")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("Profesor F: Causas de disolución, liquidación, distribución de patrimonio, responsabilidades del liquidador")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Bolilla XI: Sociedades Especiales")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("Profesor J (Pts 1-2), Profesor F (Pts 3-6): Sociedades de hecho, irregulares, SRL, SAS, cooperativas")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Bolilla XII: Sociedades Especiales (continuación)")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("Profesor J (Pts 1-2), Profesor F (Pts 3-9): Sociedades mutualistas, asociaciones civiles, sociedades de inversión")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Bolilla XIII: Asociaciones Civiles")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("Profesor F: Asociaciones sin fines de lucro, patrimonio, responsabilidad, órganos de dirección")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Bolilla XIV: Transformación de Sociedades")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("Profesor J: Cambios de forma societaria, procedimientos y efectos")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Bolilla XV: Fusión y Escisión")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("Profesor F: Fusión de sociedades, escisión, integración empresarial, efectos legales y contables")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Bolilla XVI-XVIII: Temas Finales")]
      }),
      new Paragraph({
        spacing: { after: 240 },
        children: [new TextRun("Profesor J principalmente: Sucesión societaria, resoluciones de socios, normas tributarias y contables complementarias")]
      }),

      // Page break
      new Paragraph({ children: [new PageBreak()] }),

      // Recursos
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Recursos Pedagógicos")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Obligatorios para Cada Clase")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Presentación PowerPoint (1 por clase, 15-20 slides)")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Legislación: Código Civil y Comercial Unificado (CCYM), arts. relevantes")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 120 },
        children: [new TextRun("2-3 casos prácticos o jurisprudencia selecta por clase")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Complementarios")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Guía de estudio (2 págs por tema, resumen + preguntas clave)")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Banco de preguntas estilo múltiple choice (práctica de examen)")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Videos de corta duración (5-10 min) explicando conceptos clave")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 240 },
        children: [new TextRun("Foro de consultas en plataforma (para dudas entre clases)")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Fuentes de Casos Prácticos")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Base de datos de jurisprudencia (SAIJ, Google Scholar Argentina)")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Boletín Oficial: Resoluciones de organismos de control")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Casos reales de empresas locales (con permiso)")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 240 },
        children: [new TextRun("Doctrina: Articulos de revistas jurídicas especializadas")]
      }),

      // Próximos pasos
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Próximos Pasos")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Crear template PowerPoint unificado (logo UNR, colores corporativos, estructura clara)")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Desarrollar presentaciones para cada Bolilla (13 para 1Q, 12 para 2Q)")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Compilar casos prácticos y jurisprudencia selecta")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Crear guías de estudio por unidad")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Desarrollar banco de 150-200 preguntas múltiple choice")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Coordinar con Profesor J para garantizar coherencia en temas compartidos")]
      })
    ],
    numbering: {
      config: [
        { reference: "bullets", levels: [{ level: 0, format: "bullet", text: "•", alignment: "left",
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
        { reference: "numbers", levels: [{ level: 0, format: "decimal", text: "%1.", alignment: "left",
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
      ]
    }
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/sessions/beautiful-laughing-tesla/mnt/garage_ventas/PLAN_CLASES_Sociedades_2025.docx", buffer);
  console.log("✅ Plan de clases creado: PLAN_CLASES_Sociedades_2025.docx");
});
