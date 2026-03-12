export interface MapData {
  id: string;
  name: string;
  width: number;
  height: number;
  tiles: number[][];
  playerStart: { x: number, y: number };
  npcs: any[];
  chests?: any[];
  signs?: any[];
  exits: any[];
  merchantPos: { x: number, y: number };
  lockConfig?: {
      requiredBugs: string[];
      gatePos: { x: number, y: number };
      guardDialog: string[];
      unlockDialog: string[];
  };
}
