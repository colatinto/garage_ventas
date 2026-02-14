const PptxGenJS = require('pptxgenjs');

const prs = new PptxGenJS();
prs.defineLayout({ name: 'LAYOUT1', width: 10, height: 7.5 });
prs.defineLayout({ name: 'LAYOUT2', width: 10, height: 7.5 });

// Define color scheme for legal/business context
const colors = {
  primary: '1F4E78',      // Dark blue
  secondary: '2E75B6',    // Medium blue
  accent: 'F2A900',       // Gold accent
  text: '1F1F1F',         // Dark text
  light: 'F5F5F5',        // Light background
  white: 'FFFFFF'
};

// Slide 1: Title Slide
let slide = prs.addSlide();
slide.background = { color: colors.primary };
slide.addText('SOCIEDADES Y ASOCIACIONES', {
  x: 0.5, y: 2, w: 9, h: 1.2,
  fontSize: 54, bold: true, color: colors.white,
  align: 'center', fontFace: 'Arial'
});
slide.addText('Derecho Comercial', {
  x: 0.5, y: 3.3, w: 9, h: 0.6,
  fontSize: 32, color: colors.accent,
  align: 'center', fontFace: 'Arial'
});
slide.addText('Universidad Nacional de Rosario', {
  x: 0.5, y: 4.2, w: 9, h: 0.5,
  fontSize: 20, color: colors.light,
  align: 'center', fontFace: 'Arial', italics: true
});
slide.addText('Prof. F | 2025', {
  x: 0.5, y: 6.5, w: 9, h: 0.4,
  fontSize: 16, color: colors.light,
  align: 'center', fontFace: 'Arial'
});

// Slide 2: Agenda/Learning Objectives Template
slide = prs.addSlide();
slide.background = { color: colors.white };

// Header bar
slide.addShape(prs.ShapeType.rect, {
  x: 0, y: 0, w: 10, h: 1,
  fill: { color: colors.primary }
});
slide.addText('OBJETIVOS DE LA CLASE', {
  x: 0.5, y: 0.25, w: 9, h: 0.5,
  fontSize: 32, bold: true, color: colors.white,
  fontFace: 'Arial'
});

// Content area
slide.addText('Al finalizar esta clase, podrás:', {
  x: 0.75, y: 1.3, w: 8.5, h: 0.4,
  fontSize: 16, bold: true, color: colors.text,
  fontFace: 'Arial'
});

slide.addText('✓ Comprender los conceptos fundamentales', {
  x: 1, y: 1.9, w: 8.5, h: 0.4,
  fontSize: 14, color: colors.text,
  fontFace: 'Arial'
});
slide.addText('✓ Identificar las diferencias clave', {
  x: 1, y: 2.4, w: 8.5, h: 0.4,
  fontSize: 14, color: colors.text,
  fontFace: 'Arial'
});
slide.addText('✓ Aplicar la teoría a casos prácticos', {
  x: 1, y: 2.9, w: 8.5, h: 0.4,
  fontSize: 14, color: colors.text,
  fontFace: 'Arial'
});
slide.addText('✓ Resolver problemas reales', {
  x: 1, y: 3.4, w: 8.5, h: 0.4,
  fontSize: 14, color: colors.text,
  fontFace: 'Arial'
});

// Bottom accent line
slide.addShape(prs.ShapeType.rect, {
  x: 0, y: 7.2, w: 10, h: 0.3,
  fill: { color: colors.accent }
});

// Slide 3: Content Slide Template
slide = prs.addSlide();
slide.background = { color: colors.white };

// Header
slide.addShape(prs.ShapeType.rect, {
  x: 0, y: 0, w: 10, h: 0.8,
  fill: { color: colors.secondary }
});
slide.addText('MARCO TEÓRICO', {
  x: 0.5, y: 0.2, w: 5, h: 0.4,
  fontSize: 28, bold: true, color: colors.white,
  fontFace: 'Arial'
});

