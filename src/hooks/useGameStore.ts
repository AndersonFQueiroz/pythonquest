import { create } from 'zustand';

interface PlayerNote {
  title: string;
  content: string[];
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  type: 'consumable' | 'permanent';
}

interface PlayerState {
  name: string;
  gender: 'm' | 'f';
  color: string;
  hp: number;
  maxHp: number;
  level: number;
  xp: number;
  gold: number;
  hasTerminal: boolean;
  hasNotebook: boolean;
  notebookNotes: PlayerNote[];
  inventory: InventoryItem[];
  playerPos: { x: number, y: number };
  currentMapId: string;
  openedChests: string[];
  correctedBugs: string[];
  showUnlockArrow: boolean;
  debugIgnoreBlocks: boolean;
  hasTriggeredUnlock: Record<string, boolean>;
  
  merchantLocation: string;
  merchantMessage: string | null;
  battleCountSinceMove: number;

  setProfile: (name: string, color: string, gender: 'm' | 'f') => void;
  gainTerminal: () => void;
  gainNotebook: () => void;
  addNote: (title: string, content: string[]) => void;
  gainXp: (amount: number) => { leveledUp: boolean };
  deductXp: (amount: number) => void;
  gainGold: (amount: number) => void;
  buyItem: (item: InventoryItem) => { success: boolean, message: string };
  useItem: (itemId: string) => boolean;
  takeDamage: (amount: number) => { isDead: boolean };
  setPlayerPos: (pos: { x: number, y: number }) => void;
  setCurrentMap: (mapId: string) => void;
  openChest: (chestId: string) => void;
  recordBugDefeat: (bugId: string) => boolean;
  setUnlockArrow: (show: boolean) => void;
  setDebugIgnoreBlocks: (val: boolean) => void;
  setTriggeredUnlock: (mapId: string) => void;
  resetPlayer: () => void;
  fullReset: () => void;
  logout: () => Promise<void>;
  moveMerchant: () => void;
  clearMerchantMessage: () => void;
  
  // -- INTEGRAÇÃO SUPABASE --
  userId: string | null;
  setUserId: (id: string | null) => void;
  loadFromCloud: (userId: string) => Promise<boolean>;
  saveToCloud: () => Promise<boolean>;
}

import { supabase } from '../lib/supabase';

