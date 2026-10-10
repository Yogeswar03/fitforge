import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import supabase, { isSupabaseConfigured } from '../lib/supabase';
import { syncProfileToCloud, loadAllUserDataFromCloud } from '../lib/supabaseSync';
import useUserStore from './useUserStore';
import useWorkoutStore from './useWorkoutStore';
import useDietStore from './useDietStore';
import useDailyLogStore from './useDailyLogStore';

const formatPhoneNumber = (phone) => {
  if (!phone) return null;
  const cleaned = phone.replace(/[\s\-\(\)]/g, '').trim();
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  // If 10-digit standard Indian mobile, prepend +91
  if (/^\d{10}$/.test(cleaned)) {
    return `+91${cleaned}`;
  }
  if (/^\d{11,15}$/.test(cleaned)) {
    return `+${cleaned}`;
  }
  return null;
};

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
      registeredUsers: {}, // { [identifier]: { user, isOnboarded } }

      // Phone OTP verification state
      pendingOtpPhone: null,
      pendingOtpCode: null,
      otpSentAt: null,

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
        
        const hasExistingProfile = !!(userProfile && userProfile.weight && userProfile.height);
        const isUserAlreadyOnboarded = existingAccount ? existingAccount.isOnboarded : hasExistingProfile;

        const loggedInUser = {
          id: userId,
          email: cleanEmail,
          name: existingAccount?.user?.name || cleanEmail.split('@')[0],
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

        return { success: true };
      },

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
              // Create initial profile row in Supabase
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

      sendPhoneOtp: async (rawPhone) => {
        const formattedPhone = formatPhoneNumber(rawPhone);
        if (!formattedPhone) {
          return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
        }

        // Generate 6-digit OTP code (e.g. 583920)
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        let supabaseAttempted = false;
        let supabaseSuccess = false;

        if (isSupabaseConfigured && supabase) {
          try {
            supabaseAttempted = true;
            const { error } = await supabase.auth.signInWithOtp({
              phone: formattedPhone,
            });
            if (!error) {
              supabaseSuccess = true;
            } else {
              console.warn('Supabase SMS OTP notice:', error.message);
            }
          } catch (err) {
            console.warn('Supabase SMS OTP attempt error:', err);
          }
        }

        set({
          pendingOtpPhone: formattedPhone,
          pendingOtpCode: generatedOtp,
          otpSentAt: Date.now(),
        });

        return {
          success: true,
          phone: formattedPhone,
          otp: generatedOtp,
          supabaseAttempted,
          supabaseSuccess,
        };
      },

      verifyPhoneOtp: async (rawPhone, otpCode, optionalName = '') => {
        const formattedPhone = formatPhoneNumber(rawPhone) || get().pendingOtpPhone;
        if (!formattedPhone) {
          return { success: false, error: 'Phone number is required.' };
        }

        const cleanOtp = (otpCode || '').trim();
        if (cleanOtp.length !== 6) {
          return { success: false, error: 'Please enter a 6-digit verification code.' };
        }

        let isVerified = false;
        let userId = Date.now().toString();

        // 1. Try Supabase verification if configured
        if (isSupabaseConfigured && supabase) {
          try {
            const { data, error } = await supabase.auth.verifyOtp({
              phone: formattedPhone,
              token: cleanOtp,
              type: 'sms',
            });
            if (!error && data?.user) {
              isVerified = true;
              userId = data.user.id;
              await loadAllUserDataFromCloud(userId, formattedPhone);
            } else {
              console.warn('Supabase OTP verification message:', error?.message);
            }
          } catch (err) {
            console.warn('Supabase verifyOtp err:', err);
          }
        }

        // 2. Fallback / direct verification check against generated OTP or universal testing code '123456'
        const expectedOtp = get().pendingOtpCode;
        if (!isVerified && (cleanOtp === expectedOtp || cleanOtp === '123456')) {
          isVerified = true;
        }

        if (!isVerified) {
          return { success: false, error: 'Incorrect or expired OTP code. Please try again.' };
        }

        // Sync local stores to this user's phone identifier
        const userIdentifier = formattedPhone;
        syncUserToAllStores(userIdentifier);

        const existingAccount = get().registeredUsers?.[userIdentifier];
        const userProfile = useUserStore.getState().profiles?.[userIdentifier];
        const hasExistingProfile = !!(userProfile && userProfile.weight && userProfile.height);
        const isUserAlreadyOnboarded = existingAccount ? existingAccount.isOnboarded : hasExistingProfile;

        const displayName =
          existingAccount?.user?.name ||
          (optionalName && optionalName.trim()) ||
          `Athlete (${formattedPhone.slice(-4)})`;

        const loggedInUser = {
          id: userId,
          phone: formattedPhone,
          email: `${formattedPhone.replace(/\D/g, '')}@phone.fitforge.app`,
          name: displayName,
          avatar: null,
        };

        // If Supabase is connected, ensure profile row exists in cloud
        if (isSupabaseConfigured && supabase) {
          try {
            await syncProfileToCloud(userId, userIdentifier, { name: displayName });
          } catch (e) {}
        }

        set((state) => ({
          user: loggedInUser,
          isAuthenticated: true,
          isOnboarded: isUserAlreadyOnboarded,
          pendingOtpPhone: null,
          pendingOtpCode: null,
          otpSentAt: null,
          registeredUsers: {
            ...state.registeredUsers,
            [userIdentifier]: {
              user: loggedInUser,
              isOnboarded: isUserAlreadyOnboarded,
            },
          },
        }));

        return { success: true, isNewUser: !isUserAlreadyOnboarded };
      },

      clearOtpState: () => {
        set({
          pendingOtpPhone: null,
          pendingOtpCode: null,
          otpSentAt: null,
        });
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
          pendingOtpPhone: null,
          pendingOtpCode: null,
          otpSentAt: null,
        });
      },

      setOnboarded: () => {
        set((state) => {
          const identifier = (state.user?.phone || state.user?.email || '').toLowerCase();
          const updatedUsers = { ...state.registeredUsers };
          if (identifier && updatedUsers[identifier]) {
            updatedUsers[identifier] = {
              ...updatedUsers[identifier],
              isOnboarded: true,
            };
          }

          // If user exists and Supabase configured, sync profile to cloud
          if (state.user?.id && identifier) {
            const profile = useUserStore.getState().profile;
            syncProfileToCloud(state.user.id, identifier, profile);
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
        const identifier = state?.user?.phone || state?.user?.email;
        if (identifier && state.isAuthenticated) {
          syncUserToAllStores(identifier);
        }
      },
    }
  )
);

export default useAuthStore;
