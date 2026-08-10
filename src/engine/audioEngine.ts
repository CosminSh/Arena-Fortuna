class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isMusicMuted: boolean = false;
  private musicAudio: HTMLAudioElement | null = null;
  private currentTrackIndex: number = 0;
  private musicTrackNames: string[] = ['nocturnal.mp3', 'nocturnal-2.mp3'];
  private isMusicPlaying: boolean = false;

  private getTrackUrls(filename: string): string[] {
    const meta = import.meta as unknown as { env?: { BASE_URL?: string } };
    const base = meta.env?.BASE_URL || './';
    const cleanBase = base.endsWith('/') ? base : base + '/';
    return [
      `${cleanBase}music/${filename}`,
      `./music/${filename}`,
      `music/${filename}`,
      `/Arena-Fortuna/music/${filename}`,
    ];
  }

  private getSfxUrls(filename: string): string[] {
    const meta = import.meta as unknown as { env?: { BASE_URL?: string } };
    const base = meta.env?.BASE_URL || './';
    const cleanBase = base.endsWith('/') ? base : base + '/';
    return [
      `${cleanBase}Sfx/${filename}`,
      `./Sfx/${filename}`,
      `Sfx/${filename}`,
      `/Arena-Fortuna/Sfx/${filename}`,
    ];
  }

  public playSfxFile(filename: string | string[], volume: number = 0.5): boolean {
    if (this.isMuted) return false;
    try {
      const chosenFile = Array.isArray(filename)
        ? filename[Math.floor(Math.random() * filename.length)]
        : filename;
      const candidateUrls = this.getSfxUrls(chosenFile);
      const audio = new Audio(candidateUrls[0]);
      audio.volume = volume;

      let attempt = 0;
      audio.addEventListener('error', () => {
        attempt++;
        if (attempt < candidateUrls.length) {
          audio.src = candidateUrls[attempt];
          audio.play().catch(() => {});
        }
      });

      audio.play().catch(() => {});
      return true;
    } catch {
      return false;
    }
  }

  public initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public initAndPlayMusic() {
    this.initCtx();
    if (this.isMuted || this.isMusicMuted) return;

    if (!this.musicAudio) {
      const candidateUrls = this.getTrackUrls(this.musicTrackNames[this.currentTrackIndex]);
      this.musicAudio = new Audio(candidateUrls[0]);
      this.musicAudio.preload = 'auto';
      this.musicAudio.volume = 0.35;

      let urlAttempt = 0;
      this.musicAudio.addEventListener('error', () => {
        urlAttempt++;
        if (urlAttempt < candidateUrls.length && this.musicAudio) {
          this.musicAudio.src = candidateUrls[urlAttempt];
          this.musicAudio.play().catch(() => {});
        }
      });

      this.musicAudio.addEventListener('ended', () => {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.musicTrackNames.length;
        if (this.musicAudio) {
          const nextUrls = this.getTrackUrls(this.musicTrackNames[this.currentTrackIndex]);
          this.musicAudio.src = nextUrls[0];
          this.musicAudio.play().catch(() => {});
        }
      });
    }

    const playPromise = this.musicAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isMusicPlaying = true;
        })
        .catch(() => {
          this.isMusicPlaying = false;
        });
    }
  }

  public stopMusic() {
    if (this.musicAudio) {
      this.musicAudio.pause();
      this.isMusicPlaying = false;
    }
  }

  public toggleMusic(): boolean {
    this.isMusicMuted = !this.isMusicMuted;
    if (this.isMusicMuted) {
      this.stopMusic();
    } else {
      this.initAndPlayMusic();
    }
    return !this.isMusicMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopMusic();
    } else {
      this.initAndPlayMusic();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getIsMusicPlaying(): boolean {
    return this.isMusicPlaying && !this.isMusicMuted;
  }

  public playHover() {
    if (this.isMuted) return;
    if (!this.playSfxFile('sfx_click2.mp3', 0.25)) {
      this.initCtx();
      if (!this.ctx || this.ctx.state === 'suspended') return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(850, this.ctx.currentTime + 0.025);
      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.025);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.025);
    }
  }

  public playClick() {
    if (this.isMuted) return;
    if (!this.playSfxFile('sfx_click.mp3', 0.5)) {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(500, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.035);
      gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.035);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.035);
    }
  }

  public playTargetSelect() {
    if (this.isMuted) return;
    this.playSfxFile('sfx_target_select.mp3', 0.6);
  }

  public playEquip() {
    if (this.isMuted) return;
    this.playSfxFile('sfx_equip.mp3', 0.6);
  }

  public playSpinStart() {
    if (this.isMuted) return;
    this.playSfxFile(['sfx_spin_start.mp3', 'sfx_spin_start2.mp3'], 0.5);
  }

  public playPopSound() {
    if (this.isMuted) return;
    this.playSfxFile('sfx_pop_sound.mp3', 0.5);
  }

  public playSpinTick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320 + Math.random() * 80, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  public playReelStop() {
    if (this.isMuted) return;
    if (!this.playSfxFile('sfx_reel_stop.mp3', 0.5)) {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    }
  }

  public playJackpot() {
    if (this.isMuted) return;
    if (!this.playSfxFile(['sfx_crit_impact.mp3', 'sfx_crit_impact2.mp3'], 0.7)) {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.12, this.ctx!.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(this.ctx!.currentTime + idx * 0.08);
        osc.stop(this.ctx!.currentTime + idx * 0.08 + 0.25);
      });
    }
  }

  public playHit() {
    if (this.isMuted) return;
    if (!this.playSfxFile(['sfx_sword_impact.mp3', 'sfx_sword_impact2.mp3', 'sfx_sword_impact3.mp3'], 0.6)) {
      this.initCtx();
      if (!this.ctx) return;
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, this.ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.15);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      whiteNoise.start();
      whiteNoise.stop(this.ctx.currentTime + 0.15);
    }
  }

  public playShieldBlock() {
    if (this.isMuted) return;
    if (!this.playSfxFile(['sfx_shield_block.mp3', 'sfx_shield_block2.mp3', 'sfx_shield_block3.mp3'], 0.6)) {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    }
  }

  public playVictory() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.12);
      gain.gain.setValueAtTime(0.25, this.ctx!.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.12 + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(this.ctx!.currentTime + idx * 0.12);
      osc.stop(this.ctx!.currentTime + idx * 0.12 + 0.4);
    });
  }
}

export const soundFx = new AudioEngine();
