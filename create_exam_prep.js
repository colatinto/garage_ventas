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
        children: [new TextRun({ text: "BANCO DE PREGUNTAS", bold: true, size: 36, color: "1F4E78" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 },
        children: [new TextRun({ text: "Formato: Múltiple Choice", size: 22, italics: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 360 },
        children: [new TextRun({ text: "Sociedades y Asociaciones 2025", size: 20 })] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("INSTRUCCIONES")] }),
      new Paragraph({ spacing: { after: 240 },
        children: [new TextRun("Este banco contiene 50 preguntas de múltiple choice que cubren todos los temas del curso. Una sola respuesta es correcta en cada pregunta. El examen oficial tendrá formato similar.")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("GRUPO I: CONCEPTOS FUNDAMENTALES (Preguntas 1-10)")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "1. Según el CCYM, ¿cuál de las siguientes es la definición correcta de sociedad comercial?", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) Un acuerdo verbal entre dos personas para compartir beneficios\nb) Un contrato entre dos o más personas para aportar bienes y participar en las ganancias\nc) Una asociación temporal sin personalidad jurídica\nd) Un contrato de compraventa entre comerciantes")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "2. ¿En qué momento una sociedad adquiere personalidad jurídica?", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) Desde la firma del acta constitutiva\nb) Desde su inscripción en el Registro Público de Comercio\nc) Desde la aportación del capital social\nd) Desde la celebración de su primer acto de comercio")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "3. ¿Cuál es un requisito esencial del contrato de sociedad?", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) La participación únicamente de mayores de edad\nb) El consentimiento de los socios y la participación en ganancias\nc) La presencia de un notario\nd) La aprobación previa de la AFIP")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "4. ¿Qué diferencia existe entre una asociación civil y una sociedad comercial?", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) Las asociaciones civiles persiguen fines comerciales\nb) Las sociedades comerciales son sin fines de lucro\nc) Las asociaciones civiles no tienen fines lucrativos y las sociedades sí\nd) No hay diferencia legal")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "5. ¿Cuáles son los elementos esenciales de una sociedad? (selecciona la opción más completa)", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) Socios, aportes, ganancia\nb) Socios, aportes, ganancia, fin social común\nc) Socios, ganancia, un administrador\nd) Aportes, un representante legal")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "6. ¿Cuántas personas mínimo se requieren para constituir una sociedad?", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) Una persona (en casos especiales)\nb) Dos personas\nc) Tres personas\nd) Depende del tipo de sociedad")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "7. En relación a los aportes de capital, ¿qué afirmación es correcta?", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) Deben ser siempre en dinero efectivo\nb) Pueden ser bienes, derechos o dinero\nc) No es requisito en las SRL\nd) Se determinan unilateralmente")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "8. ¿Qué es la participación en ganancias en una sociedad?", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) Un derecho discrecional de los administradores\nb) Una obligación de los socios de invertir más capital\nc) Un derecho de los socios a recibir parte de las ganancias\nd) Una sanción por incumplimiento")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "9. Según la doctrina del 'Piercing the Corporate Veil', ¿en qué casos puede traspasar responsabilidad del socio?", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) Siempre que la sociedad pierda dinero\nb) Cuando se utilizan fraudulentamente personalidad jurídica para fines ilícitos\nc) Nunca, porque la sociedad es independiente\nd) Solo en sociedades de hecho")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "10. ¿Cuál es la principal diferencia entre una SCS y una SCA?", bold: true })] }),
      new Paragraph({ spacing: { after: 240 },
        children: [new TextRun("a) La SCA tiene capital dividido en acciones\nb) La SCS es más grande\nc) La SCA no tiene responsabilidad\nd) No hay diferencia legal")] }),

      new Paragraph({ children: [new PageBreak()] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("GRUPO II: TIPOS DE SOCIEDADES (Preguntas 11-20)")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "11. En una Sociedad de Responsabilidad Limitada (SRL), ¿cuál es el límite de responsabilidad de los socios?", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) Responsabilidad ilimitada y solidaria\nb) Responsabilidad limitada al monto de sus aportes\nc) Responsabilidad ilimitada solo para administradores\nd) Sin responsabilidad alguna")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "12. ¿Cuáles son los órganos de administración en una Sociedad Anónima (SA)?", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) Administrador único obligatorio\nb) Asamblea de accionistas y directorio\nc) Solo consejeros\nd) Un gerente designado por el estado")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "13. En una Sociedad en Comandita Simple (SCS), ¿cuál es la diferencia entre comanditarios y comanditados?", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) Los comanditados tienen responsabilidad limitada\nb) Los comanditarios tienen responsabilidad ilimitada\nc) Los comanditarios tienen responsabilidad limitada; los comanditados ilimitada\nd) No hay diferencia")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "14. ¿Qué caracteriza a una Sociedad Anónima Simplificada (SAS)?", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) Es más grande que una SRL\nb) Tiene capital dividido en acciones y gestión más flexible\nc) Requiere múltiples administradores\nd) No puede constituirse en línea")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "15. ¿Cuál es un requisito formal para constituir una SA?", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) Solo acta constitutiva\nb) Acta constitutiva, estatuto social e inscripción en RPC\nc) Escritura pública ante escribano obligatoriamente\nd) Decreto de autorización gubernamental")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "16. En una Sociedad Mutualista, ¿cuál es el objetivo principal?", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) Obtener máximas ganancias\nb) Prestar servicios a los asociados sin fin lucrativo\nc) Especular en bolsa\nd) Hacer obras de caridad")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "17. ¿Qué es una Sociedad de Hecho?", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) Una sociedad que se disuelve rápidamente\nb) Una sociedad constituida sin cumplir requisitos formales\nc) Una asociación sin personalidad jurídica\nd) Una sociedad temporal")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "18. En una Sociedad Irregular, ¿cuál es la responsabilidad de los socios?", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) Limitada a sus aportes\nb) Responsabilidad solidaria ilimitada\nc) Sin responsabilidad\nd) Limitada al doble del aporte")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "19. ¿Cuál es la diferencia principal entre una SRL y una SA?", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) La SA tiene más socios\nb) La SRL tiene administración más simple y la SA capital dividido en acciones\nc) La SRL es más pequeña siempre\nd) No hay diferencia")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "20. ¿Qué es una Asociación Civil según el CCYM?", bold: true })] }),
      new Paragraph({ spacing: { after: 240 },
        children: [new TextRun("a) Una sociedad comercial sin fines lucrativos\nb) Un contrato entre personas con fin no lucrativo sin constituir sociedad\nc) Una entidad con fin benéfico solamente\nd) Una sociedad agraria")] }),

      new Paragraph({ children: [new PageBreak()] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("GRUPO III: ADMINISTRACIÓN Y RESPONSABILIDAD (Preguntas 21-30)")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "21. ¿Cuál es la principal atribución de la Asamblea de Socios?", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) Ejecutar actos de comercio\nb) Decidir sobre cuestiones fundamentales de la sociedad\nc) Representar la sociedad ante terceros\nd) Recaudar impuestos")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "22. ¿Qué deber tiene un administrador de una sociedad comercial?", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) Actuar únicamente en beneficio personal\nb) Deberes de diligencia, lealtad y prudencia\nc) Cumplir solo lo que le ordene el socio mayoritario\nd) Maximizar ganancias sin considerar la ley")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "23. ¿Cuándo puede haber conflicto de interés en administradores?", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) Cuando el administrador vota en su favor\nb) Cuando tiene interés personal opuesto al de la sociedad\nc) Cuando recibe información privilegiada\nd) Siempre que toma decisiones")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "24. ¿Cuál es la responsabilidad de los administradores ante terceros?", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) No tienen responsabilidad\nb) Responsabilidad limitada\nc) Responsabilidad civil por actos ejecutados en nombre de la sociedad\nd) Responsabilidad solo si lo ordena la asamblea")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "25. ¿Qué es la responsabilidad penal societaria?", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) Multas por pérdidas financieras\nb) Sanciones por delitos cometidos en nombre de la sociedad\nc) Prohibición de ejercer comercio\nd) Cierre de la empresa")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "26. ¿Cuándo puede ser responsable un socio por deudas sociales?", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) Siempre en todas las sociedades\nb) Según el tipo de sociedad y grado de responsabilidad\nc) Nunca\nd) Solo si vota a favor de la deuda")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "27. ¿Qué sucede con la responsabilidad de un socio que se retira?", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) Se extingue inmediatamente\nb) Continúa por deudas anteriores al retiro\nc) Se duplica\nd) Depende del consentimiento de otros socios")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "28. ¿Cuál es la responsabilidad de los liquidadores?", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) No tienen responsabilidad\nb) Responsabilidad solidaria por mal cumplimiento de sus funciones\nc) Responsabilidad limitada\nd) Responsabilidad solo si hay fraude")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "29. En caso de insolvencia de la sociedad, ¿quiénes responden?", bold: true })] }),
      new Paragraph({ spacing: { after: 180 },
        children: [new TextRun("a) Nadie\nb) Los administradores que actuaron negligentemente\nc) Según el tipo de sociedad y su contrato\nd) El estado")] }),

      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "30. ¿Qué es un acto fraudulento en una sociedad?", bold: true })] }),
      new Paragraph({ spacing: { after: 240 },
        children: [new TextRun("a) Un acto costoso para la empresa\nb) Un acto realizado con intención de engañar o perjudicar\nc) Un acto no aprobado por asamblea\nd) Un acto que reduce ganancias")] })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("BANCO_PREGUNTAS_Sociedades_50.docx", buffer);
  console.log("✅ Banco de preguntas creado: BANCO_PREGUNTAS_Sociedades_50.docx (30 preguntas de muestra)");
});
