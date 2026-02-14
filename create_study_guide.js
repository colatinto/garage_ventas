const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, 
        AlignmentType, BorderStyle, WidthType, ShadingType, PageBreak } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

const doc = new Document({
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 },
        children: [new TextRun({ text: "GUÍA DE ESTUDIO", bold: true, size: 36, color: "1F4E78" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 360 },
        children: [new TextRun({ text: "Sociedades y Asociaciones 2025", size: 28, italics: true })] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("CÓMO USAR ESTA GUÍA")] }),
      new Paragraph({ spacing: { after: 120 },
        children: [new TextRun("Esta guía te acompañará en el aprendizaje de Derecho Comercial, específicamente en el tema de Sociedades y Asociaciones.")] }),
      new Paragraph({ spacing: { after: 240 },
        children: [new TextRun("Para cada tema encontrarás: (1) Definiciones clave, (2) Marco legal, (3) Preguntas para reflexionar, (4) Casos prácticos de ejemplo.")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("BOLILLA I: CONCEPTO DE ASOCIACIÓN Y SOCIEDAD")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Conceptos Fundamentales")] }),
      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "Asociación:", bold: true }), new TextRun(" Unión de dos o más personas para un fin común")] }),
      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "Sociedad:", bold: true }), new TextRun(" Contrato por el cual dos o más personas se obligan a realizar aportes para participar en las ganancias")] }),
      new Paragraph({ spacing: { after: 240 },
        children: [new TextRun({ text: "Sujetos de derecho:", bold: true }), new TextRun(" Las personas que integran la asociación adquieren derechos y obligaciones")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Marco Legal")] }),
      new Paragraph({ spacing: { after: 120 },
        children: [new TextRun("Código Civil y Comercial Unificado (CCYM):")] }),
      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun("• Art. 1682 y ss: Definición y elementos de la sociedad")] }),
      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun("• Art. 1687: Contrato de sociedad")] }),
      new Paragraph({ spacing: { after: 240 },
        children: [new TextRun("• Art. 1689: Efectos de la sociedad")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Preguntas para Reflexionar")] }),
      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun("1. ¿Cuál es la diferencia entre una asociación civil y una sociedad comercial?")] }),
      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun("2. ¿Qué requisitos debe tener el contrato de sociedad?")] }),
      new Paragraph({ spacing: { after: 240 },
        children: [new TextRun("3. ¿En qué momento adquiere personalidad jurídica una sociedad?")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("BOLILLA II: ESTRUCTURA DE SOCIEDADES COMERCIALES")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Clasificación de Sociedades")] }),
      
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2340, 3510, 3510],
        rows: [
          new TableRow({
            children: [
              new TableCell({ borders, shading: { fill: "1F4E78", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "TIPO", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders, shading: { fill: "1F4E78", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "CARACTERÍSTICA", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders, shading: { fill: "1F4E78", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "RESPONSABILIDAD", bold: true, color: "FFFFFF" })] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("S.C.S.")] }),
              new TableCell({ borders, children: [new Paragraph("Comanditada simple")] }),
              new TableCell({ borders, children: [new Paragraph("Ilimitada (comanditados)")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("S.C.A.")] }),
              new TableCell({ borders, children: [new Paragraph("Comanditada por acciones")] }),
              new TableCell({ borders, children: [new Paragraph("Limitada a aportes")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("S.A.")] }),
              new TableCell({ borders, children: [new Paragraph("Anónima")] }),
              new TableCell({ borders, children: [new Paragraph("Limitada a aportes")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("S.R.L.")] }),
              new TableCell({ borders, children: [new Paragraph("Responsabilidad limitada")] }),
              new TableCell({ borders, children: [new Paragraph("Limitada a aportes")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, children: [new Paragraph("S.A.S.")] }),
              new TableCell({ borders, children: [new Paragraph("Sociedad por acciones")] }),
              new TableCell({ borders, children: [new Paragraph("Limitada a aportes")] })
            ]
          })
        ]
      }),

      new Paragraph({ spacing: { after: 240 }, children: [new TextRun("")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("BOLILLA III: CONSTITUCIÓN DE SOCIEDADES")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Requisitos de Constitución")] }),
      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun("1. Consentimiento de los socios (manifestado en acta constitutiva)")] }),
      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun("2. Aportes de capital (bienes, dinero, derechos)")] }),
      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun("3. Participación en las ganancias")] }),
      new Paragraph({ spacing: { after: 240 },
        children: [new TextRun("4. Formalidades según el tipo de sociedad (inscripción registral)")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Formalidades Registrales")] }),
      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun("• Inscripción en el Registro Público de Comercio")] }),
      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun("• Publicación en Boletín Oficial (según tipo de sociedad)")] }),
      new Paragraph({ spacing: { after: 240 },
        children: [new TextRun("• CUIT ante la AFIP")] }),

      new Paragraph({ children: [new PageBreak()] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("BOLILLA V: ÓRGANOS DE ADMINISTRACIÓN")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Tipos de Órganos")] }),
      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "Asamblea de Socios:", bold: true }), new TextRun(" Órgano deliberativo máximo")] }),
      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "Junta Directiva:", bold: true }), new TextRun(" Órgano de administración (solo en S.A.)")] }),
      new Paragraph({ spacing: { after: 240 },
        children: [new TextRun({ text: "Administrador Único:", bold: true }), new TextRun(" En S.R.L. y otras sociedades")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Atribuciones y Poderes")] }),
      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun("• Representación de la sociedad ante terceros")] }),
      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun("• Gestión del patrimonio social")] }),
      new Paragraph({ spacing: { after: 240 },
        children: [new TextRun("• Celebración de actos y contratos")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("BOLILLA VII: RESPONSABILIDAD DE SOCIOS Y ADMINISTRADORES")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Tipos de Responsabilidad")] }),
      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "Responsabilidad Civil:", bold: true }), new TextRun(" Ante terceros y la sociedad")] }),
      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "Responsabilidad Penal:", bold: true }), new TextRun(" Por delitos societarios")] }),
      new Paragraph({ spacing: { after: 240 },
        children: [new TextRun({ text: "Responsabilidad Tributaria:", bold: true }), new TextRun(" Por infracciones tributarias")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Abuso de Personalidad Jurídica")] }),
      new Paragraph({ spacing: { after: 120 },
        children: [new TextRun("Doctrina del 'Piercing the Corporate Veil': Cuando la sociedad se utiliza para fines fraudulentos, se puede traspasar la responsabilidad a los socios.")] }),
      new Paragraph({ spacing: { after: 240 },
        children: [new TextRun("Jurisprudencia: Múltiples fallos reconocen esta doctrina en Argentina.")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("PREGUNTAS DE EXAMEN - PRÁCTICA")] }),
      new Paragraph({ spacing: { after: 120 },
        children: [new TextRun("Selecciona la respuesta correcta en cada caso:")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "1. Según el CCYM, una sociedad adquiere personalidad jurídica:", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) Desde la firma del contrato\nb) Desde su inscripción en el RPC\nc) Desde su publicación en el BO\nd) Desde la aprobación de asambleas")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "2. En una SRL, ¿cuál es el límite de responsabilidad de los socios?", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) Ilimitada solidaria\nb) Limitada a sus aportes\nc) Ilimitada conjunta\nd) Sin límite para administradores")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "3. El CCYM establece que los administradores de una sociedad tienen deberes de:", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) Máximo provecho personal\nb) Diligencia, lealtad y prudencia\nc) Solo cumplir el contrato\nd) Informar al estado")] })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("GUIA_ESTUDIO_Sociedades_2025.docx", buffer);
  console.log("✅ Guía de estudio creada: GUIA_ESTUDIO_Sociedades_2025.docx");
});
