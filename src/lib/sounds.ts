// Motor de som 8-bit usando Web Audio API pura
// Sistema de masterGain: controla volume de TUDO (ambiente + batalha + efeitos)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicInterval: ReturnType<typeof setInterval> | null = null;
  private currentVolume: number = 0.5;
  private isMuted: boolean = false;

  // ─── INICIALIZAÇÃO ────────────────────────────────────────────────────────────

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.currentVolume;
      this.masterGain.connect(this.ctx.destination);
    }
  }

  // ─── VOLUME GLOBAL ────────────────────────────────────────────────────────────

  setVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    this.isMuted = false;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.currentVolume, this.ctx.currentTime, 0.05);
    }
    this.persistVolume();
  }

  getVolume(): number {
    return this.isMuted ? 0 : this.currentVolume;
  }

  getRawVolume(): number {
    return this.currentVolume;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.isMuted ? 0 : this.currentVolume,
        this.ctx.currentTime,
        0.05
      );
    }
    this.persistVolume();
  }

  getMuted(): boolean {
    return this.isMuted;
  }

  private persistVolume() {
    try {
      localStorage.setItem('pq_volume', String(this.currentVolume));
      localStorage.setItem('pq_muted', String(this.isMuted));
    } catch (_) { /* ignore */ }
  }

  loadPersistedVolume() {
    try {
      const vol = localStorage.getItem('pq_volume');
      const muted = localStorage.getItem('pq_muted');
      if (vol !== null) this.currentVolume = parseFloat(vol);
      if (muted !== null) this.isMuted = muted === 'true';
    } catch (_) { /* ignore */ }
  }

  // ─── UTILITÁRIO INTERNO ───────────────────────────────────────────────────────

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number) {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.masterGain); // ← tudo passa pelo masterGain
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  // ─── MÚSICAS DE BATALHA ───────────────────────────────────────────────────────

  playBattleMusic(type: 'common' | 'boss' | 'final') {
    this.stopMusic();
    this.init();
    let step = 0;
    const commonNotes = [261, 0, 261, 329, 392, 0, 392, 349];
    const bossNotes   = [130, 146, 130, 164, 130, 146, 110, 123];
    const finalNotes  = [110, 110, 220, 110, 130, 146, 164, 196];
    const notes = type === 'final' ? finalNotes : (type === 'boss' ? bossNotes : commonNotes);
    const speed = type === 'final' ? 150 : 200;
    this.musicInterval = setInterval(() => {
      const freq = notes[step % notes.length];
      if (freq > 0) this.playTone(freq, type === 'common' ? 'triangle' : 'sawtooth', 0.15, 0.05);
      step++;
    }, speed);
  }

  // ─── MÚSICAS DE AMBIENTE (8 mapas) ───────────────────────────────────────────

  playAmbientMusic(mapId: string) {
    this.stopMusic();
    this.init();
    if (!this.ctx) return;
    let step = 0;

    // ── VILA INICIAL: flauta calma + baixo suave, esperançoso ────────────────
    if (mapId === 'village') {
      const mel  = [523, 0, 659, 0, 784, 0, 659, 0, 523, 0, 0, 0];
      const bass = [130, 0, 0, 196, 0, 0, 130, 0, 0, 196, 0, 0];
      this.musicInterval = setInterval(() => {
        const i = step % mel.length;
        if (mel[i]  > 0) this.playTone(mel[i],  'sine',     0.35, 0.04);
        if (bass[i] > 0) this.playTone(bass[i], 'triangle', 0.50, 0.025);
        step++;
      }, 380);
    }

    // ── FLORESTA DAS VARIÁVEIS: arpejo misterioso de Am menor ────────────────
    else if (mapId === 'world1') {
      const arp = [220, 0, 262, 0, 330, 0, 392, 0, 330, 0, 262, 0];
      const pad = [110, 0, 0, 0, 110, 0, 0, 0, 147, 0, 0, 0];
      this.musicInterval = setInterval(() => {
        const i = step % arp.length;
        if (arp[i] > 0) this.playTone(arp[i], 'triangle', 0.5,  0.035);
        if (pad[i] > 0) this.playTone(pad[i], 'sine',     0.8,  0.02);
        step++;
      }, 420);
    }

    // ── CAVERNA DAS DECISÕES: pulso binário True/False, drone de tensão ───────
    else if (mapId === 'world2') {
      const hi    = [196, 0, 196, 0, 220, 0, 196, 0];
      const lo    = [0, 147, 0, 147, 0, 131, 0, 147];
      const dFreq = [65, 73];
      this.musicInterval = setInterval(() => {
        const i = step % hi.length;
        if (hi[i] > 0) this.playTone(hi[i], 'sawtooth', 0.18, 0.025);
        if (lo[i] > 0) this.playTone(lo[i], 'sawtooth', 0.18, 0.02);
        if (step % 4 === 0) this.playTone(dFreq[step % 2], 'sine', 0.6, 0.015);
        step++;
      }, 340);
    }

    // ── TORRE DAS REPETIÇÕES: ritmo mecânico de engrenagem ───────────────────
    else if (mapId === 'world3') {
      const gear = [165, 0, 165, 220, 0, 165, 0, 165, 196, 0, 165, 220];
      const perc = [0, 880, 0, 0, 880, 0, 0, 880, 0, 0, 880, 0];
      this.musicInterval = setInterval(() => {
        const i = step % gear.length;
        if (gear[i] > 0) this.playTone(gear[i], 'square', 0.15, 0.035);
        if (perc[i] > 0) this.playTone(perc[i], 'square', 0.04, 0.015);
        step++;
      }, 280);
    }

    // ── OÁSIS DAS FUNÇÕES: escala frigia, deserto árido e lento ──────────────
    else if (mapId === 'world4') {
      const mel2   = [165, 0, 0, 175, 0, 0, 196, 0, 0, 220, 0, 0, 196, 0, 0, 175, 0, 0];
      const drone2 = [82,  0, 0, 0,   0, 0, 82,  0, 0, 0,   0, 0, 0,   0, 0, 0,   0, 0];
      this.musicInterval = setInterval(() => {
        const i = step % mel2.length;
        if (mel2[i]   > 0) this.playTone(mel2[i],   'sine', 0.6, 0.04);
        if (drone2[i] > 0) this.playTone(drone2[i], 'sine', 1.0, 0.015);
        step++;
      }, 450);
    }

    // ── CIDADELA DA OOP: coral de acordes arpejados, grandioso ───────────────
    else if (mapId === 'world5') {
      const chords = [
        [131, 156, 196], // Cm
        [131, 156, 196],
        [104, 131, 165], // Ab
        [104, 131, 165],
        [156, 196, 233], // Eb
        [156, 196, 233],
        [117, 147, 175], // Bb
        [117, 147, 175],
      ];
      this.musicInterval = setInterval(() => {
        const chord = chords[step % chords.length];
        chord.forEach((freq, i) => {
          setTimeout(() => {
            this.playTone(freq, 'triangle', 0.7, 0.02 + i * 0.005);
          }, i * 30);
        });
        step++;
      }, 700);
    }

    // ── NÚCLEO ABISSAL: dissonância opressiva, descendo cromaticamente ────────
    else if (mapId === 'final_boss') {
      const dark   = [87, 0, 82, 0, 78, 0, 73, 0];
      const pulse2 = [0, 146, 0, 0, 0, 138, 0, 0];
      const sub    = [41, 0, 0, 0, 41, 0, 0, 0];
      this.musicInterval = setInterval(() => {
        const i = step % dark.length;
        if (dark[i]   > 0) this.playTone(dark[i],   'sawtooth', 0.5, 0.03);
        if (pulse2[i] > 0) this.playTone(pulse2[i], 'sawtooth', 0.2, 0.025);
        if (sub[i]    > 0) this.playTone(sub[i],    'sine',     0.8, 0.02);
        step++;
      }, 360);
    }

    // ── CASA DO APRENDIZ: melodia suave de lar, aconchegante ─────────────────
    else if (mapId === 'player_house') {
      const home = [523, 0, 0, 587, 0, 0, 659, 0, 0, 0, 587, 0, 523, 0, 0, 0];
      this.musicInterval = setInterval(() => {
        const i = step % home.length;
        if (home[i] > 0) this.playTone(home[i], 'sine', 0.5, 0.025);
        step++;
      }, 500);
    }
  }

  // ─── EFEITOS SONOROS ─────────────────────────────────────────────────────────

  playStep() {
    this.playTone(150, 'triangle', 0.1, 0.1);
  }

  playSelect() {
    this.playTone(800, 'square', 0.1, 0.1);
  }

  playEncounter() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const osc  = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(800, this.ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  playHit() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer     = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data       = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1);
    noise.connect(gain);
    gain.connect(this.masterGain);
    noise.start();
  }
}

export const sounds = new SoundEngine();
