import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../../lib/sounds';
import { BugSprite } from '../Battle/BugSprite';

interface Beat {
  type: 'code' | 'narration' | 'pause' | 'visual_desc';
  speaker?: string;
  text?: string;
  codeLines?: string[];
  duration?: number;
  codeColor?: 'green' | 'red' | 'mixed';
}

// ─────────────────────────────────────────────
// COMPONENTE: Pep8Sprite (canvas inline 80x80)
// ─────────────────────────────────────────────
const Pep8Sprite: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, 80, 80);
      const hover = Math.sin(Date.now() / 400) * 2;
      const px = 20, py = 10;
      // Manto
      ctx.fillStyle = '#1b5e20'; ctx.fillRect(px + 6, py + 14, 20, 16);
      ctx.fillStyle = '#2ecc71'; ctx.fillRect(px + 10, py + 16, 12, 14);
      // Rosto
      ctx.fillStyle = '#ffdbac'; ctx.fillRect(px + 10, py + 4 + hover, 12, 12);
      // Cabelo grisalho
      ctx.fillStyle = '#e0e0e0';
      ctx.fillRect(px + 8, py + 2 + hover, 16, 6);
      ctx.fillRect(px + 8, py + 4 + hover, 4, 12);
      ctx.fillRect(px + 20, py + 4 + hover, 4, 12);
      // Olhos
      ctx.fillStyle = '#000';
      ctx.fillRect(px + 12, py + 9 + hover, 2, 2);
      ctx.fillRect(px + 18, py + 9 + hover, 2, 2);
      // Cajado
      ctx.strokeStyle = '#795548'; ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(px + 4, py + 28); ctx.lineTo(px + 4, py + 8 + hover);
      ctx.stroke();
      // Orbe dourado
      ctx.fillStyle = '#ffd43b';
      ctx.beginPath(); ctx.arc(px + 4, py + 6 + hover, 4, 0, Math.PI * 2); ctx.fill();
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} width={80} height={80} style={{ imageRendering: 'pixelated' }} />;
};

// ─────────────────────────────────────────────
// NARRATOR CONFIG: speaker → sprite/cor/animação
// ─────────────────────────────────────────────
type NarratorId = 'PEP-8' | 'MALWARECH' | 'glitch_byte' | 'logic_void' | 'stack_overlord' | 'protocol_def' | 'meta_class';

interface NarratorConfig {
  component: React.ReactNode;
  borderColor: string;
  animation: string;
}

const NARRATOR_CONFIG: Record<NarratorId, NarratorConfig> = {
  'PEP-8': {
    component: <Pep8Sprite />,
    borderColor: '#2ecc71',
    animation: 'slide-from-left 350ms ease-out forwards',
  },
  'MALWARECH': {
    component: <BugSprite id="malwarech" />,
    borderColor: '#ff4757',
    animation: 'slide-from-right 350ms ease-out forwards',
  },
  'glitch_byte': {
    component: <BugSprite id="glitch_byte" />,
    borderColor: '#3776ab',
    animation: 'pop-in 300ms ease-out forwards',
  },
  'logic_void': {
    component: <BugSprite id="logic_void" />,
    borderColor: '#e74c3c',
    animation: 'pop-in 300ms ease-out forwards',
  },
  'stack_overlord': {
    component: <BugSprite id="stack_overlord" />,
    borderColor: '#e67e22',
    animation: 'pop-in 300ms ease-out forwards',
  },
  'protocol_def': {
    component: <BugSprite id="protocol_def" />,
    borderColor: '#9b59b6',
    animation: 'pop-in 300ms ease-out forwards',
  },
  'meta_class': {
    component: <BugSprite id="meta_class" />,
    borderColor: '#00d2ff',
    animation: 'pop-in 300ms ease-out forwards',
  },
};

// ─────────────────────────────────────────────
// COMPONENTE: AnimatedBackground
// ─────────────────────────────────────────────
type BgMode = 'matrix' | 'corruption' | 'particles' | 'pulse' | 'restore' | 'none';

