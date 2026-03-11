import { useState, useEffect, useCallback, useRef } from 'react';

// Declarar a função global do Pyodide que carregamos no index.html
declare global {
  interface Window {
    loadPyodide: any;
  }
}

export function usePyodide() {
  const pyodideRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initPyodide() {
      if (pyodideRef.current) return;
      
      try {
        pyodideRef.current = await window.loadPyodide();
        setIsReady(true);
      } catch (err) {
        console.error('Falha ao carregar Pyodide:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    initPyodide();
  }, []);

  const runCode = useCallback(async (code: string) => {
    if (!pyodideRef.current) return { success: false, error: 'Pyodide não carregado' };

    let stdout = "";
    
    // Configurar o redirecionamento do print() para uma string local
    pyodideRef.current.setStdout({
      batched: (s: string) => { stdout += s + "\n"; }
    });

    try {
      // Executar o código do jogador de forma assíncrona
      await pyodideRef.current.runPythonAsync(code);
      
      return { 
        success: true, 
        output: stdout.trim() 
      };
    } catch (err: any) {
      return { 
        success: false, 
        error: err.message 
      };
    }
  }, []);

  return { isReady, isLoading, runCode };
}
