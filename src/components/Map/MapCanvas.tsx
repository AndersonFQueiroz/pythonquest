import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { MapData } from '../../maps/types';
import { useMapEngine } from '../../hooks/useMapEngine';
import { useGameStore } from '../../hooks/useGameStore';
import DPad from '../UI/DPad';
import { WORLD1_ENEMIES, WORLD2_ENEMIES, WORLD3_ENEMIES, WORLD4_ENEMIES, WORLD5_ENEMIES } from '../../data/bugs';
import { BugSprite } from '../Battle/BugSprite';

interface MapCanvasProps {
  map: MapData;
  spawnPos: { x: number, y: number } | null;
  onEncounter: () => void;
  onInteract: (npc: any) => void;
  onPortal: (targetMap: string, x: number, y: number) => void;
  onOpenNotebook: () => void;
  isDialogActive: boolean;
}

const TILE_SIZE = 32;
const VIEWPORT_W = 480;
const VIEWPORT_H = 352;

const TILE_COLORS: Record<number, string> = {
  0: '#9bbc0f', 1: '#8bac0f', 2: '#e0f0c0', 3: '#306230', 4: '#0f380f', 5: '#0f380f', 6: '#7f8c8d', 7: '#3498db', 8: '#f1c40f', 10: '#bdc3c7', 11: '#c0392b', 12: '#000000', 13: '#e0f0c0', 14: '#8bac0f', 15: '#e74c3c', 16: '#d35400', 17: '#00d2ff', 18: '#9b59b6', 19: '#e67e22', 20: '#2ecc71', 21: '#f39c12', 22: '#00d2ff', 23: '#f8fafc', 24: '#ffd43b', 25: '#3776ab'
};

const NPC_WANDER_LINES: Record<string, string[]> = {
  'zumbi1':      ['...erro...', 'while True:', 'SyntaxErr...', 'loop...'],
  'aloca':       ['Tipos!', 'int? str?', 'None=caos!', 'Meus potes!'],
  'historiador': ['O Zen...', 'Antes era lindo...', 'Malwarech...', 'except: pass...'],
  'boole':       ['True!', 'False!', 'Sem talvez!', 'if ou else!'],
  'iterador':    ['...bip bop...', 'iter 4.8M', 'cadê o break?!', '∞'],
  'genio':       ['def wish():', 'return magia!', 'escopo!', 'parâmetros!'],
  'arquiteto':   ['class Mundo:', '__init__!', 'self.vida=∞', 'herança!'],
  'historiador': ['O Zen...', 'Antes era lindo...', 'Malwarech...', 'except: pass...'],
};

