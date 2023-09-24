import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PermissionType = {
  id: string;
  description: string;
  node: string;
};

type RoleType = {
  id: string;
  name: string;
  permissions: PermissionType[];
};

interface UserSettingsState {
  isAdmin: boolean;
  role: RoleType | null;

  setIsAdmin(isAdmin: boolean): void;
  setRole(role: RoleType): void;
  clearRole(): void;
}

const useUserSettings = create<UserSettingsState>()(
  persist(
    (set) => ({
      isAdmin: false,
      role: null,
      setIsAdmin: (isAdmin: boolean) => set({ isAdmin }),
      setRole: (role: RoleType) => set({ role }),
      clearRole: () => set({ role: null }),
    }),
    {
      name: 'userSettings',
    },
  ),
);

export { useUserSettings };
