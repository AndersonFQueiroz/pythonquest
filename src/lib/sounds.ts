// Motor de som 8-bit usando Web Audio API
class SoundEngine {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number) {
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  private musicInterval: any = null;

  stopMusic() {
    if (this.musicInterval) {
        clearInterval(this.musicInterval);
        this.musicInterval = null;
    }
  }

  playBattleMusic(type: 'common' | 'boss' | 'final') {
    this.stopMusic();
    this.init();
    let step = 0;
    
    // Melodias simplificadas (frequências)
    const commonNotes = [261, 0, 261, 329, 392, 0, 392, 349]; // C4, E4, G4, F4
    const bossNotes = [130, 146, 130, 164, 130, 146, 110, 123]; // Bass tenso
    const finalNotes = [110, 110, 220, 110, 130, 146, 164, 196]; // Épico/Rápido

    const notes = type === 'final' ? finalNotes : (type === 'boss' ? bossNotes : commonNotes);
    const speed = type === 'final' ? 150 : 200;

    this.musicInterval = setInterval(() => {
        const freq = notes[step % notes.length];
        if (freq > 0) {
            this.playTone(freq, type === 'common' ? 'triangle' : 'sawtooth', 0.15, 0.05);
        }
        step++;
    }, speed);
  }

  playStep() {
    // Som de passo (curto e grave)
    this.playTone(150, 'triangle', 0.1, 0.1);
  }

  playSelect() {
    // Som de menu (agudo e rápido)
    this.playTone(800, 'square', 0.1, 0.1);
  }

  playEncounter() {
    // Som de início de batalha (sirene subindo)
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(800, this.ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  playHit() {
    // Som de dano (ruído branco)
    this.init();
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1);
    noise.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();
  }
}

export const sounds = new SoundEngine();
