import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PageSettingsState {
  title: string;
  setTitle: (title: string) => void;
  clearTitle: () => void;
  socketStatus: boolean | null;
  setSocketStatus: (status: boolean | null) => void;
}

const usePageSettings = create<PageSettingsState>()(
  persist(
    (set) => ({
      title: '',
      setTitle: (title: string) => set({ title }),
      clearTitle: () => set({ title: '' }),
      socketStatus: null,
      setSocketStatus: (status: boolean | null) =>
        set({ socketStatus: status }),
    }),
    {
      name: 'pageSettings',
    },
  ),
);

export { usePageSettings };
