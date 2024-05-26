import { create } from 'zustand';

const useStore = create((set) => ({
  currentForm: null,
  setCurrentForm: (form) => set({ currentForm: form }),
}));

export default useStore;
