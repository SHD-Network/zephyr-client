import { Modules } from '@/app/layoutChild';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppSettingsState {
  version: string;
  setVersion: (version: string) => void;
  modules: Modules;
  setModules: (modules: Modules) => void;
}

const useAppSettings = create<AppSettingsState>()(
  persist(
    (set) => ({
      version: '',
      setVersion: (version: string) => set({ version }),
      modules: {
        calendar: false,
        crops: false,
        defcon: false,
        documents: false,
        home_monitoring: false,
        inventory: false,
        mail: false,
        maps: false,
        messages: false,
        news: false,
        pricing: false,
        security: false,
        wiki: false,
      },
      setModules: (modules: Modules) => set({ modules }),
    }),
    {
      name: 'appSettings',
    },
  ),
);

export { useAppSettings };
