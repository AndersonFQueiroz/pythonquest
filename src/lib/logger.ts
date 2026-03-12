// SISTEMA DE TELEMETRIA MODULAR (Pode ser removido no futuro)
class GameLogger {
    private logs: string[] = [];

    constructor() {
        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Captura console.error
        const originalError = console.error;
        console.error = (...args: any[]) => {
            this.addLog('ERROR', args.join(' '));
            originalError.apply(console, args);
        };

        // Captura erros globais do navegador
        window.onerror = (message, source, lineno, colno, error) => {
            this.addLog('CRITICAL', `${message} at ${source}:${lineno}:${colno} | ${error?.stack}`);
            return false;
        };

        // Captura promessas rejeitadas
        window.onunhandledrejection = (event) => {
            this.addLog('PROMISE_REJECTION', event.reason);
        };
    }

    private addLog(type: string, message: string) {
        const timestamp = new Date().toLocaleTimeString();
        this.logs.push(`[${timestamp}] [${type}] ${message}`);
        // Mantém apenas os últimos 100 logs para não pesar a memória
        if (this.logs.length > 100) this.logs.shift();
    }

    public exportLogs() {
        const blob = new Blob([this.logs.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pythonquest_debug_report_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    public getLogs() {
        return this.logs;
    }
}

export const logger = new GameLogger();
