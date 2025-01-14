import { DocumentData, onSnapshot, QuerySnapshot } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { db } from 'firebaseConfig';
import { createContext, useEffect, useState } from 'react';
import { Conversation } from 'types';

export interface ISettings {
  currentPrompt: string;
}

export const SettingsContext = createContext<ISettings | undefined>(undefined);

const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<ISettings>();

  useEffect(() => {
    const unsubscribeSettings = onSnapshot(
      collection(db, 'settings'),
      (snapshot: QuerySnapshot<DocumentData>) => {
        const settings = snapshot.docs.map((doc) => {
          return doc.data() as ISettings;
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
