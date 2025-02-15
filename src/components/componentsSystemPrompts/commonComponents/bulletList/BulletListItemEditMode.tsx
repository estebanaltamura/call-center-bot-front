// React
import { useState } from 'react';

// ** Types
import { IOptionTextItem } from 'types';

interface IBulletListItemEditModeProps {
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  itemEditingIndex: number;
  setitemEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
  tempBullets: IOptionTextItem[];
  setTempBullets: React.Dispatch<React.SetStateAction<IOptionTextItem[]>>;
}

const BulletListItemEditMode = ({
  setIsEditing,
  itemEditingIndex,
  setitemEditingIndex,
  tempBullets,
  setTempBullets,
}: IBulletListItemEditModeProps) => {
  const optionInitialValue: string = tempBullets[itemEditingIndex].option;
  const textInitialValue: string = tempBullets[itemEditingIndex].text;

  // States
  const [tempOption, setTempOption] = useState(optionInitialValue);
  const [tempText, setTempText] = useState(textInitialValue);

  // Funciones de edición
  const handleCancelEdit = () => {
    // Revertimos cambios y salimos de edición
    setTempOption(optionInitialValue);
    setTempText(textInitialValue);
    setIsEditing(false);
    setitemEditingIndex(null);
  };

  const handleConfirmEdit = () => {
    // Guardamos en el array global
    setTempBullets((prev) => {
      const updated = [...prev];
      updated[itemEditingIndex] = {
        ...updated[itemEditingIndex],
        option: tempOption,
        text: tempText,
      };
      return updated;
    });
    setIsEditing(false);
    setitemEditingIndex(null);
  };

  return (
    <div className="relative bg-white rounded flex flex-col border-[2px] border-gray-500 pb-2">
      <div className="bg-blue-600 text-white text-center p-2 font-bold">MODO EDICIÓN</div>

      <div className="relative bg-white flex flex-col pt-2 pb-2 px-4 rounded">
        <span className="font-bold mt-2 w-full ml-[7px]">{tempOption}</span>

        <textarea
          value={tempText}
          onChange={(e) => setTempText(e.target.value)}
          rows={14}
          className="border rounded p-2 w-full mt-2 scroll-custom"
        />

        <div className="flex justify-between gap-2 w-full mt-2">
          <button onClick={handleCancelEdit} className="red button button3">
            Cancelar
          </button>
          <button
            disabled={!tempText.trim()}
            onClick={handleConfirmEdit}
            className={`green button button3 ${!tempText.trim() && 'disabled'}`}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulletListItemEditMode;