const MapCanvas: React.FC<MapCanvasProps> = ({ map, spawnPos, onEncounter, onInteract, onPortal, onOpenNotebook, isDialogActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasTriggeredInitialDialog, setHasTriggeredInitialDialog] = useState(false);
  const [showBugDex, setShowBugDex] = useState(false);
  const [wanderingNpcs, setWanderingNpcs] = useState<Record<string, {
    offsetX: number;
    offsetY: number;
    bubble: string | null;
    bubbleTimer: number;
  }>>({});
  
  const { playerPos, isMoving, setManualDir, interact, teleport } = useMapEngine(
    map, 
    isDialogActive ? undefined : onEncounter, 
    isDialogActive ? undefined : onPortal, 
    isDialogActive,
    onInteract 
  );
  
  const { name: playerName, gender: playerGender, color: playerColor, hasTerminal, hasNotebook, openedChests, correctedBugs, merchantLocation, showUnlockArrow } = useGameStore();

  const [bossStage, setBossStage] = useState<'sitting' | 'rising' | 'standing'>('sitting');
  const [triggeredBosses, setTriggeredBosses] = useState<string[]>([]);

  // LÓGICA DE ANIMAÇÃO DO BOSS FINAL
  useEffect(() => {
    if (map.id === 'final_boss' && bossStage === 'sitting') {
        const dist = Math.abs(playerPos.x - 12) + Math.abs(playerPos.y - 10);
        if (dist <= 5) {
            setBossStage('rising');
            setTimeout(() => {
                setBossStage('standing');
                const malwarech = map.npcs.find(n => n.id === 'malwarech');
                if (malwarech && !triggeredBosses.includes('malwarech')) {
                    setTriggeredBosses(prev => [...prev, 'malwarech']);
                    onInteract({ type: 'npc', data: malwarech });
                }
            }, 1500);
        }
    }
  }, [playerPos, map, bossStage, onInteract, triggeredBosses]);

  const isMerchantHere = merchantLocation === map.id;

  // NPCs errantes com balões de fala flutuantes
  useEffect(() => {
    const interval = setInterval(() => {
      setWanderingNpcs(prev => {
        const updated = { ...prev };
        map.npcs.forEach((npc: any) => {
          if (!NPC_WANDER_LINES[npc.id]) return;
          const current = updated[npc.id] || { offsetX: 0, offsetY: 0, bubble: null, bubbleTimer: 0 };
          const newOffX = Math.sin(Date.now() / 1200 + npc.tileX) * 6;
          const newOffY = Math.cos(Date.now() / 1500 + npc.tileY) * 4;
          let bubble = current.bubble;
          let bubbleTimer = current.bubbleTimer - 1;
          if (bubbleTimer <= 0) {
            const lines = NPC_WANDER_LINES[npc.id];
            bubble = Math.random() > 0.4 ? lines[Math.floor(Math.random() * lines.length)] : null;
            bubbleTimer = 80 + Math.floor(Math.random() * 60);
          }
          updated[npc.id] = { offsetX: newOffX, offsetY: newOffY, bubble, bubbleTimer };
        });
        return updated;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [map.npcs]);

  // LÓGICA DE DIÁLOGOS AUTOMÁTICOS (BOSSES E PEP-8)
  useEffect(() => {
    if (isDialogActive) return;

    // 1. Bosses de Reino (Detecção por proximidade de 1 bloco)
    const bosses = map.npcs.filter(n => (n as any).isBoss);
    for (const boss of bosses) {
        if (triggeredBosses.includes(boss.id)) continue; 
        
        const dist = Math.abs(playerPos.x - boss.tileX) + Math.abs(playerPos.y - boss.tileY);
        if (dist <= 1) { 
            setTriggeredBosses(prev => [...prev, boss.id]);
            onInteract({ type: 'npc', data: boss });
            return;
        }
    }

    // 2. Mentora PEP-8 na Vila (Tutorial Inicial)
    if (map.id === 'village' && !hasTerminal && !hasTriggeredInitialDialog) {
      const pep8 = map.npcs.find(n => n.id === 'pep8');
      if (pep8) {
        const dist = Math.abs(playerPos.x - pep8.tileX) + Math.abs(playerPos.y - pep8.tileY);
        if (dist === 1) { 
            setHasTriggeredInitialDialog(true); 
            onInteract({ type: 'npc', data: pep8 }); 
        }
      }
    }
  }, [playerPos, map, hasTriggeredInitialDialog, isDialogActive, onInteract, hasTerminal]);

  useEffect(() => { if (spawnPos) teleport(spawnPos.x, spawnPos.y); }, [spawnPos, teleport]);

  const handleInteractBtn = useCallback(() => {
    if (isDialogActive) return;
    const interaction = interact();
    if (interaction) onInteract(interaction);
  }, [isDialogActive, interact, onInteract]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDialogActive) return;
      const target = e.target as HTMLElement;
      if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') return;
      if (e.key.toLowerCase() === 'e' || e.key === 'Enter') handleInteractBtn();
      if (e.key.toLowerCase() === 'b') setShowBugDex(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInteractBtn, isDialogActive]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !map || !map.tiles) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const now = Date.now();
    const cameraX = Math.floor(Math.max(0, Math.min(playerPos.x * TILE_SIZE - VIEWPORT_W / 2 + TILE_SIZE / 2, map.width * TILE_SIZE - VIEWPORT_W)));
    const cameraY = Math.floor(Math.max(0, Math.min(playerPos.y * TILE_SIZE - VIEWPORT_H / 2 + TILE_SIZE / 2, map.height * TILE_SIZE - VIEWPORT_H)));

    ctx.clearRect(0, 0, VIEWPORT_W, VIEWPORT_H);

    const drawLabel = (text: string, x: number, y: number, color: string = 'rgba(15, 56, 15, 0.9)') => {
      ctx.font = '6px "Press Start 2P"';
      const lines = text.split(/\\n|\n/);
      const lineHeight = 10;
      let maxW = 0;
      lines.forEach(line => {
          const metrics = ctx.measureText(line);
          if (metrics.width > maxW) maxW = metrics.width;
      });
      const w = maxW + 8;
      const h = (lines.length * lineHeight) + 2;
      ctx.fillStyle = color;
      ctx.fillRect(x - w/2, y - h, w, h);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      lines.forEach((line, i) => {
          ctx.fillText(line, x, y - ((lines.length - 1 - i) * lineHeight) - 3);
      });
    };

    const isCave = map.id === 'world2';
    const isTower = map.id === 'world3';
    const isOasis = map.id === 'world4';
    const isCastle = map.id === 'world5';
    const isFinal = map.id === 'final_boss';
    
    let floorColor = TILE_COLORS[0];
    let pathColor = TILE_COLORS[2];
    if (isCave) { floorColor = '#1e293b'; pathColor = '#334155'; }
    else if (isTower) { floorColor = '#0f172a'; pathColor = '#1e293b'; }
    else if (isOasis) { floorColor = '#f1c40f'; pathColor = '#e67e22'; }
    else if (isCastle) { floorColor = '#1e293b'; pathColor = '#3776ab'; }
    else if (isFinal) { floorColor = '#000'; pathColor = '#c0392b'; }

    ctx.fillStyle = floorColor;
    ctx.fillRect(0, 0, VIEWPORT_W, VIEWPORT_H);

    map.tiles.forEach((row, y) => {
      if (!row) return;
      row.forEach((tile, x) => {
        const tx = x * TILE_SIZE - cameraX;
        const ty = y * TILE_SIZE - cameraY;
        if (tx < -TILE_SIZE || tx > VIEWPORT_W || ty < -TILE_SIZE || ty > VIEWPORT_H) return;

        if (tile === 0) {
            ctx.fillStyle = floorColor; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
            if (isFinal) {
                ctx.strokeStyle = '#96281b'; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(tx, ty + 16); ctx.lineTo(tx + 32, ty + 16); ctx.moveTo(tx + 16, ty); ctx.lineTo(tx + 16, ty + 32); ctx.stroke();
            }
        }
        if (tile === 2 || tile === 12) { ctx.fillStyle = pathColor; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE); }
        if (tile === 1) {
          ctx.fillStyle = isCave ? 'rgba(46, 204, 113, 0.2)' : (isCastle ? 'rgba(55, 118, 171, 0.2)' : TILE_COLORS[1]); 
          ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = isCave ? '#2ecc71' : (isCastle ? '#3776ab' : '#306230');
          for(let i=0; i<3; i++) {
            const ox = i * 8 + 4;
            ctx.beginPath(); ctx.moveTo(tx + ox, ty + 20); ctx.lineTo(tx + ox + 4, ty + 12); ctx.lineTo(tx + ox + 8, ty + 20); ctx.fill();
          }
        }
        if (tile === 6) {
          ctx.fillStyle = isCastle ? '#ffd43b' : (isFinal ? '#c0392b' : '#7f8c8d');
          ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
          ctx.strokeStyle = '#2c3e50'; ctx.lineWidth = 2; ctx.strokeRect(tx + 2, ty + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        }
        if (tile === 7 || tile === 22 || tile === 19) {
          ctx.fillStyle = tile === 19 ? '#c0392b' : (tile === 22 ? '#00d2ff' : '#3498db');
          ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = 'rgba(255,255,255,0.3)';
          const wave = Math.sin(now / 500 + (x+y)) * 4;
          ctx.fillRect(tx + 4 + wave, ty + 8, 8, 2);
          ctx.fillRect(tx + 16 - wave, ty + 20, 8, 2);
        }
        if (tile === 23) { ctx.fillStyle = '#f8fafc'; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE); ctx.strokeStyle = '#e2e8f0'; ctx.strokeRect(tx, ty, TILE_SIZE, TILE_SIZE); }
        if (tile === 24) { ctx.fillStyle = floorColor; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE); ctx.strokeStyle = '#ffd43b'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tx, ty + 16); ctx.lineTo(tx + 32, ty + 16); ctx.stroke(); }
        if (tile === 25) { ctx.fillStyle = floorColor; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE); const float = Math.sin(now / 600 + (x*y)) * 5; ctx.fillStyle = '#3776ab'; ctx.beginPath(); ctx.moveTo(tx + 16, ty + 8 + float); ctx.lineTo(tx + 24, ty + 20 + float); ctx.lineTo(tx + 16, ty + 32 + float); ctx.lineTo(tx + 8, ty + 20 + float); ctx.fill(); }
        
        // --- NOVOS TILES DA PLAYER HOUSE ---
        if (tile === 9) { 
            // Chão de madeira (tabuas)
            ctx.fillStyle = '#8d6e63'; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
            ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(tx, ty + 10); ctx.lineTo(tx + TILE_SIZE, ty + 10); ctx.moveTo(tx, ty + 22); ctx.lineTo(tx + TILE_SIZE, ty + 22); ctx.stroke();
        }
        if (tile === 26) { 
            // Cama
            ctx.fillStyle = '#8d6e63'; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE); // chão
            ctx.fillStyle = '#c0392b'; ctx.fillRect(tx + 4, ty + 12, 24, 20); // cobertor
            ctx.fillStyle = '#fff'; ctx.fillRect(tx + 4, ty + 4, 24, 8); // travesseiro
            ctx.strokeStyle = '#000'; ctx.strokeRect(tx + 4, ty + 4, 24, 28);
        }
        if (tile === 27) {
            // PC / Terminal de Estudos
            ctx.fillStyle = '#8d6e63'; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE); // chão
            ctx.fillStyle = '#34495e'; ctx.fillRect(tx + 6, ty + 10, 20, 14); // monitor base
            ctx.fillStyle = '#111'; ctx.fillRect(tx + 8, ty + 12, 16, 10); // tela
            ctx.fillStyle = '#2ecc71'; ctx.font = '5px Arial'; ctx.fillText(">_", tx + 10, ty + 18); // código
            ctx.fillStyle = '#7f8c8d'; ctx.fillRect(tx + 14, ty + 24, 4, 4); // suporte
            ctx.fillRect(tx + 8, ty + 28, 16, 2); // teclado
        }
        if (tile === 28) {
            // Prateleira de Livros
            ctx.fillStyle = '#8d6e63'; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE); // chão
            ctx.fillStyle = '#5d4037'; ctx.fillRect(tx + 2, ty + 2, 28, 28); // estante
            ctx.fillStyle = '#3e2723'; ctx.fillRect(tx + 4, ty + 4, 24, 10); ctx.fillRect(tx + 4, ty + 16, 24, 12); // fundos
            // Livrinhos coloridos
            ctx.fillStyle = '#3498db'; ctx.fillRect(tx + 6, ty + 6, 4, 8);
            ctx.fillStyle = '#e74c3c'; ctx.fillRect(tx + 12, ty + 6, 3, 8);
            ctx.fillStyle = '#f1c40f'; ctx.fillRect(tx + 17, ty + 6, 5, 8);
            ctx.fillStyle = '#2ecc71'; ctx.fillRect(tx + 8, ty + 18, 4, 10);
            ctx.fillStyle = '#9b59b6'; ctx.fillRect(tx + 14, ty + 20, 8, 8);
        }
        if (tile === 29) {
            // Porta
            ctx.fillStyle = '#3e2723'; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#5d4037'; ctx.fillRect(tx + 4, ty + 4, 24, 28);
            ctx.fillStyle = '#f1c40f'; ctx.beginPath(); ctx.arc(tx + 24, ty + 16, 2, 0, Math.PI*2); ctx.fill();
        }

        if (tile === 20) { ctx.fillStyle = floorColor; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE); ctx.fillStyle = '#795548'; ctx.fillRect(tx + 14, ty + 16, 4, 16); ctx.fillStyle = '#2ecc71'; const sway = Math.sin(now / 800) * 2; ctx.beginPath(); ctx.moveTo(tx + 16 + sway, ty + 4); ctx.lineTo(tx + 4 + sway, ty + 16); ctx.lineTo(tx + 28 + sway, ty + 16); ctx.fill(); ctx.beginPath(); ctx.moveTo(tx + 16 - sway, ty + 10); ctx.lineTo(tx + 0 - sway, ty + 22); ctx.lineTo(tx + 32 - sway, ty + 22); ctx.fill(); }
        if (tile === 21) { ctx.fillStyle = '#f39c12'; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE); ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fillRect(tx, ty, TILE_SIZE, 4); }
        if (tile === 16) { ctx.save(); ctx.translate(tx + 16, ty + 16); ctx.rotate((now / 1000) * ( (x+y)%2 === 0 ? 1 : -1 )); ctx.fillStyle = '#7f8c8d'; for(let i=0; i<8; i++) { ctx.rotate(Math.PI/4); ctx.fillRect(-12, -12, 24, 24); } ctx.fillStyle = '#95a5a6'; ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = floorColor; ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI*2); ctx.fill(); ctx.restore(); }
        if (tile === 17) { ctx.fillStyle = floorColor; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE); ctx.strokeStyle = '#00d2ff'; ctx.lineWidth = 2; ctx.globalAlpha = 0.3 + Math.sin(now / 300) * 0.2; ctx.beginPath(); ctx.moveTo(tx, ty + 16); ctx.lineTo(tx + 32, ty + 16); if ((x+y)%2 === 0) { ctx.moveTo(tx + 16, ty); ctx.lineTo(tx + 16, ty + 32); } ctx.stroke(); ctx.globalAlpha = 1.0; ctx.fillStyle = '#00d2ff'; ctx.fillRect(tx + 14, ty + 14, 4, 4); }
        if (tile === 18) { ctx.fillStyle = floorColor; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE); ctx.fillStyle = '#9b59b6'; const glow = 0.5 + Math.sin(now / 400) * 0.5; ctx.globalAlpha = glow; ctx.beginPath(); ctx.moveTo(tx + 16, ty + 4); ctx.lineTo(tx + 24, ty + 24); ctx.lineTo(tx + 8, ty + 24); ctx.fill(); ctx.globalAlpha = 1.0; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.stroke(); }
        if (tile === 4 || tile === 5) { ctx.fillStyle = isCave || isTower || isCastle || isFinal ? '#334155' : '#0f380f'; if (isFinal) ctx.fillStyle = '#1a1a1a'; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE); if (isCave || isTower || isOasis || isCastle || isFinal) { ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fillRect(tx, ty, TILE_SIZE, 4); ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(tx, ty + TILE_SIZE - 4, TILE_SIZE, 4); } }
        if (tile === 3) { const sway = Math.sin(now / 1000) * 2; ctx.fillStyle = '#795548'; ctx.fillRect(tx + 14 + sway, ty + 16, 4, 16); ctx.fillStyle = isCave ? '#475569' : (isFinal ? '#000' : '#306230'); ctx.beginPath(); ctx.arc(tx + 16 + sway, ty + 12, 10, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(tx + 8 + sway, ty + 18, 8, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(tx + 24 + sway, ty + 18, 8, 0, Math.PI * 2); ctx.fill(); }
        if (tile === 10) { ctx.fillStyle = '#bdc3c7'; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE); ctx.strokeStyle = '#95a5a6'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(tx, ty+10); ctx.lineTo(tx+TILE_SIZE, ty+10); ctx.moveTo(tx, ty+20); ctx.lineTo(tx+TILE_SIZE, ty+20); ctx.stroke(); if (x % 2 === 0) { ctx.fillStyle = '#2c3e50'; ctx.fillRect(tx + 10, ty + 4, 12, 10); ctx.strokeStyle = '#fff'; ctx.strokeRect(tx + 10, ty + 4, 12, 10); } }
        if (tile === 11) { ctx.fillStyle = '#c0392b'; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE); ctx.strokeStyle = '#96281b'; ctx.beginPath(); for(let i=0; i<TILE_SIZE; i+=8) { ctx.moveTo(tx + i, ty); ctx.lineTo(tx + i, ty + TILE_SIZE); } for(let j=0; j<TILE_SIZE; j+=8) { ctx.moveTo(tx, ty + j); ctx.lineTo(tx + TILE_SIZE, ty + j); } ctx.stroke(); }
        if (tile === 13) { ctx.fillStyle = '#4b2c20'; ctx.fillRect(tx + 14, ty + 16, 4, 16); ctx.fillStyle = '#fdf6e3'; ctx.fillRect(tx + 4, ty + 6, 24, 14); ctx.strokeStyle = '#4b2c20'; ctx.lineWidth = 2; ctx.strokeRect(tx + 4, ty + 6, 24, 14); }
        if (tile === 8) { const isOpen = openedChests.includes(`${map.id}_${x}_${y}`); ctx.fillStyle = isOpen ? '#306230' : '#141e30'; ctx.fillRect(tx + 4, ty + 12, 24, 16); if (!isOpen) { ctx.fillStyle = '#f1c40f'; ctx.fillRect(tx + 4, ty + 14, 24, 4); if (Math.floor(now/200) % 10 < 5) { ctx.fillStyle = '#fff'; ctx.fillRect(tx + 14, ty + 16, 4, 4); } } }
      });
    });

    if (isMerchantHere) {
        const mx = Math.floor(map.merchantPos.x * TILE_SIZE - cameraX);
        const my = Math.floor(map.merchantPos.y * TILE_SIZE - cameraY);
        ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(mx + 8, my + 28, 16, 4);
        ctx.fillStyle = '#e67e22'; ctx.fillRect(mx + 6, my + 12, 20, 16); 
        ctx.fillStyle = '#ff8c00'; ctx.fillRect(mx + 8, my + 2, 16, 12);
        ctx.fillStyle = '#0f172a'; ctx.fillRect(mx + 10, my + 5, 12, 7);
        ctx.fillStyle = '#00d2ff';
        const eyeGlow = 0.4 + Math.sin(now / 200) * 0.4;
        ctx.globalAlpha = eyeGlow;
        ctx.fillRect(mx + 12, my + 7, 2, 2); ctx.fillRect(mx + 18, my + 7, 2, 2);
        ctx.globalAlpha = 1.0;
        drawLabel("MERCADOR", mx + 16, my - 6, '#ff8c00');
    }

    map.npcs.forEach(npc => {
      const nx = Math.floor(npc.tileX * TILE_SIZE - cameraX);
      const ny = Math.floor(npc.tileY * TILE_SIZE - cameraY);
      if (nx < -TILE_SIZE*4 || nx > VIEWPORT_W + TILE_SIZE*4 || ny < -TILE_SIZE*4 || ny > VIEWPORT_H + TILE_SIZE*4) return;

      const pulse = Math.sin(now / 200) * 5;

      if (npc.id === 'glitch_byte') {
          ctx.save(); ctx.translate(nx + 16, ny + 16);
          ctx.fillStyle = '#111'; ctx.fillRect(-16, -16, 32, 32);
          const colors = ['#3776ab', '#ffd43b', '#fff', '#ff4757', '#2ecc71', '#9b59b6'];
          for(let i=0; i<20; i++) { 
              ctx.fillStyle = colors[Math.floor(Math.random()*colors.length)]; 
              ctx.fillRect(-16 + Math.random()*32, -16 + Math.random()*32, 3, 3); 
          }
          ctx.strokeStyle = `rgba(55, 118, 171, ${0.5 - Math.sin(now/200)*0.5})`; 
          ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 10 + pulse/2, 0, Math.PI*2); ctx.stroke();
          ctx.fillStyle = '#ff4757'; ctx.fillRect(-2, -2, 4, 4);
          ctx.restore();
      } else if (npc.id === 'logic_void') {
          const rot = now / 1000;
          const voidGrd = ctx.createLinearGradient(nx+16 + Math.cos(rot)*15, ny+16 + Math.sin(rot)*15, nx+16 - Math.cos(rot)*15, ny+16 - Math.sin(rot)*15);
          voidGrd.addColorStop(0, '#3498db'); voidGrd.addColorStop(0.5, '#111'); voidGrd.addColorStop(1, '#e74c3c');
          ctx.fillStyle = voidGrd; ctx.beginPath(); ctx.arc(nx+16, ny+16, 14 + pulse/2, 0, Math.PI*2); ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.ellipse(nx+16, ny+16, 16, 4, now/500, 0, Math.PI*2); ctx.stroke();
          ctx.beginPath(); ctx.ellipse(nx+16, ny+16, 16, 4, now/500 + Math.PI/2, 0, Math.PI*2); ctx.stroke();
          ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(nx+16, ny+16, 3, 6, 0, 0, Math.PI*2); ctx.fill();
      } else if (npc.id === 'stack_overlord') {
          ctx.fillStyle = '#1a1a1a'; ctx.fillRect(nx + 4, ny + 4, 4, 28); ctx.fillRect(nx + 24, ny + 4, 4, 28); // Pistões
          ctx.fillStyle = '#f39c12'; ctx.fillRect(nx + 4, ny + 14 + Math.sin(now/200)*6, 4, 6); ctx.fillRect(nx + 24, ny + 14 + Math.cos(now/200)*6, 4, 6);
          const gearGrd = ctx.createRadialGradient(nx+16, ny+16, 2, nx+16, ny+16, 12);
          gearGrd.addColorStop(0, '#e74c3c'); gearGrd.addColorStop(1, '#2c3e50');
          ctx.fillStyle = gearGrd; ctx.beginPath(); ctx.arc(nx+16, ny+16, 10, 0, Math.PI*2); ctx.fill();
          ctx.strokeStyle = '#f1c40f'; ctx.lineWidth = 1; ctx.stroke();
          ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(nx+16, ny+16, 3 + pulse/3, 0, Math.PI*2); ctx.fill();
      } else if (npc.id === 'protocol_def') {
          ctx.fillStyle = 'rgba(155, 89, 182, 0.4)'; ctx.beginPath(); ctx.arc(nx+16, ny+16, 16 + pulse/2, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#8e44ad'; ctx.beginPath(); ctx.moveTo(nx+16, ny+28); ctx.quadraticCurveTo(nx+28, ny+16, nx+16, ny+8); ctx.quadraticCurveTo(nx+4, ny+16, nx+16, ny+28); ctx.fill();
          ctx.fillStyle = '#f1c40f'; ctx.beginPath(); ctx.ellipse(nx+16, ny+6, 6, 3, 0, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#00d2ff'; ctx.fillRect(nx+15, ny+3, 2, 4);
          ctx.fillStyle = '#fff'; ctx.font = '6px Arial'; ctx.fillText("def", nx+8 + Math.cos(now/500)*10, ny+16 + Math.sin(now/500)*5);
      } else if (npc.id === 'meta_class') {
          ctx.save(); ctx.translate(nx+16, ny+16); ctx.rotate(Math.sin(now/1000)*0.2);
          ctx.fillStyle = '#fdf6e3'; ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(12, -7); ctx.lineTo(12, 7); ctx.lineTo(0, 14); ctx.lineTo(-12, 7); ctx.lineTo(-12, -7); ctx.closePath(); ctx.fill();
          ctx.strokeStyle = '#3498db'; ctx.lineWidth = 1; ctx.stroke();
          ctx.fillStyle = '#00d2ff'; ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(6, 0); ctx.lineTo(0, 6); ctx.lineTo(-6, 0); ctx.fill();
          ctx.restore();
          ctx.fillStyle = '#fff'; ctx.font = '6px Arial'; ctx.fillText("class", nx+16, ny+8);
      } else if (npc.id === 'malwarech') {
          const sizeMult = bossStage === 'sitting' ? 2.5 : (bossStage === 'rising' ? 3.0 : 4.5);
          const centerX = nx + 16; const bossY = ny - (bossStage !== 'sitting' ? 60 : 0);
          
          // Fundo de chamas
          ctx.fillStyle = 'rgba(192, 57, 43, 0.3)'; ctx.fillRect(centerX - 64, ny - 32, 128, 80); 
          ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 2; ctx.strokeRect(centerX - 64, ny - 32, 128, 80);
          
          // Asas
          const wingScale = 1 + Math.sin(now / 300) * 0.1;
          ctx.fillStyle = '#111'; ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 1;
          if (bossStage !== 'sitting') { 
              ctx.beginPath(); ctx.moveTo(centerX, bossY); ctx.quadraticCurveTo(centerX - 60*sizeMult, bossY - 40*wingScale, centerX - 80*sizeMult, bossY - 10); ctx.lineTo(centerX - 30*sizeMult, bossY + 20); ctx.fill(); ctx.stroke();
              ctx.beginPath(); ctx.moveTo(centerX, bossY); ctx.quadraticCurveTo(centerX + 60*sizeMult, bossY - 40*wingScale, centerX + 80*sizeMult, bossY - 10); ctx.lineTo(centerX + 30*sizeMult, bossY + 20); ctx.fill(); ctx.stroke();
          }
          
          // Corpo
          const bodyW = 16 * sizeMult; const bodyH = 32 * sizeMult;
          const bodyPulse = 1 + Math.sin(now / 150) * 0.05;
          ctx.save(); ctx.translate(centerX, bossY); ctx.scale(bodyPulse, bodyPulse);
          ctx.fillStyle = '#96281b'; ctx.beginPath(); ctx.moveTo(-bodyW/2, 0); ctx.lineTo(bodyW/2, 0); ctx.lineTo(bodyW/3, bodyH); ctx.lineTo(-bodyW/3, bodyH); ctx.fill();
          
          // Chifres
          ctx.strokeStyle = '#000'; ctx.lineWidth = 4 * sizeMult/2;
          ctx.beginPath(); ctx.arc(-10*sizeMult, -10*sizeMult, 8*sizeMult, Math.PI, Math.PI*1.5); ctx.stroke();
          ctx.beginPath(); ctx.arc(10*sizeMult, -10*sizeMult, 8*sizeMult, Math.PI*1.5, 0); ctx.stroke();
          
          // Cabeça e Olhos
          ctx.fillStyle = '#222'; ctx.fillRect(-12*sizeMult, -15*sizeMult, 24*sizeMult, 20*sizeMult);
          ctx.fillStyle = '#ffdbac'; ctx.shadowBlur = 5; ctx.shadowColor = '#ff4757';
          ctx.fillRect(-8*sizeMult, -8*sizeMult, 6*sizeMult, 4*sizeMult); ctx.fillRect(2*sizeMult, -8*sizeMult, 6*sizeMult, 4*sizeMult);
          ctx.shadowBlur = 0;
          ctx.restore();
          
          // Matriz
          ctx.fillStyle = '#ff4757'; ctx.font = '8px Arial';
          for(let i=0; i<3; i++) ctx.fillText("1", centerX - 40 + Math.random()*80, ny - 30 + Math.random()*70);
      } else if (npc.id === 'pytetor') {
          const hover = Math.sin(now / 600) * 2;
          ctx.fillStyle = '#bdc3c7'; ctx.fillRect(nx + 8, ny + 12 + hover, 16, 18); 
          ctx.fillStyle = '#ecf0f1'; ctx.fillRect(nx + 10, ny + 14 + hover, 2, 10); 
          ctx.strokeStyle = '#3776ab'; ctx.lineWidth = 1; ctx.strokeRect(nx + 8, ny + 12 + hover, 16, 18);
          ctx.fillStyle = '#7f8c8d'; ctx.fillRect(nx + 10, ny + 2 + hover, 12, 10);
          ctx.fillStyle = '#2c3e50'; ctx.fillRect(nx + 11, ny + 5 + hover, 10, 2); 
          ctx.fillStyle = '#ff4757'; ctx.fillRect(nx + 14, ny - 2 + hover, 4, 4); 
          ctx.fillStyle = '#3776ab'; ctx.beginPath(); ctx.arc(nx + 6, ny + 20 + hover, 8, 0, Math.PI*2); ctx.fill();
          ctx.strokeStyle = '#ffd43b'; ctx.lineWidth = 2; ctx.stroke();
          ctx.fillStyle = '#ffd43b'; ctx.font = 'bold 8px Arial'; ctx.textAlign = 'center'; ctx.fillText("S", nx + 6, ny + 23 + hover);
          const spearShake = Math.sin(now / 100) * 1;
          ctx.strokeStyle = '#95a5a6'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(nx + 26 + spearShake, ny + 28); ctx.lineTo(nx + 26 + spearShake, ny + 4 + hover); ctx.stroke();
          ctx.fillStyle = '#bdc3c7'; ctx.beginPath(); 
          ctx.moveTo(nx + 23 + spearShake, ny + 4 + hover); 
          ctx.lineTo(nx + 26 + spearShake, ny - 4 + hover); 
          ctx.lineTo(nx + 29 + spearShake, ny + 4 + hover); ctx.fill();
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.stroke();
      } else if (npc.id === 'pep8') {
          const hover = Math.sin(now / 400) * 2;
          // Manto da Sabedoria
          ctx.fillStyle = '#1b5e20'; ctx.fillRect(nx + 6, ny + 14, 20, 16); 
          ctx.fillStyle = '#2ecc71'; ctx.fillRect(nx + 10, ny + 16, 12, 14); // Detalhe Central
          // Rosto e Cabelo
          ctx.fillStyle = '#ffdbac'; ctx.fillRect(nx + 10, ny + 4 + hover, 12, 12);
          ctx.fillStyle = '#e0e0e0'; ctx.fillRect(nx + 8, ny + 2 + hover, 16, 6); // Cabelo grisalho topo
          ctx.fillRect(nx + 8, ny + 4 + hover, 4, 12); ctx.fillRect(nx + 20, ny + 4 + hover, 4, 12); // Lados
          // Olhos Binários Sábios
          ctx.fillStyle = '#000'; ctx.fillRect(nx + 12, ny + 9 + hover, 2, 2); ctx.fillRect(nx + 18, ny + 9 + hover, 2, 2);
          // Cajado de Código
          ctx.strokeStyle = '#795548'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(nx + 4, ny + 28); ctx.lineTo(nx + 4, ny + 8 + hover); ctx.stroke();
          ctx.fillStyle = '#ffd43b'; ctx.beginPath(); ctx.arc(nx + 4, ny + 6 + hover, 4, 0, Math.PI*2); ctx.fill();
      } else if (npc.id === 'zumbi1') {
          // CLAUDIO, O HABITANTE CORROMPIDO (GLITCH)
          const glitchX = Math.random() > 0.9 ? (Math.random()-0.5)*10 : 0;
          ctx.save(); ctx.globalAlpha = 0.7 + Math.sin(now/50)*0.3;
          // Corpo desbotado
          ctx.fillStyle = '#455a64'; ctx.fillRect(nx + 8 + glitchX, ny + 14, 16, 14);
          ctx.fillStyle = '#ffdbac'; ctx.fillRect(nx + 10 + glitchX, ny + 4, 12, 12);
          // Efeito de Erro no Cabelo
          ctx.fillStyle = '#000'; ctx.fillRect(nx + 10 + glitchX, ny + 2, 12, 4);
          // Olhos: Um normal, um "glitch" (quadrado vermelho)
          ctx.fillStyle = '#000'; ctx.fillRect(nx + 12 + glitchX, ny + 9, 2, 2);
          ctx.fillStyle = '#ff4757'; ctx.fillRect(nx + 18 + glitchX, ny + 8, 3, 3);
          // Partículas de Erro
          if (Math.random() > 0.8) {
              ctx.fillStyle = '#2ecc71'; ctx.fillRect(nx + 16 + (Math.random()-0.5)*20, ny + 16 + (Math.random()-0.5)*20, 2, 2);
          }
          ctx.restore();
      } else if (npc.id === 'aloca') {
          ctx.fillStyle = '#8e44ad'; ctx.fillRect(nx + 8, ny + 14, 16, 14); ctx.fillStyle = '#ffdbac'; ctx.fillRect(nx + 10, ny + 4, 12, 12); ctx.fillStyle = '#f1c40f'; ctx.fillRect(nx + 10, ny + 4, 12, 3);
          const pots = ['#e74c3c', '#3498db', '#f1c40f']; pots.forEach((color, i) => { const offX = Math.sin(now / 400 + i) * 15; const offY = Math.cos(now / 400 + i) * 10 - 10; ctx.fillStyle = color; ctx.fillRect(nx + 16 + offX, ny + 16 + offY, 6, 8); });
      } else if (npc.id === 'boole') {
          ctx.fillStyle = '#34495e'; ctx.fillRect(nx + 4, ny + 2, 24, 28); ctx.fillStyle = '#3498db'; ctx.fillRect(nx + 4, ny + 2, 12, 28); ctx.fillStyle = '#e74c3c'; ctx.fillRect(nx + 16, ny + 2, 12, 28); ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.strokeRect(nx + 4, ny + 2, 24, 28);
      } else if (npc.id === 'iterador') {
          const shakeX = Math.sin(now / 50) * 2; ctx.fillStyle = '#7f8c8d'; ctx.fillRect(nx + 8 + shakeX, ny + 14, 16, 14); ctx.fillStyle = '#2c3e50'; ctx.fillRect(nx + 6 + shakeX, ny + 4, 20, 14); ctx.strokeStyle = '#00d2ff'; ctx.lineWidth = 2; ctx.strokeRect(nx + 6 + shakeX, ny + 4, 20, 14); ctx.fillStyle = '#00d2ff'; ctx.font = '10px Arial'; ctx.fillText("∞", nx + 16 + shakeX, ny + 14);
      } else if (npc.id === 'genio') {
          const hover = Math.sin(now / 300) * 5; ctx.fillStyle = 'rgba(155, 89, 182, 0.4)'; ctx.beginPath(); ctx.arc(nx + 16, ny + 24, 12, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#9b59b6'; ctx.beginPath(); ctx.moveTo(nx + 8, ny + 20 + hover); ctx.quadraticCurveTo(nx + 16, ny + 32 + hover, nx + 24, ny + 20 + hover); ctx.lineTo(nx + 20, ny + 10 + hover); ctx.lineTo(nx + 12, ny + 10 + hover); ctx.fill(); ctx.fillStyle = '#ffdbac'; ctx.beginPath(); ctx.arc(nx + 16, ny + 8 + hover, 6, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#f1c40f'; ctx.fillRect(nx + 10, ny + 2 + hover, 12, 4); ctx.fillStyle = '#000'; ctx.fillRect(nx + 13, ny + 7 + hover, 2, 2); ctx.fillRect(nx + 17, ny + 7 + hover, 2, 2);
      } else if (npc.id === 'arquiteto') {
          const hover = Math.sin(now / 500) * 3; ctx.fillStyle = '#3498db'; ctx.fillRect(nx + 6, ny + 14 + hover, 20, 14); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.strokeRect(nx + 6, ny + 14 + hover, 20, 14); ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect(nx + 10, ny + 18 + hover, 12, 6); ctx.fillStyle = '#2980b9'; ctx.fillRect(nx + 10, ny + 4 + hover, 12, 10); ctx.strokeRect(nx + 10, ny + 4 + hover, 12, 10); ctx.fillStyle = '#00d2ff'; ctx.fillRect(nx + 12, ny + 8 + hover, 2, 2); ctx.fillRect(nx + 18, ny + 8 + hover, 2, 2);
      } else if (npc.id.startsWith('guard')) {
          const plumeColor = isCave ? '#9b59b6' : (isTower ? '#00d2ff' : (isOasis ? '#f1c40f' : '#e74c3c')); ctx.fillStyle = '#7f8c8d'; ctx.fillRect(nx + 6, ny + 14, 20, 14); ctx.strokeStyle = '#2c3e50'; ctx.lineWidth = 1; ctx.strokeRect(nx + 6, ny + 14, 20, 14); ctx.fillStyle = '#95a5a6'; ctx.fillRect(nx + 10, ny + 4, 12, 10); ctx.fillStyle = '#2c3e50'; ctx.fillRect(nx + 11, ny + 7, 10, 3); ctx.fillStyle = plumeColor; ctx.fillRect(nx + 14, ny, 4, 4); ctx.strokeStyle = '#bdc3c7'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(nx + 28, ny + 4); ctx.lineTo(nx + 28, ny + 28); ctx.stroke(); ctx.fillStyle = plumeColor; ctx.fillRect(nx + 26, ny + 2, 4, 6);
      } else {
          const hairColors = ['#4b2c20', '#6d4c41', '#222', '#d35400']; const shirtColors = ['#3498db', '#2ecc71', '#e67e22', '#9b59b6']; const hair = hairColors[(nx + ny) % hairColors.length]; const shirt = shirtColors[(nx * ny) % shirtColors.length]; ctx.fillStyle = shirt; ctx.fillRect(nx + 8, ny + 16, 16, 12); ctx.fillStyle = '#ffdbac'; ctx.fillRect(nx + 6, ny + 18, 2, 8); ctx.fillRect(nx + 24, ny + 18, 2, 8); ctx.fillStyle = '#ffdbac'; ctx.fillRect(nx + 10, ny + 4, 12, 12); ctx.fillStyle = hair; if ((nx + ny) % 2 === 0) { ctx.fillRect(nx + 10, ny + 2, 12, 6); } else { ctx.fillRect(nx + 10, ny + 4, 12, 3); ctx.fillRect(nx + 20, ny + 4, 2, 8); } ctx.fillStyle = '#000'; ctx.fillRect(nx + 12, ny + 9, 2, 2); ctx.fillRect(nx + 18, ny + 9, 2, 2); ctx.fillStyle = '#fff'; ctx.fillRect(nx + 12, ny + 9, 1, 1); ctx.fillRect(nx + 18, ny + 9, 1, 1);
      }
      if (npc.name && !['boole', 'iterador', 'genio', 'arquiteto', 'malwarech', 'glitch_byte', 'logic_void', 'stack_overlord', 'protocol_def', 'meta_class'].includes(npc.id)) drawLabel(npc.name, nx + 16, ny - 4);
      if (npc.id === 'boole') drawLabel("JUIZ BOOLE", nx + 16, ny - 6, '#3498db');
      if (npc.id === 'iterador') drawLabel("ITERADOR-X", nx + 16, ny - 6, '#00d2ff');
      if (npc.id === 'genio') drawLabel("GÊNIO DEF", nx + 16, ny - 12 + Math.sin(now / 300) * 5, '#f1c40f');
      if (npc.id === 'arquiteto') drawLabel("ARQUITETO INSTÂNCIA", nx + 16, ny - 12 + Math.sin(now / 500) * 3, '#3498db');
      if (npc.id === 'malwarech') drawLabel("MALWARECH", nx + 16, ny - 100 + (bossStage !== 'sitting' ? -40 : 0), '#ff4757');
      if (['glitch_byte', 'logic_void', 'stack_overlord', 'protocol_def', 'meta_class'].includes(npc.id)) drawLabel(`BOSS: ${npc.id.replace('_', ' ').toUpperCase()}`, nx + 16, ny - 10, '#ff4757');

      // Balão de fala flutuante
      const wanderData = wanderingNpcs[npc.id];
      if (wanderData?.bubble) {
        const wbx = nx + 16 + wanderData.offsetX;
        const wby = ny - 18;
        const text = wanderData.bubble;
        ctx.font = '5px "Press Start 2P"';
        const tw = ctx.measureText(text).width;
        const bw = tw + 10;
        const bh = 12;
        // Fundo branco
        ctx.fillStyle = 'rgba(255,255,255,0.92)';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        if ((ctx as any).roundRect) {
          ctx.beginPath();
          (ctx as any).roundRect(wbx - bw/2, wby - bh, bw, bh, 3);
          ctx.fill(); ctx.stroke();
        } else {
          ctx.fillRect(wbx - bw/2, wby - bh, bw, bh);
          ctx.strokeRect(wbx - bw/2, wby - bh, bw, bh);
        }
        // Rabinho triangular
        ctx.fillStyle = 'rgba(255,255,255,0.92)';
        ctx.beginPath();
        ctx.moveTo(wbx - 3, wby); ctx.lineTo(wbx, wby + 5); ctx.lineTo(wbx + 3, wby);
        ctx.fill();
        ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(wbx - 3, wby); ctx.lineTo(wbx, wby + 5); ctx.lineTo(wbx + 3, wby);
        ctx.stroke();
        // Texto
        ctx.fillStyle = '#0f172a';
        ctx.textAlign = 'center';
        ctx.font = '5px "Press Start 2P"';
        ctx.fillText(text, wbx, wby - 2);
        ctx.textAlign = 'left'; // resetar sempre
      }
    });

    const px = Math.floor(playerPos.x * TILE_SIZE - cameraX);
    const py = Math.floor(playerPos.y * TILE_SIZE - cameraY);
    const walkCycle = isMoving ? Math.sin(now / 100) * 4 : 0;
    ctx.save(); 
    
    // --- PROTAGONISTA ULTRA DETALHADO (Inspirado na imagem) ---
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(px + 8, py + 28, 16, 4); // Sombra
    
    // 1. Capa Longa Rasgada (Atrás)
    ctx.fillStyle = playerColor || '#1e293b'; 
    ctx.beginPath();
    ctx.moveTo(px + 8, py + 16);
    ctx.lineTo(px + 2 - (isMoving ? 6 : 0), py + 34); 
    ctx.lineTo(px + 30 + (isMoving ? 6 : 0), py + 34);
    ctx.lineTo(px + 24, py + 16);
    ctx.fill();
    // Detalhes de rasgos na capa
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(px + 10, py + 30, 2, 4);
    ctx.fillRect(px + 20, py + 31, 2, 3);

    // 2. Peitoral de Couro e Ombreiras Metálicas
    ctx.fillStyle = '#3e2723'; ctx.fillRect(px + 8, py + 16, 16, 12); // Couro Base
    ctx.fillStyle = playerColor || '#5d4037'; ctx.fillRect(px + 10, py + 18, 12, 8); // Detalhe Peito (USA COR DO PLAYER)
    
    // Ombreiras Metálicas (Detalhe Superior)
    ctx.fillStyle = '#455a64'; 
    ctx.fillRect(px + 6, py + 15 + (isMoving ? walkCycle : 0), 7, 5);
    ctx.fillRect(px + 19, py + 15 + (isMoving ? -walkCycle : 0), 7, 5);
    ctx.fillStyle = '#90a4ae'; // Brilho Ombreira
    ctx.fillRect(px + 7, py + 16 + (isMoving ? walkCycle : 0), 2, 2);
    ctx.fillRect(px + 23, py + 16 + (isMoving ? -walkCycle : 0), 2, 2);

    // 3. Braços: Mangas de Armadura e Luvas
    const bY_L = py + 18 + (isMoving ? -walkCycle : 0);
    const bY_R = py + 18 + (isMoving ? walkCycle : 0);
    
    // Manga Esquerda
    ctx.fillStyle = '#2c3e50'; ctx.fillRect(px + 4, bY_L, 4, 8); 
    ctx.fillStyle = '#000'; ctx.fillRect(px + 4, bY_L + 6, 4, 4); // Luva L
    // Manga Direita
    ctx.fillStyle = '#2c3e50'; ctx.fillRect(px + 24, bY_R, 4, 8);
    ctx.fillStyle = '#000'; ctx.fillRect(px + 24, bY_R + 6, 4, 4); // Luva R

    // 4. Detalhes: Cinto e Alças
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(px + 8, py + 24, 16, 3); // Cinto Largo
    ctx.fillStyle = '#ffd43b'; ctx.fillRect(px + 15, py + 24, 3, 3); // Fivela Ouro

    // 5. Cabeça: Cabelo Estiloso e Cachecol
    ctx.fillStyle = playerColor || '#96281b'; ctx.fillRect(px + 9, py + 13, 14, 4); // Cachecol Volumoso (USA COR DO PLAYER)
    ctx.fillStyle = '#ffdbac'; ctx.fillRect(px + 10, py + 4, 12, 10); // Rosto
    
    // CABELO ÉPICO (Baseado no gênero)
    ctx.fillStyle = '#21100b'; // Base escura
    
    if (playerGender === 'f') {
        // Cabelo Feminino Longo e Estiloso
        ctx.fillRect(px + 7, py + 1, 18, 6); // Topo
        ctx.fillRect(px + 6, py + 4, 4, 18); // Lado L (Caído)
        ctx.fillRect(px + 22, py + 4, 4, 18); // Lado R (Caído)
        
        ctx.fillStyle = '#3e2723'; // Camada média
        ctx.fillRect(px + 8, py + 0, 16, 3);
        // Franja feminina repicada
        ctx.beginPath();
        ctx.moveTo(px+10, py+6); ctx.lineTo(px+12, py+10); ctx.lineTo(px+14, py+6);
        ctx.moveTo(px+15, py+6); ctx.lineTo(px+17, py+9); ctx.lineTo(px+19, py+6);
        ctx.moveTo(px+20, py+6); ctx.lineTo(px+21, py+10); ctx.lineTo(px+23, py+6);
        ctx.fill();
        
        ctx.fillStyle = '#5d4037'; // Brilhos no cabelo longo
        ctx.fillRect(px + 11, py + 1, 3, 1);
        ctx.fillRect(px + 18, py + 1, 3, 1);
        ctx.fillRect(px + 7, py + 8, 1, 4); // Brilho mecha L
        ctx.fillRect(px + 24, py + 8, 1, 4); // Brilho mecha R
    } else {
        // Cabelo Masculino Estiloso
        ctx.fillRect(px + 8, py + 1, 16, 6);
        ctx.fillRect(px + 7, py + 4, 3, 10); // Mecha lateral L
        ctx.fillRect(px + 22, py + 4, 3, 10); // Mecha lateral R
        
        ctx.fillStyle = '#3e2723'; // Camada média
        ctx.fillRect(px + 9, py + 0, 14, 3);
        // Franja masculina repicada
        ctx.beginPath();
        ctx.moveTo(px+10, py+6); ctx.lineTo(px+11, py+11); ctx.lineTo(px+13, py+6); 
        ctx.moveTo(px+14, py+6); ctx.lineTo(px+16, py+10); ctx.lineTo(px+18, py+6); 
        ctx.moveTo(px+19, py+6); ctx.lineTo(px+21, py+11); ctx.lineTo(px+22, py+6); 
        ctx.fill();
        
        ctx.fillStyle = '#5d4037'; // Brilhos
        ctx.fillRect(px + 11, py + 1, 2, 1);
        ctx.fillRect(px + 18, py + 1, 3, 1);
    }

    // 6. Terminal Holográfico (Holograma Ciano)
    if (hasTerminal) {
        const tmx = px + 28;
        const tmy = py + 12 + (isMoving ? walkCycle : 0);
        ctx.fillStyle = 'rgba(0, 255, 255, 0.4)'; 
        ctx.fillRect(tmx, tmy, 16, 12);
        ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 1; ctx.strokeRect(tmx, tmy, 16, 12);
        // Pixels de dados flutuando
        ctx.fillStyle = '#fff';
        if(Math.random() > 0.5) ctx.fillRect(tmx+2, tmy+3, 10, 1);
        if(Math.random() > 0.5) ctx.fillRect(tmx+4, tmy+6, 8, 1);
        if(Math.random() > 0.5) ctx.fillRect(tmx+2, tmy+9, 6, 1);
    }

    // 7. Olhos Binários (Preto com ponto branco de foco)
    ctx.fillStyle = 'black'; ctx.fillRect(px + 12, py + 8, 2, 3); ctx.fillRect(px + 18, py + 8, 2, 3);
    ctx.fillStyle = 'white'; ctx.fillRect(px + 12, py + 8, 1, 1); ctx.fillRect(px + 18, py + 8, 1, 1);

    ctx.restore();
    if (playerName) drawLabel(playerName, px + 16, py - 10);
  }, [playerPos, map, isMoving, playerColor, hasTerminal, openedChests, playerName, handleInteractBtn, isMerchantHere, merchantLocation, bossStage, playerGender]);

  useEffect(() => {
    let requestRef: number;
    const animate = () => { render(); requestRef = requestAnimationFrame(animate); };
    requestRef = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef);
  }, [render]);

  const BugDexSection = ({ title, enemies }: { title: string, enemies: any[] }) => (
    <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '7px', color: '#ffd43b', backgroundColor: 'rgba(55, 118, 171, 0.3)', padding: '4px', marginBottom: '10px', borderLeft: '3px solid #ffd43b' }}>{title}</div>
        {enemies.map(enemy => {
            const isCaught = correctedBugs.includes(enemy.id);
            return (
                <div key={enemy.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #3776ab', padding: '6px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ transform: 'scale(0.5)', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BugSprite id={enemy.id} shadow={!isCaught} />
                        </div>
                        <span style={{ fontSize: '6px' }}>{isCaught ? enemy.name : '???'}</span>
                    </div>
                    <span style={{ fontSize: '6px', color: isCaught ? '#2ecc71' : '#ff4757' }}>{isCaught ? '[ OK ]' : '[ !! ]'}</span>
                </div>
            );
        })}
    </div>
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <canvas ref={canvasRef} width={VIEWPORT_W} height={VIEWPORT_H} style={{ display: 'block', backgroundColor: '#000' }} />
      <div style={{ flex: 1, position: 'relative', backgroundColor: '#fff', borderTop: '4px solid #3776ab' }}>
        <div style={{ position: 'absolute', right: '10px', top: '8px', display: 'flex', gap: '8px', zIndex: 100 }}>
            <button onClick={() => setShowBugDex(true)} style={{ padding: '6px 12px', fontSize: '6px', fontFamily: '"Press Start 2P"', backgroundColor: '#141e30', color: '#fff', border: '2px solid #3776ab', cursor: 'pointer', boxShadow: '0 3px 0 #000', borderRadius: '4px' }}>BUGDEX (B)</button>
            {hasNotebook && (
                <button onClick={onOpenNotebook} style={{ padding: '6px 12px', fontSize: '6px', fontFamily: '"Press Start 2P"', backgroundColor: '#ff8c00', color: '#fff', border: '2px solid #856404', cursor: 'pointer', boxShadow: '0 3px 0 #000', borderRadius: '4px' }}>CADERNO (C)</button>
            )}
        </div>
        <DPad onMoveStart={(dir) => !isDialogActive && setManualDir(dir)} onMoveEnd={() => setManualDir(null)} onInteract={handleInteractBtn} />
      </div>

      {showUnlockArrow && map.lockConfig && (
          <div style={{ 
              position: 'absolute', 
              left: '50%', 
              top: '50px', 
              transform: 'translateX(-50%)', 
              zIndex: 5000, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              pointerEvents: 'none',
              animation: 'bounceArrow 0.5s infinite alternate'
          }}>
              <div style={{ backgroundColor: '#ff8c00', color: '#fff', padding: '10px', border: '4px solid #fff', borderRadius: '8px', fontSize: '10px', fontFamily: '"Press Start 2P"', boxShadow: '0 0 20px rgba(255,140,0,0.8)' }}>
                  REINO LIBERADO!
              </div>
              <div style={{ width: 0, height: 0, borderLeft: '15px solid transparent', borderRight: '15px solid transparent', borderTop: '20px solid #fff', marginTop: '-4px' }} />
          </div>
      )}

      {showBugDex && (
        <div style={{ position: 'absolute', inset: '20px', backgroundColor: 'rgba(20, 30, 48, 0.95)', border: '4px solid #3776ab', zIndex: 100, padding: '15px', color: '#fff', fontFamily: '"Press Start 2P"', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '8px', marginBottom: '15px', textAlign: 'center', color: '#ffd43b', borderBottom: '2px solid #3776ab', paddingBottom: '10px' }}>[ ENCICLOPÉDIA BUGDEX ]</h3>
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
                <BugDexSection title="REINO 1: VARIÁVEIS" enemies={WORLD1_ENEMIES} />
                <BugDexSection title="REINO 2: DECISÕES" enemies={WORLD2_ENEMIES} />
                <BugDexSection title="REINO 3: REPETIÇÕES" enemies={WORLD3_ENEMIES} />
                <BugDexSection title="REINO 4: FUNÇÕES" enemies={WORLD4_ENEMIES} />
                <BugDexSection title="REINO 5: OOP" enemies={WORLD5_ENEMIES} />
            </div>
            <button onClick={() => setShowBugDex(false)} style={{ position: 'absolute', top: '5px', right: '10px', background: 'none', border: 'none', color: '#ff4757', fontSize: '10px', cursor: 'pointer' }}>X</button>
        </div>
      )}
      <style>{`
          @keyframes bounceArrow { from { transform: translateX(-50%) translateY(0); } to { transform: translateX(-50%) translateY(-15px); } }
      `}</style>
    </div>
  );
};

export default MapCanvas;
