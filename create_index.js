const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, 
        AlignmentType, BorderStyle, WidthType, ShadingType } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "2E75B6" };
const borders = { top: border, bottom: border, left: border, right: border };

const doc = new Document({
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 },
        children: [new TextRun({ text: "ÍNDICE MAESTRO", bold: true, size: 44, color: "1F4E78" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 360 },
        children: [new TextRun({ text: "Sociedades y Asociaciones 2025 - Profesor F", size: 24, italics: true })] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("MATERIALES CREADOS")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1. Plan de Clases (PLAN_CLASES_Sociedades_2025.docx)")] }),
      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun("Documento: 8.5 KB")] }),
      new Paragraph({ spacing: { after: 240 },
        children: [new TextRun("Contenido: Resumen ejecutivo con 25 clases asignadas (13 en 1Q, 12 en 2Q), estructura de cada clase, estrategia pedagógica, calendario completo, contenidos por Bolilla, recursos necesarios y próximos pasos.")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2. Template PowerPoint (TEMPLATE_Clase_Sociedades.pptx)")] }),
      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun("Documento: 99 KB")] }),
      new Paragraph({ spacing: { after: 240 },
        children: [new TextRun("Contenido: 6 plantillas profesionales incluidas en un solo archivo: (1) Diapositiva de título, (2) Objetivos de clase, (3) Marco teórico con 2 columnas, (4) Caso práctico, (5) Comparación/Diferencias, (6) Cierre. Colores corporativos: azul marino, azul medio, oro. Listo para reutilizar.")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3. Guía de Estudio (GUIA_ESTUDIO_Sociedades_2025.docx)")] }),
      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun("Documento: 9.7 KB")] }),
      new Paragraph({ spacing: { after: 240 },
        children: [new TextRun("Contenido: Cómo usar la guía, conceptos fundamentales con definiciones clave para Bolillas I-VII, marco legal con artículos CCYM, preguntas para reflexionar, tabla comparativa de tipos de sociedades, casos prácticos de ejemplo, preguntas estilo examen.")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4. Banco de Preguntas (BANCO_PREGUNTAS_Sociedades_50.docx)")] }),
      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun("Documento: 11 KB")] }),
      new Paragraph({ spacing: { after: 240 },
        children: [new TextRun("Contenido: 30 preguntas de múltiple choice (base para completar a 50-200). Organizadas en 3 grupos: Conceptos Fundamentales (Q1-10), Tipos de Sociedades (Q11-20), Administración y Responsabilidad (Q21-30). Formato exacto del examen.")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 360 }, children: [new TextRun("CÓMO USAR ESTOS MATERIALES")] }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1800, 3780, 3780],
        rows: [
          new TableRow({
            children: [
              new TableCell({ borders, shading: { fill: "1F4E78", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "DOCUMENTO", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders, shading: { fill: "1F4E78", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "CUÁNDO USAR", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders, shading: { fill: "1F4E78", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "CÓMO USAR", bold: true, color: "FFFFFF" })] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("Plan de Clases")] }),
              new TableCell({ borders, children: [new Paragraph("Antes de cada cuatrimestre")] }),
              new TableCell({ borders, children: [new Paragraph("Referencia para estructura, temas y calendario de cada clase")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("Template PPT")] }),
              new TableCell({ borders, children: [new Paragraph("Para preparar cada clase")] }),
              new TableCell({ borders, children: [new Paragraph("Copiar y adaptar plantillas. Personalizar con contenido de cada Bolilla")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("Guía Estudio")] }),
              new TableCell({ borders, children: [new Paragraph("Entregar a estudiantes")] }),
              new TableCell({ borders, children: [new Paragraph("Complemento del material en clase. Estudiantes estudian con definiciones, conceptos y preguntas")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("Banco Preguntas")] }),
              new TableCell({ borders, children: [new Paragraph("Preparación del examen")] }),
              new TableCell({ borders, children: [new Paragraph("Estudiantes practican múltiple choice. Expandir a 50-200 preguntas según necesidad")] })
            ]
          })
        ]
      }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 360 }, children: [new TextRun("PRÓXIMOS PASOS RECOMENDADOS")] }),
      new Paragraph({ spacing: { after: 120 },
        children: [new TextRun("1. Para cada Bolilla a dictar, copiar el template PowerPoint y personalizar con contenido específico")] }),
      new Paragraph({ spacing: { after: 120 },
        children: [new TextRun("2. Expandir el banco de preguntas a 150-200 preguntas (actualmente tiene 30 como base)")] }),
      new Paragraph({ spacing: { after: 120 },
        children: [new TextRun("3. Compilar casos prácticos reales de la jurisprudencia argentina (SAIJ, Google Scholar Argentina)")] }),
      new Paragraph({ spacing: { after: 240 },
        children: [new TextRun("4. Crear videos cortos (5-10 min) explicando conceptos clave de cada Bolilla")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 360 }, children: [new TextRun("DISTRIBUCIÓN A ESTUDIANTES")] }),
      new Paragraph({ spacing: { after: 120 },
        children: [new TextRun("Semana 1 del curso: Entregar GUIA_ESTUDIO_Sociedades_2025.docx")] }),
      new Paragraph({ spacing: { after: 120 },
        children: [new TextRun("Semana 7 (antes del parcial): Entregar BANCO_PREGUNTAS_Sociedades_50.docx")] }),
      new Paragraph({ spacing: { after: 240 },
        children: [new TextRun("Cada clase: PowerPoints con contenido personalizado (basados en el template)")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 360 }, children: [new TextRun("NOTAS IMPORTANTES")] }),
      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun("• Todos los documentos están en formato editable (Word/PowerPoint)")] }),
      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun("• El template PowerPoint contiene 6 plantillas reutilizables")] }),
      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun("• Los materiales enfatizan casos prácticos + teoría (40/60 balance)")] }),
      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun("• El banco de preguntas sigue exactamente el formato del examen múltiple choice")] }),
      new Paragraph({ spacing: { after: 240 },
        children: [new TextRun("• Todos los documentos están optimizados para audiencia Contadores + Licenciados en Administración")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 360 }, children: [new TextRun("CONTACTO Y SOPORTE")] }),
      new Paragraph({
        children: [new TextRun("Para consultas sobre la estructura de clases, materiales o recomendaciones pedagógicas, revisa el documento PLAN_CLASES_Sociedades_2025.docx que contiene la estrategia completa.")]
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("INDICE_MAESTRO_Materiales.docx", buffer);
  console.log("✅ Índice maestro creado: INDICE_MAESTRO_Materiales.docx");
});
