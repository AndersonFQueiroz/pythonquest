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
  
  // MERCADOR
  merchantLocation: string;
  merchantMessage: string | null;
  battleCountSinceMove: number; // Contador para movimentação

  setProfile: (name: string, color: string) => void;
  gainTerminal: () => void;
  gainXp: (amount: number) => { leveledUp: boolean };
  deductXp: (amount: number) => void;
  gainGold: (amount: number) => void;
  takeDamage: (amount: number) => { isDead: boolean };
  setPlayerPos: (pos: { x: number, y: number }) => void;
  setCurrentMap: (mapId: string) => void;
  openChest: (chestId: string) => void;
  recordBugDefeat: (bugId: string) => boolean;
  resetPlayer: () => void;
  
  moveMerchant: () => void;
  clearMerchantMessage: () => void;
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
  
  merchantLocation: 'village',
  merchantMessage: null,
  battleCountSinceMove: 0,

  setProfile: (name, color) => set({ name, color }),
  gainTerminal: () => set({ hasTerminal: true }),
  
  deductXp: (amount) => set((state) => ({ xp: Math.max(0, state.xp - amount) })),

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
      get().moveMerchant();
    }

    set({ xp: newXp, level: newLevel, maxHp: newMaxHp, hp: newHp });
    return { leveledUp };
  },

  moveMerchant: () => {
    const locations = ['village', 'world1'];
    const currentLocation = get().merchantLocation;
    const available = locations.filter(l => l !== currentLocation);
    const next = available[Math.floor(Math.random() * available.length)];
    
    const mapNames: Record<string, string> = {
        'village': 'Vila Inicial',
        'world1': 'Floresta das Variáveis'
    };

    set({ 
        merchantLocation: next,
        merchantMessage: `O MERCADOR VIAJOU PARA: ${mapNames[next].toUpperCase()}`,
        battleCountSinceMove: 0
    });
  },

  clearMerchantMessage: () => set({ merchantMessage: null }),

  takeDamage: (amount) => {
    const state = get();
    const newHp = Math.max(0, state.hp - amount);
    set({ hp: newHp });
    return { isDead: newHp <= 0 };
  },

  resetPlayer: () => set((state) => ({
    hp: state.maxHp,
    playerPos: { x: 4, y: 6 },
    currentMapId: 'village'
  })),

  gainGold: (amount) => {
    set((state) => ({ 
        gold: state.gold + amount,
        battleCountSinceMove: state.battleCountSinceMove + 1 
    }));
    // Move o mercador a cada 3 vitórias/baús
    if (get().battleCountSinceMove >= 3) {
        get().moveMerchant();
    }
  },

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
