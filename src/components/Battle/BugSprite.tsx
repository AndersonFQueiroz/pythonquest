import React from 'react';

export const BugSprite: React.FC<{ id: string, shadow?: boolean }> = ({ id, shadow }) => {
  const shadowStyle: React.CSSProperties = shadow ? { filter: 'brightness(0)', opacity: 0.5 } : {};

  switch (id) {
    case 'syntax_wasp':
      return (
        <div className="bug-sprite wasp" style={shadowStyle}>
          <div className="wing-l"></div>
          <div className="wing-r"></div>
          <div className="body-wasp">
            <div className="eye-l"></div>
            <div className="eye-r"></div>
          </div>
          <div className="stinger"></div>
        </div>
      );
    case 'type_goblin':
      return (
        <div className="bug-sprite goblin" style={shadowStyle}>
          <div className="ear-l"></div>
          <div className="ear-r"></div>
          <div className="body-goblin">
            <div className="eye-l"></div>
            <div className="eye-r"></div>
            <div className="mouth"></div>
          </div>
        </div>
      );
    case 'name_bat':
      return (
        <div className="bug-sprite bat" style={shadowStyle}>
          <div className="wing-bat-l"></div>
          <div className="wing-bat-r"></div>
          <div className="body-bat">
            <div className="eye-l"></div>
            <div className="eye-r"></div>
          </div>
        </div>
      );
    case 'print_ghost':
      return (
        <div className="bug-sprite ghost" style={shadowStyle}>
          <div className="body-ghost">
            <div className="eye-l"></div>
            <div className="eye-r"></div>
            <div className="ghost-tail"></div>
          </div>
        </div>
      );
    default:
      return <div className="bug-sprite default-bug" style={shadowStyle}></div>;
  }
};
