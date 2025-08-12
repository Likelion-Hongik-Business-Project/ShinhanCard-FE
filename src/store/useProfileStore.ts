import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { ProfileData } from "@/types/profile/profile.type";

type ProfileState = {
  profile: ProfileData | null;
  isLoading: boolean;
  error: string | null;
  setProfile: (profile: ProfileData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearProfile: () => void;
};

export const useProfileStore = create<ProfileState>()(
  persist(
    set => ({
      profile: null,
      isLoading: false,
      error: null,
      setProfile: profile => set({ profile, error: null }),
      setLoading: loading => set({ isLoading: loading }),
      setError: error => set({ error, isLoading: false }),
      clearProfile: () => set({ profile: null, error: null, isLoading: false }),
    }),
    {
      name: "profile-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        profile: state.profile,
      }),
    }
  )
);
