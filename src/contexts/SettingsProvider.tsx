// ** React
import { createContext, useEffect, useState } from 'react';

// ** Firebase / Firestore
import { db } from 'firebaseConfig';
import { collection, DocumentData, onSnapshot, QuerySnapshot } from 'firebase/firestore';
import { ISettingsEntity } from 'types/dynamicSevicesTypes';

export const SettingsContext = createContext<ISettingsEntity | undefined>(undefined);

const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<ISettingsEntity>();

  useEffect(() => {
    const unsubscribeSettings = onSnapshot(
      collection(db, 'settings'),
      (snapshot: QuerySnapshot<DocumentData>) => {
        const settings = snapshot.docs.map((doc) => {
          return doc.data() as ISettingsEntity;
        });
        setSettings(settings[0]);
      },
    );

    return () => {
      unsubscribeSettings();
    };
  }, []);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
};

export default SettingsProvider;
