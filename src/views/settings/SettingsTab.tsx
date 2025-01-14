import React, { useContext, useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  query,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  DocumentData,
} from 'firebase/firestore';
import { db } from 'firebaseConfig'; // Ajusta la ruta según tu configuración
import { ISettings, SettingsContext } from 'contexts/SettingsProvider';

interface ISystemPromptDoc {
  id: string;
  title: string;
}

const SettingsTab = () => {
  const [prompts, setPrompts] = useState<ISystemPromptDoc[]>([]);
  const [strategy, setStrategy] = useState(''); // Estado para la estrategia
  const settings = useContext(SettingsContext);

  // Obtener el valor actual de currentPrompt desde el contexto
  const { currentPrompt } = settings as ISettings;

  // Cargar la colección systemPrompts en tiempo real
  useEffect(() => {
    const colRef = collection(db, 'systemPrompts');
    const q = query(colRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const temp: ISystemPromptDoc[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as DocumentData;
        temp.push({
          id: docSnap.id,
          title: data.title || '(Sin título)',
        });
      });
      setPrompts(temp);
    });

    return () => unsubscribe();
  }, []);

  // Manejador de cambio en el dropdown
  const handleChangePrompt = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPromptId = e.target.value;

    try {
      const settingsDocRef = doc(db, 'settings', 'global'); // Cambia 'global' por el ID adecuado
      const settingsDoc = await getDoc(settingsDocRef);

      // Si no existe el documento settings, lo creamos
      if (!settingsDoc.exists()) {
        await setDoc(settingsDocRef, { currentPrompt: selectedPromptId });
      } else {
        await updateDoc(settingsDocRef, { currentPrompt: selectedPromptId });
      }
    } catch (error) {
      console.error('Error al actualizar el currentPrompt en Firebase:', error);
      alert('No se pudo actualizar el prompt activo. Intenta de nuevo.');
    }
  };

  // Manejador para guardar la estrategia en Firebase
  const handleSaveStrategy = async () => {
    try {
      const settingsDocRef = doc(db, 'settings', 'global'); // Cambia 'global' por el ID adecuado
      const settingsDoc = await getDoc(settingsDocRef);

      // Si no existe el documento settings, lo creamos
      if (!settingsDoc.exists()) {
        await setDoc(settingsDocRef, { strategy });
      } else {
        await updateDoc(settingsDocRef, { strategy });
      }
      alert('Estrategia guardada correctamente.');
    } catch (error) {
      console.error('Error al guardar la estrategia en Firebase:', error);
      alert('No se pudo guardar la estrategia. Intenta de nuevo.');
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Settings</h1>

      <div className="flex items-center space-x-2">
        <span className="font-semibold">currentPrompt:</span>
        <select
          value={currentPrompt || 'null'}
          onChange={handleChangePrompt}
          className="border rounded px-2 py-1"
        >
          {/* Opción inicial */}
          <option value="null" disabled>
            Selecciona un prompt
          </option>

          {prompts.map((doc) => (
            <option
              key={doc.title}
              value={doc.title}
              className={currentPrompt === doc.title ? 'text-blue-500 font-bold' : ''}
            >
              {doc.title}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block font-semibold">Estrategia para obtención de goals:</label>
        <textarea
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
          style={{ height: '100px' }}
          className="border px-2 py-1 rounded w-full"
          placeholder="Escribe tu estrategia aquí..."
        />
        <button
          onClick={handleSaveStrategy}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Guardar Estrategia
        </button>
      </div>
    </div>
  );
};

export default SettingsTab;
