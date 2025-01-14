import { ISystemPromptDoc, useSystemPromptContext } from 'contexts/SystemPromptProvider';
import { SERVICES } from 'services/index';
import { Entities } from 'types/dynamicSevicesTypes';

const SystemPromptGeneralViewItem = ({ docItem }: { docItem: ISystemPromptDoc }) => {
  const { handleModifyDoc } = useSystemPromptContext();
  return (
    <li key={docItem.id} className="border p-2 rounded flex justify-between items-center">
      <div>
        <strong>{docItem.title || '(Sin título)'}</strong>
        <span className="block text-sm text-gray-600">{docItem.prompts.length} bullets</span>
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
      </div>
    </li>
  );
};

export default SystemPromptGeneralViewItem;
