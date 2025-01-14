import { promptOptions, useSystemPromptContext } from 'contexts/SystemPromptProvider';
import SystemPromptEditViewListItem from './SystemPromptEditViewListItem';

const SystemPromptEditViewContainer = () => {
  const {
    currentEditSystemPromptDoc,
    handleSave,
    handleCancel,
    newOption,
    setNewOption,
    newText,
    setNewText,
    tempPrompts,
    handleAddPromptItem,
  } = useSystemPromptContext();

  console.log(tempPrompts);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-center">MODIFICAR SYSTEM PROMPT</h1>
      <div className="space-y-2">
        <label className="block text-xl font-semibold text-center text-red-700">
          {currentEditSystemPromptDoc?.title}
        </label>
      </div>
      <div className="border p-4 bg-gray-50 rounded space-y-4">
        <div className="flex items-center space-x-2">
          <select
            className="border rounded px-2 py-2 scroll-custom"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
          >
            {promptOptions.map((section) => (
              <optgroup key={section.label} label={section.label}>
                {section.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <input
            type="text"
            className="border rounded px-2 py-2 flex-1"
            placeholder="Ingresar descripción del bullet"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
          <button onClick={handleAddPromptItem} className="bg-green-500 text-white px-4 py-2 rounded">
            Agregar
          </button>
        </div>
      </div>

      <div className="border p-4 bg-gray-50 rounded space-y-4">
        <h2 className="font-semibold">Bullets</h2>

        <div className="space-y-2">
          {tempPrompts && tempPrompts.length === 0 && <p className="text-gray-400">No hay bullets aún.</p>}
          {tempPrompts &&
            tempPrompts?.map((item, index) => (
              <SystemPromptEditViewListItem
                key={index}
                prompt={item}
                index={index}
                length={tempPrompts.length}
              />
            ))}
        </div>
      </div>
      <div className="space-x-2">
        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
          Guardar
        </button>
        <button onClick={handleCancel} className="bg-gray-300 text-black px-4 py-2 rounded">
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default SystemPromptEditViewContainer;