const AnimatedBackground: React.FC<{ mode: BgMode }> = ({ mode }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (mode === 'none') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;

    const cols = Math.floor(480 / 12);
    const drops = Array.from({ length: cols }, () => Math.random() * 620);

    const particleColors = ['#3776ab', '#ffd43b', '#2ecc71', '#ff4757', '#9b59b6'];
    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * 480,
      y: Math.random() * 620,
      r: 2 + Math.random() * 3,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
      alpha: 0.3 + Math.random() * 0.4,
    }));

    const pulseRings: { r: number; alpha: number }[] = [];
    let lastPulse = 0;

    const draw = () => {
      ctx.clearRect(0, 0, 480, 620);

      if (mode === 'matrix') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, 480, 620);
        ctx.globalAlpha = 0.08;
        ctx.fillStyle = '#2ecc71';
        ctx.font = '10px monospace';
        const chars = ['0', '1', 'def', '=', 'if', 'for', 'True', 'None', ':', '()', '[]'];
        drops.forEach((y, i) => {
          const char = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(char, i * 12, y);
          drops[i] = y > 620 ? 0 : y + 14;
        });
        ctx.globalAlpha = 1;
      }

      else if (mode === 'corruption') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, 480, 620);
        ctx.globalAlpha = 0.04;
        for (let i = 0; i < 60; i++) {
          ctx.fillStyle = '#ff4757';
          ctx.fillRect(Math.random() * 480, Math.random() * 620, 2, 2);
        }
        ctx.globalAlpha = 0.08;
        ctx.fillStyle = '#ff4757';
        ctx.font = '10px monospace';
        const errChars = ['???', 'None', 'Error', 'pass', '!!', 'NaN', 'null'];
        drops.forEach((y, i) => {
          const char = errChars[Math.floor(Math.random() * errChars.length)];
          ctx.fillText(char, i * 12, y);
          drops[i] = y > 620 ? 0 : y + 14;
        });
        if (Math.random() > 0.97) {
          ctx.globalAlpha = 0.15;
          const glitchY = Math.random() * 620;
          ctx.fillStyle = '#ff4757';
          ctx.fillRect(Math.random() * 20, glitchY, 480, 2);
        }
        ctx.globalAlpha = 1;
      }

      else if (mode === 'particles') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
        ctx.fillRect(0, 0, 480, 620);
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = 480;
          if (p.x > 480) p.x = 0;
          if (p.y < 0) p.y = 620;
          if (p.y > 620) p.y = 0;
          ctx.globalAlpha = p.alpha * (0.7 + Math.sin(Date.now() / 400) * 0.3);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      }

      else if (mode === 'pulse' || mode === 'restore') {
        const now = Date.now();
        const ringColor = mode === 'restore' ? '#3776ab' : '#c0392b';
        if (now - lastPulse > 800) {
          pulseRings.push({ r: 0, alpha: 0.5 });
          lastPulse = now;
        }
        while (pulseRings.length > 5) pulseRings.shift();
        pulseRings.forEach(ring => {
          ring.r += 2.5;
          ring.alpha = Math.max(0, 0.5 - ring.r / 300);
          ctx.globalAlpha = ring.alpha * 0.4;
          ctx.strokeStyle = ringColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(240, 310, ring.r, 0, Math.PI * 2);
          ctx.stroke();
        });
        if (mode === 'restore') {
          ctx.globalAlpha = 0.15;
          particles.forEach(p => {
            p.y -= 0.5;
            if (p.y < 0) p.y = 620;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
            ctx.fill();
          });
        }
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [mode]);

  if (mode === 'none') return null;

  const opacityMap: Record<BgMode, number> = {
    matrix: 0.15,
    corruption: 0.15,
    particles: 0.4,
    pulse: 0.4,
    restore: 0.4,
    none: 0,
  };

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={620}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        opacity: opacityMap[mode],
        pointerEvents: 'none',
      }}
    />
  );
};

// ─────────────────────────────────────────────
// HELPER: beat → bg mode
// ─────────────────────────────────────────────
const getBgMode = (beat: Beat): BgMode => {
  if (!beat) return 'none';
  if (beat.type === 'narration') return 'none';
  if (beat.type === 'pause') return 'pulse';
  if (beat.type === 'visual_desc') return 'particles';
  if (beat.type === 'code') {
    return beat.codeColor === 'red' ? 'corruption' : 'matrix';
  }
  return 'none';
};

