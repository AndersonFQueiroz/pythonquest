import { create } from 'zustand';

interface PlayerState {
  name: string;
  color: string;
  hp: number;
  maxHp: number;
  level: number;
  xp: number;
  gold: number;
  hasTerminal: boolean;
  playerPos: { x: number, y: number };
  currentMapId: string;
  openedChests: string[];
  correctedBugs: string[];
  
  setProfile: (name: string, color: string) => void;
  gainTerminal: () => void;
  gainXp: (amount: number) => { leveledUp: boolean };
  gainGold: (amount: number) => void;
  takeDamage: (amount: number) => { isDead: boolean };
  setPlayerPos: (pos: { x: number, y: number }) => void;
  setCurrentMap: (mapId: string) => void;
  openChest: (chestId: string) => void;
  recordBugDefeat: (bugId: string) => boolean;
  resetPlayer: () => void; // Para Game Over
}

export const useGameStore = create<PlayerState>((set, get) => ({
  name: 'Dev',
  color: '#3498db',
  hp: 100,
  maxHp: 100,
  level: 1,
  xp: 0,
  gold: 100,
  hasTerminal: false,
  playerPos: { x: 2, y: 6 },
  currentMapId: 'village',
  openedChests: [],
  correctedBugs: [],

  setProfile: (name, color) => set({ name, color }),
  gainTerminal: () => set({ hasTerminal: true }),
  
  gainXp: (amount) => {
    const state = get();
    let newXp = state.xp + amount;
    const xpNeeded = state.level * 100;
    let leveledUp = false;
    let newLevel = state.level;
    let newMaxHp = state.maxHp;
    let newHp = state.hp;

    if (newXp >= xpNeeded) {
      newXp -= xpNeeded;
      newLevel += 1;
      newMaxHp += 20;
      newHp = newMaxHp;
      leveledUp = true;
    }

    set({ xp: newXp, level: newLevel, maxHp: newMaxHp, hp: newHp });
    return { leveledUp };
  },

  takeDamage: (amount) => {
    const state = get();
    const newHp = Math.max(0, state.hp - amount);
    set({ hp: newHp });
    return { isDead: newHp <= 0 };
  },

  resetPlayer: () => set((state) => ({
    hp: state.maxHp, // Recupera vida
    playerPos: { x: 4, y: 6 }, // Volta pra perto da Mentora
    currentMapId: 'village'
  })),

  gainGold: (amount) => set((state) => ({ gold: state.gold + amount })),
  setPlayerPos: (pos) => set({ playerPos: pos }),
  setCurrentMap: (mapId) => set({ currentMapId: mapId }),
  openChest: (chestId) => set((state) => ({ openedChests: [...state.openedChests, chestId] })),
  recordBugDefeat: (bugId) => {
    const state = get();
    if (!state.correctedBugs.includes(bugId)) {
      set({ correctedBugs: [...state.correctedBugs, bugId] });
      return true;
    }
    return false;
  }
}));