export const useGameStore = create<PlayerState>((set, get) => ({
  userId: null,
  name: 'Dev',
  gender: 'm',
  color: '#3498db',
  hp: 100,
  maxHp: 100,
  level: 1,
  xp: 0,
  gold: 100,
  hasTerminal: false,
  hasNotebook: false,
  notebookNotes: [],
  inventory: [],
  playerPos: { x: 2, y: 6 },
  currentMapId: 'village',
  openedChests: [],
  correctedBugs: [],
  showUnlockArrow: false,
  debugIgnoreBlocks: false,
  hasTriggeredUnlock: {},
  
  merchantLocation: 'village',
  merchantMessage: null,
  battleCountSinceMove: 0,

  setUserId: (userId) => set({ userId }),
  
  loadFromCloud: async (userId: string) => {
    try {
        const { data, error } = await supabase.from('saves').select('state').eq('user_id', userId).single();
        if (error || !data) return false;
        
        // Atualiza todo o estado exceto as funções e o ID do usuário
        set({ ...data.state, userId });
        return true;
    } catch (e) {
        console.error('Erro ao carregar save da nuvem:', e);
        return false;
    }
  },

  saveToCloud: async () => {
    const state = get();
    if (!state.userId) return false; // Sem login = save local apenas
    
    // Extrai apenas os DADOS puros (ignorando as funções do Zustand)
    const { 
        name, gender, color, hp, maxHp, level, xp, gold, 
        hasTerminal, hasNotebook, notebookNotes, inventory, playerPos, 
        currentMapId, openedChests, correctedBugs, showUnlockArrow, 
        debugIgnoreBlocks, hasTriggeredUnlock, merchantLocation, battleCountSinceMove 
    } = state;

    const saveData = {
        name, gender, color, hp, maxHp, level, xp, gold,
        hasTerminal, hasNotebook, notebookNotes, inventory, playerPos,
        currentMapId, openedChests, correctedBugs, showUnlockArrow,
        debugIgnoreBlocks, hasTriggeredUnlock, merchantLocation, battleCountSinceMove
    };

    try {
        const { error } = await supabase.from('saves').upsert({ 
            user_id: state.userId, 
            state: saveData,
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
        
        if (error) throw error;
        return true;
    } catch (e) {
        console.error('Erro ao salvar na nuvem:', e);
        return false;
    }
  },

  setProfile: (name, color, gender) => set({ name, color, gender }),
  gainTerminal: () => set({ hasTerminal: true }),
  gainNotebook: () => set({ hasNotebook: true }),
  
  addNote: (title, content) => set((state) => {
    if (state.notebookNotes.some(n => n.title === title)) return state;
    return { notebookNotes: [...state.notebookNotes, { title, content }] };
  }),

  buyItem: (item) => {
    const state = get();
    if (state.gold < item.price) return { success: false, message: "OURO INSUFICIENTE!" };
    
    const existing = state.inventory.find(i => i.id === item.id);
    let newInventory;
    
    if (item.type === 'permanent') {
        if (existing) return { success: false, message: "VOCÊ JÁ POSSUI ESTE UPGRADE!" };
        newInventory = [...state.inventory, { ...item, quantity: 1 }];
        if (item.id === 'ssd_1tb') set({ maxHp: state.maxHp + 20, hp: state.hp + 20 });
    } else {
        if (existing) {
            newInventory = state.inventory.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
        } else {
            newInventory = [...state.inventory, { ...item, quantity: 1 }];
        }
    }

    set({ gold: state.gold - item.price, inventory: newInventory });
    return { success: true, message: "COMPRA REALIZADA!" };
  },

  useItem: (itemId) => {
    const state = get();
    const item = state.inventory.find(i => i.id === itemId);
    if (!item || item.quantity <= 0) return false;

    const newInventory = state.inventory.map(i => 
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
    ).filter(i => i.quantity > 0 || i.type === 'permanent');

    set({ inventory: newInventory });
    return true;
  },

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
    const locations = ['village', 'world1', 'world2'];
    const currentLocation = get().merchantLocation;
    const available = locations.filter(l => l !== currentLocation);
    const next = available[Math.floor(Math.random() * available.length)];
    
    const mapNames: Record<string, string> = {
        'village': 'Vila Inicial',
        'world1': 'Floresta das Variáveis',
        'world2': 'Caverna das Decisões'
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

  fullReset: () => set({
    name: 'Dev',
    gender: 'm',
    color: '#3498db',
    hp: 100,
    maxHp: 100,
    level: 1,
    xp: 0,
    gold: 100,
    hasTerminal: false,
    hasNotebook: false,
    notebookNotes: [],
    inventory: [],
    playerPos: { x: 2, y: 6 },
    currentMapId: 'village',
    openedChests: [],
    correctedBugs: [],
    showUnlockArrow: false,
    debugIgnoreBlocks: false,
    hasTriggeredUnlock: {},
    merchantLocation: 'village',
    merchantMessage: null,
    battleCountSinceMove: 0
  }),

  logout: async () => {
    await supabase.auth.signOut();
    get().fullReset();
    set({ userId: null });
  },

  gainGold: (amount) => {
    set((state) => ({ 
        gold: state.gold + amount,
        battleCountSinceMove: state.battleCountSinceMove + 1 
    }));
    if (get().battleCountSinceMove >= 3) {
        get().moveMerchant();
    }
  },

  setPlayerPos: (pos) => set({ playerPos: pos }),
  setCurrentMap: (mapId) => set({ currentMapId: mapId }),
  openChest: (chestId) => set((state) => ({ openedChests: [...state.openedChests, chestId] })),
  setUnlockArrow: (show) => set({ showUnlockArrow: show }),
  setDebugIgnoreBlocks: (val) => set({ debugIgnoreBlocks: val }),
  setTriggeredUnlock: (mapId) => set((state) => ({ hasTriggeredUnlock: { ...state.hasTriggeredUnlock, [mapId]: true } })),
  recordBugDefeat: (bugId) => {
    const state = get();
    if (!state.correctedBugs.includes(bugId)) {
      set({ correctedBugs: [...state.correctedBugs, bugId] });
      return true;
    }
    return false;
  }
}));
