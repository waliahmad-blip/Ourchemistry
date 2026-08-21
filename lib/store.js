import { create } from 'zustand';

export const useAppStore = create((set) => ({
  locale: 'en',
  view: 'hero',
  charge: 0,
  waitlistCount: 12847,
  notificationsEnabled: false,
  setLocale: (locale) => set({ locale }),
  setView: (view) => set({ view }),
  setCharge: (charge) => set({ charge }),
  setWaitlistCount: (waitlistCount) => set({ waitlistCount }),
  setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
}));
