import { create } from 'zustand';

export type Instrument = 'guitar' | 'piano';

interface ViewState {
  instrument: Instrument;
  setInstrument: (instrument: Instrument) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  instrument: 'guitar',
  setInstrument: (instrument) => set({ instrument }),
}));