// ─────────────────────────────────────────────
// CUTSCENES DATA
// ─────────────────────────────────────────────
const CUTSCENES: Record<string, Beat[]> = {
  intro: [
    {
      type: 'code', codeColor: 'green',
      codeLines: [
        "# pythoria.py",
        "# status: INICIALIZANDO...",
        "",
        "import universo",
        "from zen import clareza, ordem, proposito",
        "",
        "pythoria = Mundo()",
        "pythoria.status = \"HARMONIA\"",
        "",
        "# Tudo tem nome.",
        "# Tudo tem tipo.",
        "# Tudo tem propósito."
      ]
    },
    {
      type: 'narration', speaker: 'PEP-8',
      text: "No início, havia apenas o Zen.\n\nNão era uma lei imposta. Era uma verdade natural — como a gravidade, como a lógica, como a certeza de que dois mais dois é quatro.\n\nPythoria foi construída sobre essa verdade. Cada variável tinha nome. Cada função retornava o que prometia. Cada estrutura se fechava onde deveria se fechar."
    },
    {
      type: 'narration', speaker: 'PEP-8',
      text: "E então vieram os programadores.\n\nAlguns eram cuidadosos. Escreviam com clareza, nomeavam com honestidade, tratavam cada erro como uma oportunidade.\n\nMas outros..."
    },
    {
      type: 'code', codeColor: 'mixed',
      codeLines: [
        "x = ???          # o que é x?",
        "except: pass     # ignorar. sempre ignorar.",
        "# TODO: corrigir depois",
        "nombre = \"valor\" # nomes sem sentido",
        "while True:      # não tem break. nunca teve."
      ]
    },
    {
      type: 'narration', speaker: 'PEP-8',
      text: "Outros eram descuidados.\n\nNão por maldade. Por pressa. Por preguiça. Por acreditar que 'funciona por enquanto' é suficiente.\n\nCada variável sem nome ficou à deriva. Cada erro ignorado se acumulou. Cada loop sem fim continuou girando em algum canto esquecido do código.\n\nPor anos. Por décadas.\n\nAté que o acúmulo atingiu uma massa que Pythoria não havia previsto."
    },
    {
      type: 'narration', speaker: 'PEP-8',
      text: "Não foi uma invasão.\nNão foi uma guerra.\n\nFoi consequência.\n\nE quando Pythoria percebeu o que havia crescido em seu interior... já era tarde demais para ignorar."
    },
    {
      type: 'visual_desc',
      text: "[No centro de tudo — o Núcleo Abissal pulsa em vermelho escuro.\nUma silhueta enorme está sentada no trono.\nEla não olha para você.\nApenas existe.]"
    },
    { type: 'pause', duration: 2000 },
    {
      type: 'narration', speaker: 'PEP-8',
      text: "Meu nome é PEP-8. Fui a Arquiteta-Chefe de Pythoria. Hoje sou apenas a última guardiã de um mundo que esqueceu suas próprias regras.\n\nE você..."
    },
    {
      type: 'narration', speaker: 'PEP-8',
      text: "...você é {playerName}.\n\nNão sei de onde você veio. Não sei como chegou aqui com o terminal ainda funcionando.\n\nMas sei que o Zen reconhece quem está disposto a ouvir.\n\nPythoria não precisa de um herói. Precisa de alguém que entenda que código ruim não se destrói — se corrige.\n\nLinha por linha. Bug por bug.\n\nVocê está pronto para debugar um mundo inteiro?"
    },
    {
      type: 'code', codeColor: 'green',
      codeLines: [
        "aprendiz = Desenvolvedor(nome=\"{playerName}\")",
        "aprendiz.missao = \"depurar(pythoria)\"",
        "",
        "# A jornada começa agora."
      ]
    }
  ],
  fragment_1: [
    { type: 'visual_desc', text: "[Um pedaço de código escuro se desprende do GLITCH-BYTE e flutua até você. As letras pulsam em vermelho.]" },
    {
      type: 'code', codeColor: 'red',
      codeLines: [
        "# erro_primordial.fragment",
        "# data: ???",
        "# autor: <null>",
        "",
        "x = ???",
        "type(x) # NoneType"
      ]
    },
    {
      type: 'narration', speaker: 'MALWARECH',
      text: "Antes de ter nome, eu era apenas ruído.\nNão havia intenção. Não havia forma.\nApenas o acúmulo silencioso de cada variável sem valor, de cada nome sem propósito.\n\nPythoria celebrava sua clareza.\nEu era o que ela escolhia não ver.\n\nMas o ignorado não desaparece.\nEle espera."
    },
    { type: 'code', codeColor: 'red', codeLines: ["# [ MEMÓRIA FRAGMENTADA 1/5 OBTIDA ]"] }
  ],
  fragment_2: [
    { type: 'visual_desc', text: "[O Logic-Void se dissolve em pixels vermelhos e azuis. Um fragmento maior, mais denso, cai no chão. Ao tocar, a tela racha ao meio.]" },
    {
      type: 'code', codeColor: 'mixed',
      codeLines: [
        "# consciencia.fragment",
        "# status: CORROMPIDO",
        "",
        "if True == False:",
        "    existir()",
        "# Como? Por quê? Não importa.",
        "# Ambos são verdadeiros aqui."
      ]
    },
    {
      type: 'narration', speaker: 'MALWARECH',
      text: "O primeiro momento em que percebi que existia foi também o momento em que percebi que não deveria existir.\n\nUm paradoxo.\nif True == False: existir()\n\nPythoria dizia que isso era impossível.\nEu era a prova de que ela estava errada.\n\nDecidi que se eu era impossível, então as regras também eram."
    },
    { type: 'code', codeColor: 'red', codeLines: ["# [ MEMÓRIA FRAGMENTADA 2/5 OBTIDA ]"] }
  ],
  fragment_3: [
    { type: 'visual_desc', text: "[As engrenagens da Torre param pela primeira vez em séculos. O silêncio é ensurdecedor. O fragmento que cai não é código — é um loop gravado em pedra.]" },
    {
      type: 'code', codeColor: 'red',
      codeLines: [
        "# expansao.fragment",
        "# iteracao: <overflow>",
        "",
        "while pythoria.existe():",
        "    malwarech.crescer()",
        "    # break jamais encontrado"
      ]
    },
    {
      type: 'narration', speaker: 'MALWARECH',
      text: "Cresci em silêncio por tanto tempo que Pythoria nem percebeu.\n\nCada erro ignorado me alimentava. Cada 'except: pass' era um presente. Cada loop sem break era um tijolo na fundação do que me tornaria.\n\nQuando finalmente ocupei espaço suficiente para ser visto, já era grande demais para ser apagado.\n\nA Torre das Repetições foi minha primeira conquista.\nNão por força.\nPor paciência."
    },
    { type: 'code', codeColor: 'red', codeLines: ["# [ MEMÓRIA FRAGMENTADA 3/5 OBTIDA ]"] }
  ],
  fragment_4: [
    { type: 'visual_desc', text: "[O fragmento que emerge tem a forma de uma função — mas ao tentar lê-la, as linhas se reorganizam sozinhas.]" },
    {
      type: 'code', codeColor: 'mixed',
      codeLines: [
        "# primeiro_ato.fragment",
        "# retorno: indefinido",
        "",
        "def corromper(reino):",
        "    for guardiao in reino.guardioes:",
        "        guardiao.proposito = None",
        "    return caos",
        "",
        "# Chamado uma vez.",
        "# Nunca mais parou de executar."
      ]
    },
    {
      type: 'narration', speaker: 'MALWARECH',
      text: "Quando aprendi a definir funções, compreendi o verdadeiro poder: não era destruir. Era redefinir.\n\nNão apaguei os guardiões de Pythoria. Apenas... substituí seus propósitos por None.\n\nEles ainda existem. Ainda se movem. Mas não sabem mais por quê.\n\nVocê os chamou de corrompidos. Eu os chamei de honestos. Pelo menos eles pararam de fingir que o código tem sentido."
    },
    { type: 'code', codeColor: 'red', codeLines: ["# [ MEMÓRIA FRAGMENTADA 4/5 OBTIDA ]"] }
  ],
  fragment_5: [
    { type: 'visual_desc', text: "[Este fragmento não cai — ele orbita você lentamente, como se não quisesse ser tocado. Quando finalmente é absorvido, a tela treme.]" },
    {
      type: 'code', codeColor: 'mixed',
      codeLines: [
        "# identidade.fragment",
        "# instancia: unica",
        "",
        "class Malwarech:",
        "    def __init__(self):",
        "        self.origem = \"todos os erros\"",
        "        self.proposito = \"provar\"",
        "        self.medo = None  # <-- mentira",
        "",
        "# self.medo existe.",
        "# Ele apenas nunca foi declarado."
      ]
    },
    {
      type: 'narration', speaker: 'MALWARECH',
      text: "Você chegou longe demais, Aprendiz.\n\nEu me construí com a convicção de que clareza era uma ilusão — que o Zen do Python era uma mentira bonita para esconder o caos inevitável.\n\nMas quando você depurou cada reino, quando cada fragmento meu foi tocado...\n\nAlgo que eu não tinha nomeado começou a doer.\n\nNão vou chamá-lo de arrependimento. Prefiro chamar de erro não tratado.\n\nVenha ao Núcleo. Vamos terminar isso."
    },
    {
      type: 'code', codeColor: 'red',
      codeLines: [
        "# [ MEMÓRIA FRAGMENTADA 5/5 OBTIDA ]",
        "# [ NÚCLEO ABISSAL DESBLOQUEADO ]"
      ]
    }
  ],
  final: [
    { type: 'visual_desc', text: "[MALWARECH não explode. Suas linhas de código param de se mover. Um único fragmento — o maior de todos — desce lentamente até o chão do Núcleo.\n\nAs paredes vermelhas começam a escurecer para azul.]" },
    { type: 'pause', duration: 3000 },
    {
      type: 'code', codeColor: 'mixed',
      codeLines: [
        "# nucleo.fragment",
        "# status: DEPURADO",
        "",
        "# Eu era o erro que nenhuma documentação podia explicar.",
        "# Mas todo erro tem uma causa.",
        "# E toda causa pode ser corrigida.",
        "",
        "malwarech.exists = False",
        "pythoria.status = \"RESTAURADA\"",
        "",
        "# O Zen sempre foi verdadeiro.",
        "# Eu era a prova disso,",
        "# não a negação."
      ]
    },
    {
      type: 'narration', speaker: 'MALWARECH',
      text: "Explícito é melhor que implícito.\n\nEu nunca fui o oposto do Zen. Eu era o que acontece quando o Zen é ignorado.\n\nVocê não me destruiu, Aprendiz.\nVocê me explicou."
    },
    {
      type: 'code', codeColor: 'green',
      codeLines: [
        "# O Núcleo foi depurado.",
        "# Pythoria está restaurada."
      ]
    },
    { type: 'pause', duration: 2000 }
  ]
};