// Left column
slide.addShape(prs.ShapeType.rect, {
  x: 0.5, y: 1.2, w: 4.3, h: 5.5,
  fill: { color: colors.light },
  line: { color: colors.secondary, width: 2 }
});

slide.addText('CONCEPTO', {
  x: 0.7, y: 1.4, w: 3.9, h: 0.3,
  fontSize: 14, bold: true, color: colors.primary,
  fontFace: 'Arial'
});
slide.addText('Definición clara y precisa del término legal', {
  x: 0.7, y: 1.8, w: 3.9, h: 1.2,
  fontSize: 12, color: colors.text,
  fontFace: 'Arial'
});

slide.addText('REQUISITOS', {
  x: 0.7, y: 3.2, w: 3.9, h: 0.3,
  fontSize: 14, bold: true, color: colors.primary,
  fontFace: 'Arial'
});
slide.addText('Elemento 1\nElemento 2\nElemento 3', {
  x: 0.7, y: 3.6, w: 3.9, h: 1.5,
  fontSize: 12, color: colors.text,
  fontFace: 'Arial'
});

// Right column
slide.addText('ARTÍCULOS CCYM', {
  x: 5.2, y: 1.2, w: 4.3, h: 0.3,
  fontSize: 14, bold: true, color: colors.primary,
  fontFace: 'Arial'
});
slide.addText('Citar artículos relevantes del Código Civil y Comercial Unificado', {
  x: 5.2, y: 1.6, w: 4.3, h: 1.8,
  fontSize: 12, color: colors.text,
  fontFace: 'Arial'
});

slide.addText('JURISPRUDENCIA', {
  x: 5.2, y: 3.7, w: 4.3, h: 0.3,
  fontSize: 14, bold: true, color: colors.primary,
  fontFace: 'Arial'
});
slide.addText('Referencia a fallos relevantes que ilustren la aplicación práctica', {
  x: 5.2, y: 4.1, w: 4.3, h: 1.6,
  fontSize: 12, color: colors.text,
  fontFace: 'Arial'
});

// Bottom accent
slide.addShape(prs.ShapeType.rect, {
  x: 0, y: 7.2, w: 10, h: 0.3,
  fill: { color: colors.accent }
});

// Slide 4: Case Study Template
slide = prs.addSlide();
slide.background = { color: colors.white };

slide.addShape(prs.ShapeType.rect, {
  x: 0, y: 0, w: 10, h: 0.8,
  fill: { color: colors.secondary }
});
slide.addText('CASO PRÁCTICO', {
  x: 0.5, y: 0.2, w: 9, h: 0.4,
  fontSize: 28, bold: true, color: colors.white,
  fontFace: 'Arial'
});

// Case box
slide.addShape(prs.ShapeType.rect, {
  x: 0.5, y: 1, w: 9, h: 1.2,
  fill: { color: colors.light },
  line: { color: colors.accent, width: 2 }
});
slide.addText('SITUACIÓN:', {
  x: 0.7, y: 1.15, w: 1.5, h: 0.3,
  fontSize: 12, bold: true, color: colors.primary,
  fontFace: 'Arial'
});
slide.addText('Descripción del caso práctico real o hipotético...', {
  x: 2.3, y: 1.15, w: 7, h: 0.9,
  fontSize: 11, color: colors.text,
  fontFace: 'Arial'
});

