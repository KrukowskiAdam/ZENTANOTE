import { create } from 'zustand'

type SceneState = {
    pulse: boolean
    togglePulse: () => void
}

export const useSceneStore = create<SceneState>((set) => ({
    pulse: true,
    togglePulse: () => set((state) => ({ pulse: !state.pulse })),
}))
