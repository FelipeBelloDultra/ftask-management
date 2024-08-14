import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  pictureUrl: string | null;
}

interface ActionProps {
  addUser(user: User): void;
  clearUser(): void;
}

interface UserStoreProps {
  state: {
    user: User;
  };
  actions: ActionProps;
}

export const useUserStore = create<UserStoreProps>((set) => ({
  state: {
    user: {
      id: "",
      email: "",
      name: "",
      pictureUrl: null,
    },
  },
  actions: {
    addUser: (user: User) =>
      set(() => ({
        state: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            pictureUrl: user.pictureUrl,
          },
        },
      })),
    clearUser: () =>
      set(() => ({
        state: {
          user: {
            id: "",
            email: "",
            name: "",
            pictureUrl: null,
          },
        },
      })),
  },
}));