// Analysis
slide.addText('ANÁLISIS Y PREGUNTAS:', {
  x: 0.5, y: 2.4, w: 9, h: 0.3,
  fontSize: 14, bold: true, color: colors.primary,
  fontFace: 'Arial'
});
slide.addText('1. ¿Cuál es el problema legal?', {
  x: 0.7, y: 2.8, w: 8.6, h: 0.3,
  fontSize: 12, color: colors.text,
  fontFace: 'Arial'
});
slide.addText('2. ¿Qué artículos del CCYM aplican?', {
  x: 0.7, y: 3.2, w: 8.6, h: 0.3,
  fontSize: 12, color: colors.text,
  fontFace: 'Arial'
});
slide.addText('3. ¿Qué jurisprudencia es relevante?', {
  x: 0.7, y: 3.6, w: 8.6, h: 0.3,
  fontSize: 12, color: colors.text,
  fontFace: 'Arial'
});
slide.addText('4. ¿Cuál sería la solución recomendada?', {
  x: 0.7, y: 4, w: 8.6, h: 0.3,
  fontSize: 12, color: colors.text,
  fontFace: 'Arial'
});

// Bottom accent
slide.addShape(prs.ShapeType.rect, {
  x: 0, y: 7.2, w: 10, h: 0.3,
  fill: { color: colors.accent }
});

// Slide 5: Comparison/Distinction Template
slide = prs.addSlide();
slide.background = { color: colors.white };

slide.addShape(prs.ShapeType.rect, {
  x: 0, y: 0, w: 10, h: 0.8,
  fill: { color: colors.secondary }
});
slide.addText('COMPARACIÓN Y DIFERENCIAS', {
  x: 0.5, y: 0.2, w: 9, h: 0.4,
  fontSize: 28, bold: true, color: colors.white,
  fontFace: 'Arial'
});

// Left column header
slide.addShape(prs.ShapeType.rect, {
  x: 0.5, y: 1.1, w: 4.3, h: 0.35,
  fill: { color: colors.primary }
});
slide.addText('ASPECTO A', {
  x: 0.7, y: 1.15, w: 3.9, h: 0.25,
  fontSize: 12, bold: true, color: colors.white,
  fontFace: 'Arial'
});

// Right column header
slide.addShape(prs.ShapeType.rect, {
  x: 5.2, y: 1.1, w: 4.3, h: 0.35,
  fill: { color: colors.secondary }
});
slide.addText('ASPECTO B', {
  x: 5.4, y: 1.15, w: 3.9, h: 0.25,
  fontSize: 12, bold: true, color: colors.white,
  fontFace: 'Arial'
});

// Content boxes
for (let i = 0; i < 4; i++) {
  const top = 1.6 + (i * 1.4);
  
  slide.addShape(prs.ShapeType.rect, {
    x: 0.5, y: top, w: 4.3, h: 1.2,
    fill: { color: colors.light },
    line: { color: colors.primary, width: 1 }
  });
  
  slide.addShape(prs.ShapeType.rect, {
    x: 5.2, y: top, w: 4.3, h: 1.2,
    fill: { color: colors.light },
    line: { color: colors.secondary, width: 1 }
  });
}

// Bottom accent
slide.addShape(prs.ShapeType.rect, {
  x: 0, y: 7.2, w: 10, h: 0.3,
  fill: { color: colors.accent }
});

// Slide 6: Closing Slide
slide = prs.addSlide();
slide.background = { color: colors.primary };

slide.addText('PREGUNTAS', {
  x: 0.5, y: 2.8, w: 9, h: 0.8,
  fontSize: 48, bold: true, color: colors.accent,
  align: 'center', fontFace: 'Arial'
});

slide.addText('¿Dudas sobre lo visto en clase?', {
  x: 0.5, y: 3.8, w: 9, h: 0.4,
  fontSize: 20, color: colors.white,
  align: 'center', fontFace: 'Arial'
});

slide.addText('Próxima clase: [Bolilla/Tema]', {
  x: 0.5, y: 5.2, w: 9, h: 0.4,
  fontSize: 16, color: colors.light,
  align: 'center', fontFace: 'Arial', italics: true
});

// Save
prs.writeFile({ fileName: 'TEMPLATE_Clase_Sociedades.pptx' });
console.log('✅ Template PowerPoint creado: TEMPLATE_Clase_Sociedades.pptx');
