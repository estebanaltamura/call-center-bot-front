// ** 3rd party library
import { v4 as uuidv4 } from 'uuid';

// ** Context
import { useKnowledgeContext } from 'contexts/KnowledgeProvider';

// ** Components
import Typo from 'components/general/Typo';
import BulletListItemEditMode from './BulletListItemEditMode';
import BulletListItemNormalMode from './BulletListItemNormalMode';

interface IBulletListProps {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  itemEditingIndex: number | null;
  setitemEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

const BulletList = ({ isEditing, setIsEditing, itemEditingIndex, setitemEditingIndex }: IBulletListProps) => {
  const { tempKnowledgeData } = useKnowledgeContext();

  if (!tempKnowledgeData.length) {
    return (
      <div className="border border-gray-400 p-4 bg-gray-50 rounded space-y-4">
        <div className="flex justify-center">No hay bullets añadidos</div>
      </div>
    );
  }

  return (
    <div className="border border-gray-400 p-4 bg-gray-50 rounded space-y-4">
      <div className="flex flex-col border border-black rounded">
        <div className="relative bg-blue-600 flex h-[40px] justify-center items-center rounded-t">
          <Typo type="body1Semibold" style={{ color: 'white' }}>
            BULLETS
          </Typo>
        </div>

        <div className="p-4 space-y-2">
          {isEditing && itemEditingIndex !== null ? (
            <BulletListItemEditMode
              setIsEditing={setIsEditing}
              itemEditingIndex={itemEditingIndex}
              setitemEditingIndex={setitemEditingIndex}
            />
          ) : (
            // Modo normal: renderizamos todos los ítems
            tempKnowledgeData.map((_, idx) => (
              <BulletListItemNormalMode
                key={uuidv4()}
                index={idx}
                setIsEditing={setIsEditing}
                itemEditingIndex={null}
                setitemEditingIndex={setitemEditingIndex}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BulletList;