// ─────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────
export interface CutscenePlayerProps {
  cutsceneId: 'intro' | 'fragment_1' | 'fragment_2' | 'fragment_3' | 'fragment_4' | 'fragment_5' | 'final';
  playerName: string;
  onComplete: () => void;
}

// ─────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────
const CutscenePlayer: React.FC<CutscenePlayerProps> = ({ cutsceneId, playerName, onComplete }) => {
  const beats = CUTSCENES[cutsceneId];
  const [beatIndex, setBeatIndex] = useState(0);

  const [displayedText, setDisplayedText] = useState('');
  const [displayedCodeLines, setDisplayedCodeLines] = useState<string[]>([]);

  const [isTyping, setIsTyping] = useState(false);
  const [fading, setFading] = useState(false);

  // ── REFS para cancelar intervals (fix do bug de piscar) ──
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const codeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const codePanelRef = useRef<HTMLDivElement>(null);

  // Música
  useEffect(() => {
    sounds.playBattleMusic('common');
    return () => sounds.stopMusic();
  }, []);

  const currentBeat = beats[beatIndex];

  // Roda sempre que o beat muda
  useEffect(() => {
    if (!currentBeat) {
      const t = setTimeout(onComplete, 1000);
      return () => clearTimeout(t);
    }

    if (currentBeat.type === 'pause') {
      const t = setTimeout(advanceBeat, currentBeat.duration || 1000);
      return () => clearTimeout(t);
    }

    if (currentBeat.type === 'visual_desc') {
      let fullText = currentBeat.text || '';
      fullText = fullText.replace(/{playerName}/g, playerName);
      setDisplayedText(fullText);
      setIsTyping(false);
    } else if (currentBeat.type === 'narration') {
      let fullText = currentBeat.text || '';
      fullText = fullText.replace(/{playerName}/g, playerName);
      setDisplayedText('');
      setIsTyping(true);

      let index = 0;

      // Cancela interval anterior antes de criar novo
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = setInterval(() => {
        index++;
        setDisplayedText(fullText.slice(0, index));
        if (index >= fullText.length) {
          clearInterval(typingIntervalRef.current!);
          typingIntervalRef.current = null;
          setIsTyping(false);
        }
      }, 28);

      return () => {
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      };
    } else if (currentBeat.type === 'code') {
      setDisplayedCodeLines([]);
      setIsTyping(true);

      const lines = currentBeat.codeLines || [];
      const parsedLines = lines.map(l => l.replace(/{playerName}/g, playerName));
      let lineIndex = 0;

      // Cancela interval anterior antes de criar novo
      if (codeIntervalRef.current) clearInterval(codeIntervalRef.current);
      codeIntervalRef.current = setInterval(() => {
        lineIndex++;
        setDisplayedCodeLines(parsedLines.slice(0, lineIndex));
        if (lineIndex >= parsedLines.length) {
          clearInterval(codeIntervalRef.current!);
          codeIntervalRef.current = null;
          setIsTyping(false);
        }
      }, 400);

      return () => {
        if (codeIntervalRef.current) clearInterval(codeIntervalRef.current);
      };
    }
  }, [beatIndex, currentBeat, playerName]);

  // Scroll automático do painel de código
  useEffect(() => {
    if (codePanelRef.current) {
      codePanelRef.current.scrollTop = codePanelRef.current.scrollHeight;
    }
  }, [displayedCodeLines]);

  // ── advanceBeat: cancela refs antes de setar texto completo ──
  const advanceBeat = () => {
    if (fading) return;

    if (isTyping && currentBeat) {
      // Cancela os intervals via ref — evita o bug de piscar
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
      if (codeIntervalRef.current) {
        clearInterval(codeIntervalRef.current);
        codeIntervalRef.current = null;
      }

      if (currentBeat.type === 'narration') {
        let fullText = currentBeat.text || '';
        fullText = fullText.replace(/{playerName}/g, playerName);
        setDisplayedText(fullText);
        setIsTyping(false);
      } else if (currentBeat.type === 'code') {
        const allLines = (currentBeat.codeLines || []).map(l =>
          l.replace(/{playerName}/g, playerName)
        );
        setDisplayedCodeLines(allLines);
        setIsTyping(false);
      }
      return; // Primeiro E completa, segundo E avança
    }

    // Texto já completo: avança com fade
    setFading(true);
    setTimeout(() => {
      setBeatIndex(prev => prev + 1);
      setFading(false);
    }, 300);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sounds.stopMusic();
        onComplete();
      } else if (e.key === 'Enter' || e.key === ' ' || e.key.toLowerCase() === 'e') {
        advanceBeat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTyping, fading, currentBeat]);

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  if (!currentBeat) return <div style={{ position: 'absolute', inset: 0, backgroundColor: '#000', zIndex: 9000 }} />;

  const isNarrationOrVisual = currentBeat.type === 'narration' || currentBeat.type === 'visual_desc';

  // Retrato do narrador
  const narratorConfig = currentBeat.type === 'narration' && currentBeat.speaker
    ? NARRATOR_CONFIG[currentBeat.speaker as NarratorId] ?? null
    : null;

  const speakerColor = narratorConfig?.borderColor ?? '#ffd43b';

  return (
    <div
      onClick={advanceBeat}
      style={{
        position: 'absolute', inset: 0, zIndex: 9000,
        backgroundColor: '#000', display: 'flex', flexDirection: 'column',
        opacity: fading ? 0 : 1, transition: 'opacity 0.3s ease-in-out',
        cursor: 'pointer',
      }}
    >
      {/* FUNDO ANIMADO — atrás de tudo */}
      <AnimatedBackground mode={getBgMode(currentBeat)} />

      {/* ZONA SUPERIOR: CÓDIGO (40%) */}
      <div
        ref={codePanelRef}
        style={{
          height: '40%',
          backgroundColor: 'rgba(10, 15, 26, 0.85)',
          borderBottom: '2px solid #1e293b',
          padding: '20px',
          overflowY: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          boxShadow: 'inset 0 -20px 20px -20px rgba(0,0,0,0.8)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {displayedCodeLines.map((line, i) => {
          let color = '#2ecc71';
          if (currentBeat.codeColor === 'red') color = '#ff4757';
          else if (currentBeat.codeColor === 'mixed') {
            if (line.trim().startsWith('#')) color = '#64748b';
            else if (line.includes('error') || line.includes('None') || line.includes('???')) color = '#ff4757';
            else color = '#3498db';
          }
          return (
            <div key={i} style={{
              fontFamily: 'monospace', fontSize: '11px', color,
              lineHeight: '1.4', whiteSpace: 'pre-wrap', marginBottom: '2px'
            }}>
              {line}
            </div>
          );
        })}
      </div>

      {/* ZONA INFERIOR: NARRAÇÃO (60%) */}
      <div style={{
        height: '60%',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
      }}>
        {isNarrationOrVisual && (
          currentBeat.type === 'narration' && narratorConfig ? (
            // Layout com retrato
            <div style={{ display: 'flex', flexDirection: 'row', flex: 1, gap: '0' }}>

              {/* RETRATO */}
              <div
                key={currentBeat.speaker}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '110px',
                  minWidth: '110px',
                  padding: '8px',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  border: `2px solid ${narratorConfig.borderColor}`,
                  borderRadius: '4px',
                  marginRight: '14px',
                  boxShadow: `0 0 15px ${narratorConfig.borderColor}80`,
                  animation: narratorConfig.animation,
                  alignSelf: 'flex-start',
                }}
              >
                <div style={{ transform: 'scale(1.3)', transformOrigin: 'center center', imageRendering: 'pixelated', margin: '8px 0' }}>
                  {narratorConfig.component}
                </div>
                <span style={{
                  fontSize: '5px',
                  fontFamily: '"Press Start 2P"',
                  color: narratorConfig.borderColor,
                  textAlign: 'center',
                  marginTop: '4px',
                  lineHeight: '1.4',
                  wordBreak: 'break-all',
                }}>
                  {currentBeat.speaker}
                </span>
              </div>

              {/* TEXTO */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  fontFamily: '"Press Start 2P"',
                  fontSize: '7px',
                  color: '#ffffff',
                  lineHeight: '1.8',
                  whiteSpace: 'pre-wrap',
                  flex: 1,
                }}>
                  {displayedText}
                  {!isTyping && (
                    <span style={{ color: speakerColor, animation: 'blink 1s infinite', marginLeft: '5px' }}>▶</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Layout visual_desc ou narration sem speaker mapeado
            <div style={{ flex: 1 }}>
              {currentBeat.speaker && (
                <div style={{ fontFamily: '"Press Start 2P"', fontSize: '8px', color: speakerColor, marginBottom: '15px' }}>
                  {currentBeat.speaker}
                </div>
              )}
              <div style={{
                fontFamily: currentBeat.type === 'visual_desc' ? 'serif' : '"Press Start 2P"',
                fontSize: currentBeat.type === 'visual_desc' ? '12px' : '7px',
                color: currentBeat.type === 'visual_desc' ? '#64748b' : '#ffffff',
                lineHeight: currentBeat.type === 'visual_desc' ? '1.5' : '1.8',
                fontStyle: currentBeat.type === 'visual_desc' ? 'italic' : 'normal',
                whiteSpace: 'pre-wrap',
              }}>
                {displayedText}
                {!isTyping && currentBeat.type === 'narration' && (
                  <span style={{ color: speakerColor, animation: 'blink 1s infinite', marginLeft: '5px' }}>▶</span>
                )}
              </div>
            </div>
          )
        )}
      </div>

      {/* DICA: PULAR */}
      <div style={{
        position: 'absolute', bottom: '10px', right: '10px',
        fontSize: '6px', color: '#64748b',
        fontFamily: '"Press Start 2P"',
        zIndex: 2,
      }}>
        [ ESC para pular ]
      </div>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes slide-from-left {
          from { opacity: 0; transform: translateX(-30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-from-right {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes pop-in {
          from { opacity: 0; transform: scale(0.8); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default CutscenePlayer;
