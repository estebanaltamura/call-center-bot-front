import { useSystemPromptContext } from 'contexts/SystemPromptProvider';
import { SERVICES } from 'services/index';
import { Entities, ISystemPromptEntity } from 'types/dynamicSevicesTypes';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const SystemPromptGeneralViewItem = ({ docItem }: { docItem: ISystemPromptEntity }) => {
  const { handleModifyDoc } = useSystemPromptContext();

  // Función para generar el PDF
  const handleDownloadPDF = async () => {
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

      docItem.bullets.forEach((bullet, index) => {
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

        service.items.forEach((item) => {
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

  return (
    <li key={docItem.id} className="border p-2 rounded flex justify-between items-center">
      <div>
        <strong>{docItem.title || '(Sin título)'}</strong>
        <div className="flex gap-1">
          <span className="block text-sm text-gray-600">{docItem.bullets.length} bullets</span>
          <span className="block text-sm text-gray-600">{docItem.services.length} servicios</span>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => handleModifyDoc(docItem.id)}
          className="bg-green-500 text-white px-4 py-1 rounded"
        >
          Modificar
        </button>
        <button
          onClick={() => {
            if (confirm('Confirma que quieres eliminar este documento')) {
              SERVICES.CMS.delete(Entities.systemPrompts, docItem.id);
            } else {
              return;
            }
          }}
          className="bg-red-600 text-white px-1 py-1 rounded flex items-center w-[30px]"
          title="Eliminar"
        >
          🗑️
        </button>
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-500 text-white px-1 py-1 rounded flex items-center w-[30px]"
          title="Descargar PDF"
        >
          ⬇️
        </button>
      </div>
    </li>
  );
};

export default SystemPromptGeneralViewItem;
