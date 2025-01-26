// ** Context
import { useBusinessContext } from 'contexts/BusinessProvider';

// ** Components
import AddBullet from './addBullet/AddBullet';
import AddService from './addService/AddService';
import OrderedList from './orderedList/OrderedList';

const EditViewContainer = () => {
  const { businessToEdit, handleSave, handleCancel } = useBusinessContext();

  const saveHandler = () => {
    handleSave();
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-center">MODIFICAR SYSTEM PROMPT</h1>
      <div className="space-y-2">
        <label className="block text-xl font-semibold text-center text-gray-700">
          Modificando: {businessToEdit?.title}
        </label>
      </div>

      <AddBullet />
      <AddService />
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
