// ** Context
import { useRulesContext } from 'contexts/RulesProvider';

// ** Components
import AddBullet from './addBullet/AddBullet';
import OrderedList from './orderedList/OrderedList';

const EditViewContainer = () => {
  const { rulesToEdit, handleSave, handleCancel } = useRulesContext();

  const saveHandler = () => {
    handleSave();
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-center">MODIFICAR REGLA</h1>
      <div className="space-y-2">
        <label className="block text-xl font-semibold text-center text-gray-700">
          Modificando: {rulesToEdit?.title}
        </label>
      </div>

      <AddBullet />
      <OrderedList />

      <div className="flex justify-end gap-4 mr-[50px]">
        <button onClick={handleCancel} className="bg-gray-300 text-black px-6 py-2 rounded">
          Cancelar
        </button>
        <button onClick={saveHandler} className="bg-blue-600 text-white px-6 py-2 rounded">
          Guardar
        </button>
      </div>
    </div>
  );
};

export default EditViewContainer;
