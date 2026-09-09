import { create } from 'zustand';

export const useAppStore = create((set) => ({
  locale: 'en',
  view: 'hero',
  charge: 0,
  waitlistCount: 12847,
  notificationsEnabled: false,
  soundMuted: false,
  voiceDna: null,
  currentBondDay: 1,
  setLocale: (locale) => set({ locale }),
  setView: (view) => set({ view }),
  setCharge: (charge) => set({ charge }),
  setWaitlistCount: (waitlistCount) => set({ waitlistCount }),
  setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
  setSoundMuted: (soundMuted) => set({ soundMuted }),
  setVoiceDna: (voiceDna) => set({ voiceDna }),
  setCurrentBondDay: (currentBondDay) => set({ currentBondDay }),
}));
