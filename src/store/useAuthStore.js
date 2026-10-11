import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import supabase, { isSupabaseConfigured } from '../lib/supabase';
import { syncProfileToCloud, loadAllUserDataFromCloud } from '../lib/supabaseSync';
import useUserStore from './useUserStore';
import useWorkoutStore from './useWorkoutStore';
import useDietStore from './useDietStore';
import useDailyLogStore from './useDailyLogStore';

const syncUserToAllStores = (identifier) => {
  useUserStore.getState().setCurrentUser(identifier);
  useWorkoutStore.getState().setCurrentUser(identifier);
  useDietStore.getState().setCurrentUser(identifier);
  useDailyLogStore.getState().setCurrentUser(identifier);
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isOnboarded: false,
      registeredUsers: {}, // { [email]: { user, isOnboarded: boolean } }

      // Standard Email & Password Login (For existing users)
      login: async (email, password) => {
        const cleanEmail = (email || '').trim().toLowerCase();
        
        // 1. Switch all local stores to this user's data
        syncUserToAllStores(cleanEmail);

        let userId = Date.now().toString();

        // 2. If Supabase is configured, authenticate with Supabase Cloud
        if (isSupabaseConfigured && supabase) {
          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email: cleanEmail,
              password,
            });

            if (error) {
              console.warn('Supabase signIn error, falling back to local:', error.message);
            } else if (data?.user) {
              userId = data.user.id;
              // Hydrate all data from cloud tables
              await loadAllUserDataFromCloud(userId, cleanEmail);
            }
          } catch (err) {
            console.warn('Supabase cloud login error:', err);
          }
        }

        const existingAccount = get().registeredUsers?.[cleanEmail];
        const userProfile = useUserStore.getState().profiles?.[cleanEmail];

        const loggedInUser = {
          id: userId,
          email: cleanEmail,
          name: existingAccount?.user?.name || userProfile?.name || cleanEmail.split('@')[0],
          avatar: null,
        };

        // An existing user logging into their account is ALWAYS treated as onboarded
        // so they go straight to their home dashboard and are never asked to signup again.
        set((state) => ({
          user: loggedInUser,
          isAuthenticated: true,
          isOnboarded: true,
          registeredUsers: {
            ...state.registeredUsers,
            [cleanEmail]: {
              user: loggedInUser,
              isOnboarded: true,
            },
          },
        }));

        return { success: true };
      },

      // New User Registration (Directs to Onboarding wizard)
      register: async (name, email, password) => {
        const cleanEmail = (email || '').trim().toLowerCase();
        let userId = Date.now().toString();

        // 1. Switch all stores to fresh data for this new user
        syncUserToAllStores(cleanEmail);

        // 2. If Supabase is configured, create cloud user in Supabase auth.users & profiles table
        if (isSupabaseConfigured && supabase) {
          try {
            const { data, error } = await supabase.auth.signUp({
              email: cleanEmail,
              password,
              options: {
                data: { name: name.trim() },
              },
            });

            if (error) {
              console.warn('Supabase signUp warning:', error.message);
            } else if (data?.user) {
              userId = data.user.id;
              await syncProfileToCloud(userId, cleanEmail, { name: name.trim() });
            }
          } catch (err) {
            console.warn('Supabase cloud register error:', err);
          }
        }

        const newUser = {
          id: userId,
          name: name.trim(),
          email: cleanEmail,
          avatar: null,
        };

        // Brand new registration: not onboarded yet
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

        return { success: true };
      },

      logout: async () => {
        if (isSupabaseConfigured && supabase) {
          try {
            await supabase.auth.signOut();
          } catch (e) {}
        }

        // Clear active user from all stores
        syncUserToAllStores(null);

        set({
          user: null,
          isAuthenticated: false,
          isOnboarded: false,
        });
      },

      setOnboarded: () => {
        set((state) => {
          const email = (state.user?.email || '').toLowerCase();
          const updatedUsers = { ...state.registeredUsers };
          
          if (email) {
            updatedUsers[email] = {
              ...(updatedUsers[email] || {}),
              user: state.user || updatedUsers[email]?.user,
              isOnboarded: true,
            };
          }

          // If user exists and Supabase configured, sync profile to cloud
          if (state.user?.id && email) {
            const profile = useUserStore.getState().profile;
            syncProfileToCloud(state.user.id, email, profile);
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
        const email = state?.user?.email;
        if (email && state.isAuthenticated) {
          syncUserToAllStores(email);
        }
      },
    }
  )
);

export default useAuthStore;
