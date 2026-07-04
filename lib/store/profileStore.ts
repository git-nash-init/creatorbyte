import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile } from "@/lib/types";
import { seedProfile } from "@/lib/mock/data";

interface ProfileState {
  profile: Profile;
  update: (patch: Partial<Profile>) => void;
  updateSocials: (patch: Partial<Profile["socials"]>) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: seedProfile,
      update: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),
      updateSocials: (patch) =>
        set((s) => ({
          profile: { ...s.profile, socials: { ...s.profile.socials, ...patch } },
        })),
    }),
    { name: "cb-profile" }
  )
);
