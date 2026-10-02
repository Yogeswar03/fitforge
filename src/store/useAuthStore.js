import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useUserStore from './useUserStore';
import useWorkoutStore from './useWorkoutStore';
import useDietStore from './useDietStore';
import useDailyLogStore from './useDailyLogStore';

const syncUserToAllStores = (email) => {
  useUserStore.getState().setCurrentUser(email);
  useWorkoutStore.getState().setCurrentUser(email);
  useDietStore.getState().setCurrentUser(email);
  useDailyLogStore.getState().setCurrentUser(email);
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isOnboarded: false,
      registeredUsers: {}, // { [email]: { user, isOnboarded } }

      login: (email, password) => {
        const cleanEmail = (email || '').trim().toLowerCase();
        
        // Switch all stores to this user's data
        syncUserToAllStores(cleanEmail);

        const existingAccount = get().registeredUsers?.[cleanEmail];
        const userProfile = useUserStore.getState().profiles?.[cleanEmail];
        
        const hasExistingProfile = !!(userProfile && userProfile.weight && userProfile.height);
        const isUserAlreadyOnboarded = existingAccount ? existingAccount.isOnboarded : hasExistingProfile;

        const loggedInUser = existingAccount?.user || {
          id: Date.now().toString(),
          email: cleanEmail,
          name: cleanEmail.split('@')[0],
          avatar: null,
        };

        set((state) => ({
          user: loggedInUser,
          isAuthenticated: true,
          isOnboarded: isUserAlreadyOnboarded,
          registeredUsers: {
            ...state.registeredUsers,
            [cleanEmail]: {
              user: loggedInUser,
              isOnboarded: isUserAlreadyOnboarded,
            },
          },
        }));
      },

      register: (name, email, password) => {
        const cleanEmail = (email || '').trim().toLowerCase();
        const newUser = {
          id: Date.now().toString(),
          name: name.trim(),
          email: cleanEmail,
          avatar: null,
        };

        // Switch all stores to fresh data for this new user
        syncUserToAllStores(cleanEmail);

        set((state) => ({
          user: newUser,
          isAuthenticated: true,
          isOnboarded: false,
          registeredUsers: {
            ...state.registeredUsers,
            [cleanEmail]: {
              user: newUser,
              isOnboarded: false,
            },
          },
        }));
      },

      logout: () => {
        // Clear active user from all stores so friend/next login starts with clean slate
        syncUserToAllStores(null);

        set({
          user: null,
          isAuthenticated: false,
        });
      },

      setOnboarded: () => {
        set((state) => {
          const email = state.user?.email?.toLowerCase();
          const updatedUsers = { ...state.registeredUsers };
          if (email && updatedUsers[email]) {
            updatedUsers[email] = {
              ...updatedUsers[email],
              isOnboarded: true,
            };
          }
          return {
            isOnboarded: true,
            registeredUsers: updatedUsers,
          };
        });
      },

      updateUser: (data) => set((state) => ({
        user: { ...state.user, ...data },
      })),
    }),
    {
      name: 'fitforge-auth',
      onRehydrateStorage: () => (state) => {
        // When auth rehydrates from localStorage on page load/refresh, sync current user to all stores
        if (state?.user?.email && state.isAuthenticated) {
          syncUserToAllStores(state.user.email);
        }
      },
    }
  )
);

export default useAuthStore;
