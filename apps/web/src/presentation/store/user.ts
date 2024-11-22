import { create } from "zustand";

import { env } from "@/config/env";

interface User {
  id: string;
  name: string;
  email: string;
  pictureUrl: string | null;
}

interface UserActionProps {
  addUser(user: User): void;
  clearUser(): void;
}

interface UserStoreProps {
  state: {
    user: User;
  };
  actions: UserActionProps;
}

interface SignedInActionProps {
  setSignedIn(): void;
  setSignedOut(): void;
}

interface SignedInStoreProps {
  state: {
    isSignedIn: boolean;
  };
  actions: SignedInActionProps;
}

export const useSignedInStore = create<SignedInStoreProps>((set) => ({
  state: {
    isSignedIn: !!localStorage.getItem(env.jwtPrefix),
  },
  actions: {
    setSignedIn: () =>
      set(() => ({
        state: {
          isSignedIn: true,
        },
      })),
    setSignedOut: () =>
      set(() => ({
        state: {
          isSignedIn: false,
        },
      })),
  },
}));

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
