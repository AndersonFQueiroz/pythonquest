import React from 'react';

export const BugSprite: React.FC<{ id: string, shadow?: boolean }> = ({ id, shadow }) => {
  const shadowStyle: React.CSSProperties = shadow ? { filter: 'brightness(0)', opacity: 0.5 } : {};

  switch (id) {
    // REINO 1: Floresta das Variáveis
    case 'syntax_wasp':
      return (
        <div className="bug-sprite wasp" style={shadowStyle}>
          <div className="wing-l"></div><div className="wing-r"></div>
          <div className="body-wasp"><div className="eye-l"></div><div className="eye-r"></div></div>
          <div className="stinger"></div>
        </div>
      );
    case 'type_goblin':
      return (
        <div className="bug-sprite goblin" style={shadowStyle}>
          <div className="ear-l"></div><div className="ear-r"></div>
          <div className="body-goblin"><div className="eye-l"></div><div className="eye-r"></div></div>
        </div>
      );
    case 'name_bat':
      return (
        <div className="bug-sprite bat" style={shadowStyle}>
          <div className="wing-bat-l"></div><div className="wing-bat-r"></div>
          <div className="body-bat"><div className="eye-l"></div><div className="eye-r"></div></div>
        </div>
      );
    case 'print_ghost':
      return (
        <div className="bug-sprite ghost" style={shadowStyle}>
          <div className="body-ghost"><div className="eye-l"></div><div className="eye-r"></div><div className="ghost-tail"></div></div>
        </div>
      );

    // REINO 2: Caverna das Decisões
    case 'if_slime':
      return (
        <div className="bug-sprite slime-if" style={shadowStyle}>
          <div className="slime-body"><div className="eye-l"></div><div className="eye-r"></div></div>
        </div>
      );
    case 'bool_bat':
      return (
        <div className="bug-sprite bat-bool" style={shadowStyle}>
          <div className="wing-bat-l"></div><div className="wing-bat-r"></div>
          <div className="body-bat" style={{background: '#ffd43b'}}><div className="eye-l"></div><div className="eye-r"></div></div>
        </div>
      );
    case 'else_troll':
      return (
        <div className="bug-sprite troll" style={shadowStyle}>
          <div className="troll-body"><div className="eye-l"></div><div className="eye-r"></div><div className="troll-horn"></div></div>
        </div>
      );
    case 'logic_snake':
      return (
        <div className="bug-sprite snake" style={shadowStyle}>
          <div className="snake-body">
            <div className="eye-l"></div><div className="eye-r"></div>
            <div className="tongue"></div>
          </div>
        </div>
      );

    // REINO 3: Torre das Repetições
    case 'for_spider':
      return (
        <div className="bug-sprite spider" style={shadowStyle}>
            <div className="spider-leg l1"></div><div className="spider-leg l2"></div>
            <div className="spider-leg r1"></div><div className="spider-leg r2"></div>
            <div className="spider-body"><div className="eye-l"></div><div className="eye-r"></div></div>
        </div>
      );
    case 'while_worm':
      return (
        <div className="bug-sprite worm" style={shadowStyle}>
            <div className="worm-seg s1"></div><div className="worm-seg s2"></div>
            <div className="worm-seg s3"><div className="eye-l"></div></div>
        </div>
      );
    case 'range_rat':
      return (
        <div className="bug-sprite rat" style={shadowStyle}>
            <div className="rat-body">
                <div className="eye-l"></div>
                <div className="rat-tail"></div>
            </div>
        </div>
      );
    case 'break_beetle':
      return (
        <div className="bug-sprite beetle" style={shadowStyle}>
            <div className="beetle-shell"></div>
            <div className="beetle-head"><div className="eye-l"></div><div className="eye-r"></div></div>
        </div>
      );

    // REINO 4: Templo das Funções
    case 'def_dragon':
      return (
        <div className="bug-sprite dragon" style={shadowStyle}>
            <div className="dragon-wing"></div>
            <div className="dragon-body"><div className="eye-l"></div><div className="eye-r"></div></div>
            <div className="dragon-fire"></div>
        </div>
      );
    case 'return_raven':
      return (
        <div className="bug-sprite raven" style={shadowStyle}>
            <div className="raven-body"><div className="eye-l"></div><div className="raven-beak"></div></div>
            <div className="wing-bat-l"></div><div className="wing-bat-r"></div>
        </div>
      );
    case 'param_pig':
      return (
        <div className="bug-sprite pig" style={shadowStyle}>
            <div className="pig-body"><div className="eye-l"></div><div className="eye-r"></div><div className="pig-snout"></div></div>
        </div>
      );
    case 'scope_scorp':
      return (
        <div className="bug-sprite scorp" style={shadowStyle}>
            <div className="scorp-body"></div>
            <div className="scorp-tail"></div>
        </div>
      );

    // REINO 5: Cidadela da OOP
    case 'class_cat':
      return (
        <div className="bug-sprite cat" style={shadowStyle}>
            <div className="cat-ear-l"></div><div className="cat-ear-r"></div>
            <div className="cat-body"><div className="eye-l"></div><div className="eye-r"></div></div>
            <div className="cat-tail"></div>
        </div>
      );
    case 'init_owl':
      return (
        <div className="bug-sprite owl" style={shadowStyle}>
            <div className="owl-body"><div className="eye-l" style={{width:6, height:6}}></div><div className="eye-r" style={{width:6, height:6}}></div></div>
        </div>
      );
    case 'self_squid':
      return (
        <div className="bug-sprite squid" style={shadowStyle}>
            <div className="squid-head"><div className="eye-l"></div><div className="eye-r"></div></div>
            <div className="squid-tentacle"></div>
        </div>
      );
    case 'method_monkey':
      return (
        <div className="bug-sprite monkey" style={shadowStyle}>
            <div className="monkey-body"><div className="eye-l"></div><div className="eye-r"></div></div>
            <div className="monkey-arm"></div>
        </div>
      );

    default:
      return (
        <div className="bug-sprite generic-bug" style={shadowStyle}>
            <div className="generic-body" style={{background: '#444', border: '2px solid #000', width: '30px', height: '30px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px'}}>?</div>
        </div>
      );
  }
};
