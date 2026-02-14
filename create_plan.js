const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, 
        AlignmentType, BorderStyle, WidthType, ShadingType } = require('docx');
const fs = require('fs');

const doc = new Document({
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "PLAN DE CLASES", bold: true, size: 36 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Sociedades y Asociaciones 2025", size: 26, italics: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 360 }, children: [new TextRun({ text: "Profesor F | Universidad Nacional de Rosario", size: 22 })] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("RESUMEN EJECUTIVO")] }),
      new Paragraph({ children: [new TextRun("Total de clases asignadas: 25 clases (37.5 horas)")] }),
      new Paragraph({ children: [new TextRun("Primer cuatrimestre: 13 clases (19.5 horas)")] }),
      new Paragraph({ spacing: { after: 240 }, children: [new TextRun("Segundo cuatrimestre: 12 clases (18 horas)")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 240 }, children: [new TextRun("ESTRUCTURA DE LAS CLASES")] }),
      new Paragraph({ spacing: { after: 120 }, children: [new TextRun("Cada clase de 1.5 horas se estructura así:")] }),
      new Paragraph({ spacing: { after: 60 }, children: [new TextRun("• Introducción (10 min): Contexto y objetivos")] }),
      new Paragraph({ spacing: { after: 60 }, children: [new TextRun("• Teoría (30 min): Conceptos legales y marco normativo")] }),
      new Paragraph({ spacing: { after: 60 }, children: [new TextRun("• Casos prácticos (40 min): Jurisprudencia y ejemplos reales")] }),
      new Paragraph({ spacing: { after: 240 }, children: [new TextRun("• Cierre (10 min): Resumen y preguntas frecuentes")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 240 }, children: [new TextRun("TEMAS A DICTAR - PROFESOR F")] }),
      new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "Bolilla I - Asociaciones y concepto de sociedad (Pts 1-2)", bold: true })] }),
      new Paragraph({ spacing: { after: 120 }, children: [new TextRun("Bolilla II - Estructura de sociedades comerciales (Pts 1-2)")] }),
      new Paragraph({ spacing: { after: 120 }, children: [new TextRun("Bolilla III - Constitución de sociedades (Pts 1-4)")] }),
      new Paragraph({ spacing: { after: 120 }, children: [new TextRun("Bolilla V - Órganos de administración")] }),
      new Paragraph({ spacing: { after: 120 }, children: [new TextRun("Bolilla VII - Responsabilidad de socios y administradores")] }),
      new Paragraph({ spacing: { after: 120 }, children: [new TextRun("Bolilla IX - Transferencia de participaciones")] }),
      new Paragraph({ spacing: { after: 120 }, children: [new TextRun("Bolilla X - Disolución y liquidación")] }),
      new Paragraph({ spacing: { after: 120 }, children: [new TextRun("Bolilla XI - Sociedades especiales (Pts 3-6)")] }),
      new Paragraph({ spacing: { after: 120 }, children: [new TextRun("Bolilla XII - Sociedades especiales (Pts 3-9)")] }),
      new Paragraph({ spacing: { after: 120 }, children: [new TextRun("Bolilla XIII - Asociaciones civiles")] }),
      new Paragraph({ spacing: { after: 240 }, children: [new TextRun("Bolilla XV - Fusión y escisión de sociedades")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 240 }, children: [new TextRun("RECURSOS A CREAR")] }),
      new Paragraph({ spacing: { after: 60 }, children: [new TextRun("✓ 25 presentaciones PowerPoint (1 por clase, 15-20 slides)")] }),
      new Paragraph({ spacing: { after: 60 }, children: [new TextRun("✓ Guías de estudio (2 págs por tema, resumen + preguntas clave)")] }),
      new Paragraph({ spacing: { after: 60 }, children: [new TextRun("✓ Banco de 150-200 preguntas múltiple choice")] }),
      new Paragraph({ spacing: { after: 240 }, children: [new TextRun("✓ Compilación de jurisprudencia selecta y casos prácticos")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 240 }, children: [new TextRun("EVALUACIÓN")] }),
      new Paragraph({ spacing: { after: 120 }, children: [new TextRun("Formato: 25 preguntas de múltiple choice")] }),
      new Paragraph({ spacing: { after: 120 }, children: [new TextRun("Estrategia: Énfasis en comprensión teórica desde casos prácticos")] }),
      new Paragraph({ spacing: { after: 240 }, children: [new TextRun("Objetivo: Las respuestas correctas deben emerger de entender cómo funciona la ley en situaciones reales")] })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("PLAN_CLASES_Sociedades_2025.docx", buffer);
  console.log("✅ Documento creado: PLAN_CLASES_Sociedades_2025.docx");
});
