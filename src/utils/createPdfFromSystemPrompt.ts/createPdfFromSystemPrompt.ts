import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { IcompanyEntity, ISystemPrompt } from 'types/dynamicSevicesTypes';

const createPdfFromSystemPrompt = async ({ docItem }: { docItem: IcompanyEntity }) => {
  // Función para generar el PDF
  try {
    const pdfDoc = await PDFDocument.create();

    // Agregar una fuente estándar
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Crear una página
    const page = pdfDoc.addPage([600, 800]);
    const { height } = page.getSize();

    let yPosition = height - 50; // Posición inicial en Y

    // Título
    page.drawText(`Título: ${docItem.title || '(Sin título)'}`, {
      x: 50,
      y: yPosition,
      size: 18,
      font,
      color: rgb(0, 0.53, 0.71), // Azul
    });

    yPosition -= 30;

    // Bullets
    page.drawText('Bullets:', {
      x: 50,
      y: yPosition,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    });
    yPosition -= 20;

    docItem.features.forEach((bullet, index) => {
      page.drawText(`${index + 1}. ${bullet}`, {
        x: 60,
        y: yPosition,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
      yPosition -= 15;
    });

    yPosition -= 20;

    // Servicios
    page.drawText('Servicios:', {
      x: 50,
      y: yPosition,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    });
    yPosition -= 20;

    docItem.services.forEach((service, index) => {
      page.drawText(`${index + 1}. ${service.title}`, {
        x: 60,
        y: yPosition,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
      yPosition -= 15;

      page.drawText(`  Descripción: ${service.description}`, {
        x: 70,
        y: yPosition,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
      yPosition -= 15;

      service.items.forEach((item: any) => {
        page.drawText(`  - ${item.option}: ${item.text}`, {
          x: 80,
          y: yPosition,
          size: 12,
          font,
          color: rgb(0, 0, 0),
        });
        yPosition -= 15;
      });

      yPosition -= 10;
    });

    // Descargar el PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${docItem.title || 'document'}.pdf`;
    link.click();
  } catch (error) {
    console.error('Error al generar el PDF:', error);
  }
};

export default createPdfFromSystemPrompt;
