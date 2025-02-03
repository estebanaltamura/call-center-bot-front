// React
import { useState } from 'react';

// ** React router dom
import { useNavigate } from 'react-router-dom';

// ** Services
import { SERVICES } from 'services/index';

// ** Types
import { Entities, IHatEntity, StateTypes } from 'types/dynamicSevicesTypes';

// ** Utils
import UTILS from 'utils';

const MainViewItem = ({
  item,
  setEditItem,
  setMode,
}: {
  item: IHatEntity;
  setEditItem: React.Dispatch<React.SetStateAction<IHatEntity | null>>;
  setMode: React.Dispatch<React.SetStateAction<'main' | 'edit'>>;
}) => {
  const navigate = useNavigate();

  // States
  const [isActive, setIsActive] = useState(false);

  const softDeleteBusinessHandler = async () => {
    await UTILS.POPUPS.twoOptionsPopUp('Confirma que quieres eliminar este sombrero', () =>
      SERVICES.CMS.softDelete(Entities.hats, item.id),
    );
  };

  const hardDeleteBusinessHandler = async () => {
    await UTILS.POPUPS.twoOptionsPopUp(
      'Confirma que quieres eliminar definitivamente este sombrero. No se podrá recuperar',
      () => SERVICES.CMS.delete(Entities.hats, item.id),
    );
  };

  const reactivateBusinessHandler = async () => {
    await UTILS.POPUPS.twoOptionsPopUp('Confirma que quieres reactivar este sombrero', () =>
      SERVICES.CMS.reactivateSoftDeleted(Entities.hats, item.id),
    );
  };

  const editItemHandler = () => {
    setEditItem(item);
    setMode('edit');
  };

  return (
    <li
      key={item.id}
      className={`relative border p-2 rounded flex justify-between items-center`}
      style={{
        backgroundColor: isActive
          ? 'rgba(143, 0, 255, 0.2)'
          : item.softState === StateTypes.active
          ? 'white'
          : 'rgba(156, 163, 175, 0.2)',
        border: `1px solid ${isActive ? 'rgba(143, 0, 255, 1)' : 'rgba(156, 163, 175, 1)'}`,
      }}
    >
      <div className="max-w-96">
        <p className="truncate">
          <strong>{item.title || '(Sin título)'}</strong>
        </p>
      </div>
      <p className="absolute right-1/2 flex justify-end items-center mr-3 font-bold text-blue-600">
        {isActive && 'ACTIVO'}
      </p>

      <div className="flex space-x-2">
        {item.softState === StateTypes.active ? (
          <>
            <button onClick={() => navigate(`/hats/viewer?id=${item.id}`)} className="button button1 blue">
              Ver
            </button>
            <button onClick={editItemHandler} className="button button1 green">
              Editar
            </button>
            <button
              onClick={softDeleteBusinessHandler}
              className="red text-white px-1 py-1 rounded flex items-center w-[40px] h-[40px] justify-center"
              title="Eliminar"
            >
              🗑️
            </button>
          </>
        ) : (
          <button
            onClick={reactivateBusinessHandler}
            className="violet text-white px-1 py-1 rounded flex items-center w-[40px] h-[40px] justify-center"
            title="Reactivar"
          >
            R
          </button>
        )}
        {item.softState === StateTypes.inactive && (
          <button
            onClick={hardDeleteBusinessHandler}
            className="red text-white px-1 py-1 rounded flex items-center w-[40px] h-[40px] justify-center"
            title="Eliminar"
          >
            🗑️
          </button>
        )}
      </div>
    </li>
  );
};

export default MainViewItem;
