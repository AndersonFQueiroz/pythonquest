import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERRO CRÍTICO: Chaves do Supabase não encontradas. O salvamento na nuvem não funcionará.');
}

const createSafeClient = () => {
    try {
        if (supabaseUrl && supabaseAnonKey) {
            return createClient(supabaseUrl, supabaseAnonKey);
        }
    } catch (error) {
        console.error('Falha ao inicializar o Supabase (verifique se a URL é válida):', error);
    }
    
    // Fallback Mock se falhar ou não tiver chaves
    return {
        auth: {
            signInWithPassword: async () => ({ error: { message: "Supabase não configurado ou URL inválida." } }),
            signUp: async () => ({ error: { message: "Supabase não configurado ou URL inválida." } })
        },
        from: () => ({
            select: () => ({ eq: () => ({ single: async () => ({ error: true }) }) }),
            upsert: async () => ({ error: true })
        })
    } as any;
};

export const supabase = createSafeClient();


