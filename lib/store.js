import { create } from 'zustand';
import { setSoundMuted as setEngineMuted } from './audio/soundscape.js';

export const useAppStore = create((set) => ({
  locale: 'en',
  view: 'hero',
  charge: 0,
  waitlistCount: 12847,
  notificationsEnabled: false,
  soundMuted: false,
  voiceDna: null,
  currentBondDay: 1,
  vanishReceipt: null,
  setLocale: (locale) => set({ locale }),
  setView: (view) => set({ view }),
  setCharge: (charge) => set({ charge }),
  setWaitlistCount: (waitlistCount) => set({ waitlistCount }),
  setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
  setSoundMuted: (soundMuted) => {
    setEngineMuted(soundMuted);
    set({ soundMuted });
  },
  toggleSound: () => {
    set((s) => {
      const next = !s.soundMuted;
      setEngineMuted(next);
      return { soundMuted: next };
    });
  },
  setVoiceDna: (voiceDna) => set({ voiceDna }),
  setCurrentBondDay: (currentBondDay) => set({ currentBondDay }),
  setVanishReceipt: (vanishReceipt) => set({ vanishReceipt }),
}));
