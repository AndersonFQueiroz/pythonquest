import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { sounds } from '../../lib/sounds';
import { useGameStore } from '../../hooks/useGameStore';

interface AuthScreenProps {
  onLoginSuccess: (hasSave: boolean) => void;
  onSkip: () => void; // Para jogar offline
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess, onSkip }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadFromCloud = useGameStore((state) => state.loadFromCloud);
  const setUserId = useGameStore((state) => state.setUserId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playSelect();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        // Se logou com sucesso, tenta carregar o save da nuvem
        if (data.user) {
            setUserId(data.user.id);
            const hasSave = await loadFromCloud(data.user.id);
            onLoginSuccess(hasSave);
        }
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        
        // Se a criação for automática (sem confirmar email), já loga
        if (data.user) {
            setUserId(data.user.id);
            onLoginSuccess(false); // Nova conta = sem save, vai pra criação de char
        } else {
            setError('Conta criada com sucesso! Faça login agora.');
            setIsLogin(true);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erro de autenticação');
    } finally {
      setLoading(false);
    }
  };

  const btnStyle = {
    padding: '12px',
    backgroundColor: '#3776ab',
    color: '#fff',
    border: '2px solid #fff',
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '10px',
    cursor: 'pointer',
    marginTop: '10px'
  };

  const inputStyle = {
    padding: '10px',
    margin: '10px 0',
    backgroundColor: '#0f172a',
    color: '#2ecc71',
    border: '2px solid #3776ab',
    fontFamily: 'monospace',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box' as const
  };

  return (
    <div style={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
        height: '100%', width: '100%', backgroundColor: '#0f172a', color: '#fff', 
        textAlign: 'center', padding: '20px', position: 'relative', overflow: 'hidden' 
    }}>
      
      {/* Elementos de Fundo (Partículas Retrô) */}
      <div style={{ position: 'absolute', top: '10%', left: '10%', color: 'rgba(55, 118, 171, 0.2)', fontSize: '24px', animation: 'float 3s infinite ease-in-out' }}>{"{}"}</div>
      <div style={{ position: 'absolute', bottom: '15%', right: '15%', color: 'rgba(255, 212, 59, 0.2)', fontSize: '24px', animation: 'float 4s infinite ease-in-out reverse' }}>[]</div>
      <div style={{ position: 'absolute', top: '20%', right: '10%', color: 'rgba(46, 204, 113, 0.2)', fontSize: '24px', animation: 'float 5s infinite ease-in-out' }}>()</div>

      {/* Logo do Jogo */}
      <img 
        src="/Logo_PythonQuest.png" 
        alt="PythonQuest Logo" 
        style={{ width: '280px', maxWidth: '80%', marginBottom: '20px', filter: 'drop-shadow(0px 10px 10px rgba(0,0,0,0.5))', animation: 'float 6s infinite ease-in-out' }} 
      />

      <p style={{ color: '#94a3b8', fontSize: '8px', marginBottom: '25px', maxWidth: '300px', lineHeight: '1.6' }}>
        Sincronize seu terminal com o <span style={{ color: '#ffd43b' }}>Zen do Python</span> para imortalizar sua jornada e proteger seus dados da corrupção!
      </p>

      <form onSubmit={handleSubmit} style={{ 
          width: '320px', backgroundColor: 'rgba(30, 41, 59, 0.8)', 
          padding: '25px', border: '3px solid #3776ab', borderRadius: '8px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(55, 118, 171, 0.2)',
          zIndex: 10
      }}>
        
        <h2 style={{ fontSize: '10px', color: '#fff', marginBottom: '20px', borderBottom: '2px solid #3776ab', paddingBottom: '10px' }}>
            {isLogin ? 'ACESSO AO SISTEMA' : 'NOVO REGISTRO'}
        </h2>

        <input 
            type="email" 
            placeholder="Seu E-mail" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ ...inputStyle, borderRadius: '4px' }} 
            required 
        />
        
        <input 
            type="password" 
            placeholder="Senha secreta (mín. 6)" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ ...inputStyle, borderRadius: '4px' }} 
            required 
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '10px 0', cursor: 'pointer' }} onClick={() => setRememberMe(!rememberMe)}>
            <div style={{ width: '12px', height: '12px', border: '2px solid #3776ab', backgroundColor: rememberMe ? '#2ecc71' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {rememberMe && <span style={{ color: '#0f172a', fontSize: '10px', fontWeight: 'bold' }}>✓</span>}
            </div>
            <span style={{ fontSize: '7px', color: '#94a3b8' }}>Lembrar de mim (Login Automático)</span>
        </div>

        {error && (
            <div style={{ color: '#ff4757', fontSize: '7px', margin: '10px 0', backgroundColor: 'rgba(255, 71, 87, 0.1)', padding: '10px', border: '1px dashed #ff4757', borderRadius: '4px', lineHeight: '1.4' }}>
                {error}
            </div>
        )}

        <button type="submit" disabled={loading} style={{ ...btnStyle, width: '100%', opacity: loading ? 0.5 : 1, borderRadius: '4px', backgroundColor: '#2ecc71', borderColor: '#27ae60', color: '#0f172a', padding: '15px' }}>
          {loading ? 'CONECTANDO...' : (isLogin ? 'ENTRAR EM PYTHORIA' : 'CRIAR CONTA')}
        </button>

        <div style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <span style={{ fontSize: '8px', cursor: 'pointer', color: '#3498db', transition: 'color 0.2s' }} 
                  onClick={() => { sounds.playSelect(); setIsLogin(!isLogin); setError(null); }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#3498db'}>
            {isLogin ? '>> Não tem conta? Cadastre-se' : '>> Já é jogador? Faça Login'}
            </span>
        </div>
      </form>

      <button onClick={() => { sounds.playSelect(); onSkip(); }} 
              style={{ marginTop: '30px', backgroundColor: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer', fontSize: '7px', zIndex: 10, transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>
        [ Continuar Offline (Apenas save local) ]
      </button>

    </div>
  );
};

export default AuthScreen;
