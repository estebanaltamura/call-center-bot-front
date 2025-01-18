// ** Contexts
import { useSystemPromptContext } from 'contexts/SystemPromptsProvider';

// ** Services
import { SERVICES } from 'services/index';

// ** Utils
import UTILS from 'utils';

// ** Types
import { Entities, ISystemPromptEntity } from 'types/dynamicSevicesTypes';

const MainViewItem = ({ docItem }: { docItem: ISystemPromptEntity }) => {
  const { handleModifyDoc } = useSystemPromptContext();

  const handleDownloadPDF = async () => {
    UTILS.createPdfFromSystemPrompt({ docItem });
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

export default MainViewItem;
