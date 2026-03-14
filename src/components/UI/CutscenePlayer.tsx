import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../../lib/sounds';

interface Beat {
  type: 'code' | 'narration' | 'pause' | 'visual_desc';
  speaker?: string;
  text?: string;
  codeLines?: string[];
  duration?: number;
  codeColor?: 'green' | 'red' | 'mixed';
}

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

export interface CutscenePlayerProps {
  cutsceneId: 'intro' | 'fragment_1' | 'fragment_2' | 'fragment_3' | 'fragment_4' | 'fragment_5' | 'final';
  playerName: string;
  onComplete: () => void;
}

const CutscenePlayer: React.FC<CutscenePlayerProps> = ({ cutsceneId, playerName, onComplete }) => {
  const beats = CUTSCENES[cutsceneId];
  const [beatIndex, setBeatIndex] = useState(0);
  
  const [displayedText, setDisplayedText] = useState('');
  const [displayedCodeLines, setDisplayedCodeLines] = useState<string[]>([]);
  
  const [isTyping, setIsTyping] = useState(false);
  const [fading, setFading] = useState(false);
  
  const codePanelRef = useRef<HTMLDivElement>(null);

  // Música
  useEffect(() => {
    sounds.playBattleMusic('common'); // Trilha ambiente
    return () => sounds.stopMusic();
  }, []);

  const currentBeat = beats[beatIndex];

  // Roda sempre que o beat muda
  useEffect(() => {
    if (!currentBeat) {
      // Fim da cutscene
      const t = setTimeout(onComplete, 1000);
      return () => clearTimeout(t);
    }

    let isMounted = true;

    if (currentBeat.type === 'pause') {
      const t = setTimeout(() => {
        if (isMounted) advanceBeat();
      }, currentBeat.duration || 1000);
      return () => { isMounted = false; clearTimeout(t); };
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
      
      let charIndex = 0;
      const typeNextChar = () => {
        if (!isMounted) return;
        if (charIndex < fullText.length) {
          setDisplayedText(prev => prev + fullText.charAt(charIndex));
          charIndex++;
          setTimeout(typeNextChar, 28);
        } else {
          setIsTyping(false);
        }
      };
      setTimeout(typeNextChar, 100);
    } else if (currentBeat.type === 'code') {
      setDisplayedCodeLines([]);
      setIsTyping(true); // Tratamos a renderização do código como "typing" para bloquear avanço instantâneo do texto (embora o código avance linha por linha)
      
      const lines = currentBeat.codeLines || [];
      let lineIndex = 0;
      
      const typeNextLine = () => {
        if (!isMounted) return;
        if (lineIndex < lines.length) {
          let line = lines[lineIndex];
          line = line.replace(/{playerName}/g, playerName);
          setDisplayedCodeLines(prev => [...prev, line]);
          lineIndex++;
          setTimeout(typeNextLine, 400);
        } else {
          setIsTyping(false);
        }
      };
      setTimeout(typeNextLine, 200);
    }

    return () => { isMounted = false; };
  }, [beatIndex]);

  // Scroll automático do painel de código
  useEffect(() => {
    if (codePanelRef.current) {
      codePanelRef.current.scrollTop = codePanelRef.current.scrollHeight;
    }
  }, [displayedCodeLines]);

  const advanceBeat = () => {
    if (fading) return;

    // Se estiver digitando e clicarem, completa o texto atual ou o código atual instantaneamente
    if (isTyping && currentBeat) {
      if (currentBeat.type === 'narration') {
          let fullText = currentBeat.text || '';
          fullText = fullText.replace(/{playerName}/g, playerName);
          setDisplayedText(fullText);
          setIsTyping(false);
      } else if (currentBeat.type === 'code') {
          let allLines = (currentBeat.codeLines || []).map(l => l.replace(/{playerName}/g, playerName));
          setDisplayedCodeLines(allLines);
          setIsTyping(false);
      }
      return;
    }

    // Avança para o próximo com fade
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
      } else if (e.key === 'Enter' || e.key === ' ') {
        advanceBeat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTyping, fading]);

  // Renderização
  if (!currentBeat) return <div style={{ position: 'absolute', inset: 0, backgroundColor: '#000', zIndex: 9000 }} />;

  const isNarrationOrVisual = currentBeat.type === 'narration' || currentBeat.type === 'visual_desc';
  const speakerColor = currentBeat.speaker === 'MALWARECH' ? '#ff4757' : '#ffd43b';

  return (
    <div 
      onClick={advanceBeat}
      style={{ 
        position: 'absolute', inset: 0, zIndex: 9000, 
        backgroundColor: '#000', display: 'flex', flexDirection: 'column',
        opacity: fading ? 0 : 1, transition: 'opacity 0.3s ease-in-out',
        cursor: 'pointer'
      }}
    >
      {/* ZONA SUPERIOR: CÓDIGO (40%) */}
      <div 
        ref={codePanelRef}
        style={{
          height: '40%',
          backgroundColor: '#0a0f1a',
          borderBottom: '2px solid #1e293b',
          padding: '20px',
          overflowY: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          boxShadow: 'inset 0 -20px 20px -20px rgba(0,0,0,0.8)'
        }}
      >
        {displayedCodeLines.map((line, i) => {
           let color = '#2ecc71';
           if (currentBeat.codeColor === 'red') color = '#ff4757';
           else if (currentBeat.codeColor === 'mixed') {
               // Uma lógica simples para mixed: comentários em cinza, ou alternar cores
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
          padding: '30px',
          display: 'flex',
          flexDirection: 'column'
      }}>
        {isNarrationOrVisual && (
           <>
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
               whiteSpace: 'pre-wrap'
             }}>
               {displayedText}
               {!isTyping && currentBeat.type === 'narration' && (
                 <span style={{ color: '#3776ab', animation: 'blink 1s infinite', marginLeft: '5px' }}>▶</span>
               )}
             </div>
           </>
        )}
      </div>

      {/* DICA: PULAR */}
      <div style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '6px', color: '#64748b', fontFamily: '"Press Start 2P"' }}>
        [ ESC para pular ]
      </div>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
};

export default CutscenePlayer;