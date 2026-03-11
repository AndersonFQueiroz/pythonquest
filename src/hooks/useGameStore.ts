import { create } from 'zustand';

interface PlayerState {
  name: string;
  color: string;
  hp: number;
  maxHp: number;
  level: number;
  xp: number;
  gold: number;
  setProfile: (name: string, color: string) => void;
}

export const useGameStore = create<PlayerState>((set) => ({
  name: 'Dev',
  color: '#3498db', // Azul padrão
  hp: 100,
  maxHp: 100,
  level: 1,
  xp: 0,
  gold: 100,
  setProfile: (name, color) => set({ name, color }),
}));
