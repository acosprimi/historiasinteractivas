/* Motor de sonido local (Web Audio, sin archivos). Capas: ambiente, páginas, mensajes, decisiones, finales. */
(() => {
  'use strict';
  const AC = window.AudioContext || window.webkitAudioContext;
  let ctx = null, master = null, amb = null;
  const btn = () => document.getElementById('btn-sonido');
  const on = () => !!AC && btn() && btn().getAttribute('aria-pressed') !== 'false';

  function init() {
    if (!AC || !on()) return null;
    if (!ctx) {
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0.9;
      const comp = ctx.createDynamicsCompressor();
      master.connect(comp); comp.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  }
  function ruido(dur, tipo = 'white') {
    const b = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate), d = b.getChannelData(0);
    let l = 0;
    for (let i = 0; i < d.length; i++) {
      const w = Math.random() * 2 - 1;
      if (tipo === 'brown') { l = (l + 0.02 * w) / 1.02; d[i] = l * 3.5; } else d[i] = w;
    }
    const s = ctx.createBufferSource(); s.buffer = b; return s;
  }
  function env(g, t, a, pico, r) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(pico, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + r);
  }
  function soplo({ t, dur, f0, f1, q = 0.8, vol, tipo = 'bandpass', a = 0.02 }) {
    const n = ruido(dur + 0.05), f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = tipo; f.Q.value = q;
    f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    env(g, t, a, vol, dur - a);
    n.connect(f); f.connect(g); g.connect(master); n.start(t); n.stop(t + dur + 0.05);
  }
  function tono({ t, f0, f1, dur, vol, tipo = 'sine', a = 0.01 }) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = tipo; o.frequency.setValueAtTime(f0, t);
    if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    env(g, t, a, vol, dur - a);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.02);
  }
  const hacer = (fn) => (...a) => { if (init()) fn(ctx.currentTime, ...a); };

  const SND = {
    /* hoja que se levanta, roza y cae */
    pagina: hacer((t) => {
      soplo({ t, dur: 0.38, f0: 700, f1: 3200, q: 0.5, vol: 0.05, a: 0.12 });
      soplo({ t: t + 0.30, dur: 0.50, f0: 2600, f1: 500, q: 0.6, vol: 0.06, a: 0.05 });
      tono({ t: t + 0.62, f0: 140, f1: 70, dur: 0.14, vol: 0.05, tipo: 'triangle' });
      soplo({ t: t + 0.62, dur: 0.12, f0: 1800, f1: 900, q: 1.2, vol: 0.035 });
    }),
    /* mensaje entrante (con vibración opcional) */
    mensaje: hacer((t, vibra) => {
      if (vibra) for (let i = 0; i < 3; i++) tono({ t: t + i * 0.13, f0: 130, dur: 0.1, vol: 0.05, tipo: 'square', a: 0.006 });
      const d = vibra ? 0.4 : 0;
      tono({ t: t + d, f0: 784, dur: 0.16, vol: 0.05, a: 0.004 });
      tono({ t: t + d + 0.09, f0: 1175, dur: 0.3, vol: 0.04, a: 0.004 });
    }),
    enviar: hacer((t) => { soplo({ t, dur: 0.2, f0: 500, f1: 2600, q: 0.7, vol: 0.04 }); tono({ t: t + 0.12, f0: 660, dur: 0.12, vol: 0.03 }); }),
    /* decisión: golpecito de madera */
    clic: hacer((t) => { tono({ t, f0: 320, f1: 160, dur: 0.12, vol: 0.09, tipo: 'triangle', a: 0.003 }); soplo({ t, dur: 0.05, f0: 2400, f1: 1800, q: 2, vol: 0.05, a: 0.002 }); }),
    suspenso: hacer((t) => [[196, .07], [202, .05], [98, .05], [147, .03]].forEach(([f, v]) => tono({ t, f0: f, f1: f * 0.92, dur: 1.5, vol: v, a: 0.25, tipo: f < 120 ? 'triangle' : 'sine' }))),
    final: hacer((t) => { [110, 130.8, 164.8].forEach((f, i) => tono({ t: t + i * 0.18, f0: f, f1: f * 0.98, dur: 2.6, vol: 0.05, a: 0.5, tipo: 'sine' })); }),

    /* ---------- Parte 4: sonidos por escena ---------- */
    /* teclas del teléfono mientras el otro escribe */
    teclas: hacer((t, ms = 900) => {
      const n = Math.max(3, Math.min(14, Math.round(ms / 110)));
      let x = 0;
      for (let i = 0; i < n; i++) {
        x += 0.07 + Math.random() * 0.09;
        tono({ t: t + x, f0: 1500 + Math.random() * 500, f1: 900, dur: 0.035, vol: 0.016, tipo: 'square', a: 0.002 });
      }
    }),
    /* roce suave al pasar el cursor por una decisión */
    roce: hacer((t) => soplo({ t, dur: 0.09, f0: 1400, f1: 2200, q: 0.9, vol: 0.012, a: 0.01 })),
    /* aviso del foro: dos golpes secos de teclado + campanita lejana */
    foro: hacer((t) => {
      tono({ t, f0: 210, f1: 120, dur: 0.07, vol: 0.05, tipo: 'triangle', a: 0.002 });
      tono({ t: t + 0.09, f0: 240, f1: 130, dur: 0.07, vol: 0.04, tipo: 'triangle', a: 0.002 });
      tono({ t: t + 0.22, f0: 1568, dur: 0.5, vol: 0.016, a: 0.005 });
    }),
    /* página falsa que carga: zumbido que sube y un clic */
    web: hacer((t) => {
      soplo({ t, dur: 0.7, f0: 300, f1: 2400, q: 1.6, vol: 0.028, a: 0.25 });
      tono({ t: t + 0.7, f0: 880, dur: 0.05, vol: 0.03, tipo: 'square', a: 0.002 });
    }),
    comparar: hacer((t) => { tono({ t, f0: 523, dur: 0.18, vol: 0.035 }); tono({ t: t + 0.16, f0: 659, dur: 0.3, vol: 0.035 }); }),
    /* llamada: timbre de teléfono dos veces y descuelgue */
    llamada: hacer((t) => {
      for (let k = 0; k < 2; k++) for (let i = 0; i < 6; i++) {
        const u = t + k * 1.15 + i * 0.075;
        tono({ t: u, f0: 440, dur: 0.06, vol: 0.026, tipo: 'sine', a: 0.004 });
        tono({ t: u, f0: 480, dur: 0.06, vol: 0.022, tipo: 'sine', a: 0.004 });
      }
      tono({ t: t + 2.45, f0: 300, f1: 200, dur: 0.1, vol: 0.04, tipo: 'triangle', a: 0.003 });
    }),
    /* pasos acercándose (Camila en camino) */
    pasos: hacer((t) => {
      for (let i = 0; i < 6; i++) {
        const u = t + i * 0.42, v = 0.012 + i * 0.006;
        tono({ t: u, f0: 110, f1: 60, dur: 0.1, vol: v * 2, tipo: 'triangle', a: 0.004 });
        soplo({ t: u, dur: 0.07, f0: 900, f1: 500, q: 1, vol: v, a: 0.003 });
      }
    }),
    latido: hacer((t) => [0, 0.34].forEach((d) => tono({ t: t + d, f0: 70, f1: 42, dur: 0.22, vol: 0.09, a: 0.01 }))),
    reloj: hacer((t) => { for (let i = 0; i < 4; i++) tono({ t: t + i, f0: 1900, f1: 1300, dur: 0.03, vol: 0.02, tipo: 'square', a: 0.001 }); }),
    /* apagar el teléfono: pitido descendente y silencio */
    apagar: hacer((t) => { tono({ t, f0: 700, f1: 90, dur: 0.55, vol: 0.045, tipo: 'triangle', a: 0.01 }); soplo({ t: t + 0.5, dur: 0.15, f0: 400, f1: 200, vol: 0.02 }); }),
    /* mensaje de otro número: vibración corta y tono hueco */
    otroNumero: hacer((t) => { for (let i = 0; i < 2; i++) tono({ t: t + i * 0.16, f0: 130, dur: 0.1, vol: 0.05, tipo: 'square', a: 0.006 }); tono({ t: t + 0.5, f0: 392, f1: 370, dur: 1.2, vol: 0.03, a: 0.02 }); }),
    /* rúbrica de cada final (cada uno suena distinto) */
    finalDe: hacer((t, id) => {
      const acorde = (fs, vol, dur, tipo = 'sine', sep = 0.16) => fs.forEach((f, i) => tono({ t: t + i * sep, f0: f, f1: f * 0.985, dur, vol, a: 0.5, tipo }));
      if (id === 'f1') { acorde([110, 116.5, 164.8, 233], 0.04, 3.2, 'sine', 0.1); soplo({ t, dur: 1.6, f0: 2400, f1: 300, q: 2, vol: 0.02, a: 0.4 }); }
      else if (id === 'f2') { acorde([196, 246.9, 293.7], 0.045, 3, 'sine', 0.22); tono({ t: t + 0.9, f0: 1175, dur: 1.6, vol: 0.015, a: 0.01 }); }
      else if (id === 'f3') { acorde([130.8, 196, 261.6, 329.6], 0.04, 3.6, 'sine', 0.2); tono({ t: t + 1.2, f0: 1318, dur: 1.4, vol: 0.014, a: 0.01 }); }
      else if (id === 'f4') { acorde([98, 146.8], 0.05, 3.2, 'triangle', 0.3); soplo({ t: t + 0.6, dur: 2.4, f0: 300, f1: 140, q: 0.5, vol: 0.02, a: 0.8, tipo: 'lowpass' }); tono({ t: t + 2.6, f0: 392, f1: 370, dur: 0.9, vol: 0.02, a: 0.01 }); }
      else if (id === 'f5') { acorde([123.5, 146.8, 185], 0.04, 3, 'sine', 0.14); tono({ t: t + 1.0, f0: 55, f1: 50, dur: 1.4, vol: 0.05, tipo: 'triangle', a: 0.1 }); }
      else if (id === 'f6') { acorde([146.8, 185, 220, 277.2], 0.042, 3.4, 'sine', 0.2); tono({ t: t + 1.1, f0: 1108, dur: 1.5, vol: 0.014, a: 0.01 }); }
      else if (id === 'f7') { acorde([174.6, 220, 261.6], 0.045, 3.2, 'sine', 0.24); tono({ t: t + 1.0, f0: 1397, dur: 1.4, vol: 0.013, a: 0.01 }); }
      else if (id === 'r_f1') { acorde([110, 130.8, 164.8], 0.045, 3.2, 'sine', 0.16); tono({ t: t + 1.1, f0: 82.4, f1: 73.4, dur: 1.6, vol: 0.05, tipo: 'triangle', a: 0.1 }); }
      else if (id === 'r_f2') { acorde([130.8, 164.8, 196, 261.6], 0.045, 3.4, 'sine', 0.22); tono({ t: t + 1.0, f0: 1046.5, dur: 1.5, vol: 0.014, a: 0.01 }); }
      else acorde([110, 130.8, 164.8], 0.05, 2.6);
    }),
    /* ambiente: cambia de tono según la escena (más grave y cerrado = más tensión) */
    clima(nivel) {
      if (!amb || !ctx) return;
      const m = { calma: [380, 0.05, 60], tension: [260, 0.06, 58], hondo: [170, 0.065, 55], final: [520, 0.035, 60], vacio: [140, 0.02, 60] }[nivel] || [380, 0.05, 60];
      amb.f.frequency.setTargetAtTime(m[0], ctx.currentTime, 1.6);
      amb.g.gain.setTargetAtTime(on() ? m[1] * 0.55 : 0.0001, ctx.currentTime, 1.4);
      amb.z.frequency.setTargetAtTime(m[2], ctx.currentTime, 1.4);
    },
    /* qué suena al entrar en cada escena */
    escena(id) {
      const clima = { portada: 'calma', s1: 'calma', s2a: 'tension', s2a1: 'tension', s2a2: 'tension', s2acheck: 'calma', s2b: 'tension', s2b1: 'tension', s2b2: 'hondo', s2c: 'calma', s3: 'hondo', f1: 'hondo', f2: 'final', f3: 'final', f4: 'vacio', f5: 'hondo', f6: 'final', f7: 'final', s2cc: 'calma', s3x: 'hondo', cierre: 'vacio', r1: 'calma', r2a: 'tension', r2b: 'calma', r2c: 'hondo', r3: 'tension', r4: 'hondo', r_f1: 'hondo', r_f2: 'final' }[id] || 'calma';
      SND.clima(clima);
      SND.musica(id);
      if (id === 's2c') setTimeout(() => SND.llamada(), 900);
      if (id === 's3') setTimeout(() => SND.latido(), 1200);
      if (id === 's2b2') setTimeout(() => SND.reloj(), 1500);
      if (id === 'r3') setTimeout(() => SND.reloj(), 1500);
      if (id === 'f3') setTimeout(() => SND.pasos(), 1200);
      if (id === 'f4') setTimeout(() => SND.apagar(), 600);
    },
    /* ambiente: murmullo grave de la noche + zumbido eléctrico muy bajo */
    ambiente(activo) {
      if (!activo) { if (amb) { amb.g.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.4); } return; }
      if (!init()) return;
      if (!amb) {
        const n = ruido(8, 'brown'); n.loop = true;
        const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 380;
        const g = ctx.createGain(); g.gain.value = 0.0001;
        const lfo = ctx.createOscillator(), lg = ctx.createGain();
        lfo.frequency.value = 0.07; lg.gain.value = 120; lfo.connect(lg); lg.connect(f.frequency); lfo.start();
        const z = ctx.createOscillator(), zg = ctx.createGain(); z.frequency.value = 60; zg.gain.value = 0.0015; z.connect(zg); zg.connect(g);
        n.connect(f); f.connect(g); g.connect(master); n.start(); z.start();
        amb = { g, f, z };
      }
      amb.g.gain.setTargetAtTime(0.03, ctx.currentTime, 1.2);
    },
  };

  /* =====================================================================
     Música por escena (v2.2). Cada escena tiene un tema propio con melodía
     fija (un motivo que vuelve y varía), armonía, ritmo e instrumentos según
     el ánimo: calma, tensión, hondo, tristeza, esperanza, vacío…
     La melodía respira: cada cierto ciclo calla y queda solo el acompañamiento.
     Todo se sintetiza con Web Audio; no hay archivos de audio.
     ===================================================================== */
  const m2f = (n) => 440 * Math.pow(2, (n - 69) / 12);
  const ESC = {
    menor: [0, 2, 3, 5, 7, 8, 10], mayor: [0, 2, 4, 5, 7, 9, 11], frigio: [0, 1, 3, 5, 7, 8, 10],
    dorio: [0, 2, 3, 5, 7, 9, 10], lidio: [0, 2, 4, 6, 7, 9, 11], armonica: [0, 2, 3, 5, 7, 8, 11],
  };
  const semilla = (s) => () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const BASE = { escala: 'menor', pasos: 8, bpm: 66, arp: null, arpOct: 0, arpVol: 0.036, mel: 1, melInst: 'piano', melOct: 12, melVol: 0.05, melNotas: 3, contorno: 'onda', snap: true, ciclo: 3, pad: 0.014, padOct: 0, trem: 0, bajo: 0.045, pulso: null, pulsoVol: 0.06, drone: 0, campana: 0, aire: 0, color: '', reverb: 0.55, acelera: 0, semilla: 1 };

  /* Cada tema: raiz (nota MIDI), escala, prog (grados de los acordes), bpm, y los instrumentos que lo forman. */
  const TEMAS = {
    /* calma: intimista, piano con arpegio suave y un motivo que vuelve; la noche aún es tranquila */
    calma:    { raiz: 57, escala: 'menor', prog: [0, 5, 2, 6], bpm: 64, arp: 'sube', melNotas: 3, campana: 0.012, reverb: 0.6, semilla: 11 },
    /* tensión: ostinato grave, cuerdas que tiemblan, notas sueltas que no resuelven; el pulso se acelera */
    tension:  { raiz: 50, escala: 'frigio', prog: [0, 1, 0, 3], bpm: 92, melNotas: 2, melOct: 24, melVol: 0.04, snap: false, contorno: 'baja', ciclo: 2, pad: 0.02, padOct: 12, trem: 7, color: 'x', pulso: 'ostinato', acelera: 0.012, reverb: 0.5, semilla: 23 },
    /* hondo: oscuro y pesado; bordón grave con latido, casi sin melodía */
    hondo:    { raiz: 43, escala: 'frigio', prog: [0, 1], bpm: 46, melNotas: 2, melVol: 0.036, pad: 0.026, drone: 0.05, pulso: 'latido', pulsoVol: 0.08, aire: 0.02, color: 'x', reverb: 0.8, semilla: 31 },
    /* alarma: la página desconocida; pulso rápido y agudos incómodos */
    alarma:   { raiz: 45, escala: 'frigio', prog: [0, 1, 0, 6], bpm: 108, melNotas: 3, melOct: 24, melVol: 0.035, snap: false, contorno: 'sube', ciclo: 4, pad: 0.022, padOct: 12, trem: 9, color: 'x', pulso: 'ostinato', pulsoVol: 0.07, bajo: 0.055, acelera: 0.015, reverb: 0.45, semilla: 41 },
    /* Camila: cálido y humano; llega la ayuda, pero hay algo que no se dice */
    camila:   { raiz: 52, escala: 'menor', prog: [0, 2, 5, 6], bpm: 76, arp: 'sube', arpVol: 0.036, melNotas: 4, pad: 0.016, reverb: 0.5, semilla: 53 },

    /* finales */
    f1:       { raiz: 45, escala: 'armonica', prog: [0, 5, 6, 1], bpm: 52, arp: 'esparcido', arpVol: 0.026, melInst: 'solo', melNotas: 3, contorno: 'baja', melVol: 0.05, snap: false, pad: 0.024, drone: 0.035, bajo: 0.05, color: 'x', reverb: 0.85, semilla: 61 },
    f2:       { raiz: 48, escala: 'mayor', prog: [0, 4, 5, 3], bpm: 72, arp: 'sube', melNotas: 4, contorno: 'sube', melVol: 0.052, pad: 0.016, campana: 0.02, reverb: 0.65, semilla: 71 },
    f3:       { raiz: 55, escala: 'mayor', prog: [0, 3, 0, 4], bpm: 84, pasos: 6, arp: 'vals', arpVol: 0.038, melNotas: 4, contorno: 'sube', melVol: 0.055, pad: 0.02, campana: 0.02, reverb: 0.6, semilla: 83 },
    f4:       { raiz: 50, escala: 'menor', prog: [0, 5], bpm: 40, arp: 'disperso', arpVol: 0.022, melNotas: 2, melVol: 0.035, ciclo: 2, pad: 0.008, bajo: 0, drone: 0.02, campana: 0.014, aire: 0.03, reverb: 0.9, semilla: 97 },
    f5:       { raiz: 45, escala: 'menor', prog: [0, 5, 2, 4], bpm: 50, arp: 'bloque', arpVol: 0.04, melInst: 'solo', melNotas: 3, contorno: 'baja', melVol: 0.055, pad: 0.018, bajo: 0.04, reverb: 0.8, semilla: 109 },
    f6:       { raiz: 50, escala: 'mayor', prog: [0, 4, 5, 3], bpm: 70, arp: 'sube', melNotas: 4, contorno: 'sube', pad: 0.018, campana: 0.024, reverb: 0.6, semilla: 127 },
    f7:       { raiz: 53, escala: 'lidio', prog: [0, 4, 1, 0], bpm: 68, arp: 'sube', arpVol: 0.03, melInst: 'campana', melNotas: 3, melVol: 0.035, color: '9', pad: 0.015, reverb: 0.7, semilla: 131 },

    /* «Lo que no era suyo» (Mateo) */
    m_noche:  { raiz: 50, escala: 'menor', prog: [0, 5, 2, 6], bpm: 60, arp: 'esparcido', arpVol: 0.034, melNotas: 3, contorno: 'baja', pad: 0.014, reverb: 0.6, semilla: 141 },
    m_pedir:  { raiz: 53, escala: 'dorio', prog: [0, 3, 6, 4], bpm: 68, arp: 'sube', melNotas: 4, contorno: 'sube', pad: 0.015, reverb: 0.6, semilla: 151 },
    m_lucia:  { raiz: 57, escala: 'mayor', prog: [0, 4, 5, 3], bpm: 78, pasos: 6, arp: 'vals', arpVol: 0.04, melNotas: 4, contorno: 'sube', pad: 0.017, campana: 0.02, reverb: 0.6, semilla: 163 },
    m_orgullo:{ raiz: 48, escala: 'menor', prog: [0, 6], bpm: 50, melInst: 'solo', melNotas: 2, contorno: 'baja', pad: 0.02, drone: 0.03, reverb: 0.8, semilla: 173 },
    m_sobre:  { raiz: 45, escala: 'frigio', prog: [0, 1, 0, 6], bpm: 88, melNotas: 2, melOct: 24, melVol: 0.035, snap: false, ciclo: 2, pad: 0.02, padOct: 12, trem: 6, color: 'x', pulso: 'latido2', pulsoVol: 0.07, bajo: 0.05, acelera: 0.012, reverb: 0.5, semilla: 181 },
    m_peso:   { raiz: 43, escala: 'menor', prog: [0, 5, 3, 4], bpm: 46, arp: 'bloque', arpVol: 0.035, melInst: 'solo', melNotas: 3, contorno: 'baja', pad: 0.02, drone: 0.03, reverb: 0.85, semilla: 191 },
    m_f1:     { raiz: 45, escala: 'menor', prog: [0, 5, 3, 6], bpm: 52, arp: 'esparcido', arpVol: 0.03, melInst: 'solo', melNotas: 3, contorno: 'baja', pad: 0.02, reverb: 0.85, semilla: 201 },
    m_f2:     { raiz: 48, escala: 'mayor', prog: [0, 4, 5, 3], bpm: 72, arp: 'sube', arpVol: 0.038, melNotas: 4, contorno: 'sube', melVol: 0.052, pad: 0.019, campana: 0.022, reverb: 0.65, semilla: 211 },
    cierre:   { raiz: 57, escala: 'menor', prog: [0, 3], bpm: 56, arp: 'esparcido', arpVol: 0.03, melNotas: 3, melVol: 0.045, pad: 0.012, reverb: 0.7, semilla: 11 },
  };
  const TEMA_DE = { portada: 'calma', s1: 'calma', s2a: 'tension', s2a1: 'tension', s2a2: 'tension', s2acheck: 'calma', s2b: 'tension', s2b1: 'tension', s2b2: 'hondo', s2c: 'camila', s3: 'alarma', f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4', f5: 'f5', f6: 'f6', f7: 'f7', s2cc: 'camila', s3x: 'hondo', cierre: 'cierre',
    r1: 'm_noche', r2a: 'm_pedir', r2b: 'm_lucia', r2c: 'm_orgullo', r3: 'm_sobre', r4: 'm_peso', r_f1: 'm_f1', r_f2: 'm_f2' };

  const ARP = { sube: [0, 1, 2, 3, 2, 1, 2, 1], vals: [0, 2, 1, 2, 1, 2], esparcido: [0, -1, 2, -1, 1, -1, -1, 3], disperso: [0, -1, -1, -1, 2, -1, -1, -1], bloque: [] };
  const OST = [1, 0.35, 0.6, 0.35, 0.85, 0.35, 0.6, 0.45];

  /* Convierte la definición de un tema en notas concretas: acordes y motivo melódico (siempre igual para ese tema). */
  const COMPILADOS = {};
  function compilar(def) {
    const T = Object.assign({}, BASE, def), sc = ESC[T.escala];
    const nota = (i) => T.raiz + 12 * Math.floor(i / 7) + sc[((i % 7) + 7) % 7];
    const baja = (r) => (r >= 4 ? r - 7 : r);
    T.acordes = T.prog.map((r) => {
      const ix = [r, r + 2, r + 4];
      if (T.color.includes('7')) ix.push(r + 6);
      if (T.color.includes('9')) ix.push(r + 8);
      if (T.color.includes('x')) ix.push(r + 1); // roce disonante
      return { r, pad: ix.map((i) => nota(i >= 7 ? i - 7 : i) + T.padOct), tonos: [nota(r), nota(r + 2), nota(r + 4), nota(r + 7)].map((n) => n + T.arpOct), bajo: nota(baja(r)) - 12 };
    });
    const rnd = semilla(T.semilla), mitad = Math.floor(T.pasos / 2), CT = [0, 2, 4, 7];
    const aCT = (d) => CT.reduce((a, b) => (Math.abs(b - d) < Math.abs(a - d) ? b : a));
    const pos = [rnd() < 0.3 ? 2 : 0], cand = [];
    for (let s = 1; s < T.pasos; s++) if (s !== pos[0]) cand.push(s);
    while (pos.length < T.melNotas && cand.length) pos.push(cand.splice(Math.floor(rnd() * cand.length), 1)[0]);
    pos.sort((a, b) => a - b);
    /* contorno del motivo: sube, baja o hace un arco; los tiempos fuertes caen en notas del acorde y nunca se repite la misma nota seguida */
    const n = pos.length, cl = (x) => Math.max(0, Math.min(8, x));
    const ini = T.contorno === 'baja' ? [7, 5][Math.floor(rnd() * 2)] : T.contorno === 'sube' ? [0, 2][Math.floor(rnd() * 2)] : [2, 4][Math.floor(rnd() * 2)];
    const fin0 = T.contorno === 'baja' ? [2, 0][Math.floor(rnd() * 2)] : T.contorno === 'sube' ? [7, 4][Math.floor(rnd() * 2)] : [4, 2][Math.floor(rnd() * 2)];
    const pico = T.contorno === 'onda' ? [6, 7][Math.floor(rnd() * 2)] : 0;
    const ds = pos.map((s, k) => {
      const u = n > 1 ? k / (n - 1) : 0;
      let v = T.contorno === 'onda' ? ini + (pico - ini) * Math.sin(Math.PI * u) + (fin0 - ini) * u : ini + (fin0 - ini) * u;
      v = Math.round(v) + (k && k < n - 1 ? Math.floor(rnd() * 3) - 1 : 0);
      v = cl(v);
      return (T.snap && (s === 0 || s === mitad)) ? aCT(v) : v;
    });
    const sentido = T.contorno === 'baja' ? -1 : 1;
    for (let k = 1; k < n; k++) {
      if (ds[k] !== ds[k - 1]) continue;
      if (T.snap && (pos[k] === 0 || pos[k] === mitad)) { ds[k] = CT[(CT.indexOf(ds[k]) + sentido + CT.length) % CT.length]; }
      else { ds[k] = cl(ds[k] + sentido); if (ds[k] === ds[k - 1]) ds[k] = cl(ds[k] - 2 * sentido); }
    }
    const fin = n - 1, ds2 = ds.slice();
    if (T.snap) { ds2[fin] = CT[(CT.indexOf(aCT(ds[fin])) + 1) % CT.length]; if (ds2[fin] === ds2[fin - 1]) ds2[fin] = CT[(CT.indexOf(ds2[fin]) + 1) % CT.length]; }
    else { ds2[fin] = cl(ds[fin] + (rnd() < 0.5 ? 2 : -2)); if (ds2[fin] === ds[fin]) ds2[fin] = cl(ds[fin] + 1); }
    T.melodia = [ds, ds2].map((dd) => T.acordes.map((A) => pos.map((s, k) => ({ s, n: nota(baja(A.r) + dd[k]) + T.melOct, d: (k + 1 < pos.length ? pos[k + 1] : T.pasos) - s }))));
    return T;
  }

  let mus = null, rev = null, S = null, tema = null, temaId = null, temaPedido = null, reloj = null, prox = 0, paso = 0;
  const btnMus = () => document.getElementById('btn-musica');
  const musOn = () => !btnMus() || btnMus().getAttribute('aria-pressed') !== 'false';

  function busMusica() {
    if (mus) return;
    mus = ctx.createGain(); mus.gain.value = 0.85; mus.connect(master);
    // reverberación sencilla (ruido que decae) para que los instrumentos suenen en un cuarto
    const dur = 3.4, n = Math.floor(ctx.sampleRate * dur), b = ctx.createBuffer(2, n, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const dd = b.getChannelData(c); for (let i = 0; i < n; i++) dd[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.6); }
    rev = ctx.createConvolver(); rev.buffer = b;
    const out = ctx.createGain(); out.gain.value = 0.6; rev.connect(out); out.connect(mus);
  }
  /* Salida propia de cada tema: al cambiar de escena el anterior se desvanece y el nuevo entra, sin cortes. */
  function nuevaSalida(T) {
    const entrada = ctx.createGain(); entrada.gain.value = 0.0001;
    const seco = ctx.createGain(), mojado = ctx.createGain(); mojado.gain.value = T.reverb;
    entrada.connect(seco); seco.connect(mus); entrada.connect(mojado); mojado.connect(rev);
    return { in: entrada, nodos: [entrada, seco, mojado] };
  }
  const osc = (tipo, f, t, dur) => { const o = ctx.createOscillator(); o.type = tipo; o.frequency.value = f; o.start(t); o.stop(t + dur + 0.05); return o; };

  function piano(t, f, vol, dur = 3.2) {
    const g = ctx.createGain(), lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.setValueAtTime(1600 + Math.min(vol, 0.08) * 25000, t); lp.frequency.exponentialRampToValueAtTime(650, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    [[1, 'sine', 1], [2, 'triangle', 0.32], [3, 'sine', 0.08], [4.01, 'sine', 0.03]].forEach(([k, tipo, a]) => {
      const o = osc(tipo, f * k, t, dur), og = ctx.createGain(); og.gain.value = a; o.connect(og); og.connect(lp);
    });
    lp.connect(g); g.connect(S.in);
  }
  /* violonchelo: sonido sostenido con vibrato, para las melodías tristes o graves */
  function solo(t, f, vol, dur) {
    const lp = ctx.createBiquadFilter(), g = ctx.createGain(), vib = osc('sine', 5.2, t, dur), vg = ctx.createGain();
    vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(7, t + 0.7); vib.connect(vg);
    lp.type = 'lowpass'; lp.Q.value = 0.7; lp.frequency.setValueAtTime(500, t); lp.frequency.linearRampToValueAtTime(1500, t + 0.5); lp.frequency.linearRampToValueAtTime(600, t + dur);
    const pico = vol * 0.55;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(pico, t + 0.35); g.gain.setValueAtTime(pico, t + Math.max(0.4, dur - 0.9)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    [0, 7].forEach((det) => { const o = osc('sawtooth', f, t, dur), og = ctx.createGain(); o.detune.value = det; og.gain.value = 0.5; vg.connect(o.detune); o.connect(og); og.connect(lp); });
    lp.connect(g); g.connect(S.in);
  }
  /* cuerdas sostenidas (con temblor opcional para la tensión) */
  function cuerdas(t, notas, vol, dur, trem) {
    const lp = ctx.createBiquadFilter(), am = ctx.createGain(), g = ctx.createGain(), ataque = Math.min(2.4, dur * 0.4);
    lp.type = 'lowpass'; lp.frequency.value = trem ? 1000 : 760; lp.Q.value = 0.4; am.gain.value = trem ? 0.62 : 1;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + ataque);
    g.gain.setValueAtTime(vol, t + Math.max(ataque + 0.1, dur - 2.4)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    notas.forEach((n) => [-6, 6].forEach((det) => { const o = osc('sawtooth', m2f(n), t, dur), og = ctx.createGain(); o.detune.value = det; og.gain.value = 1 / (notas.length * 2); o.connect(og); og.connect(lp); }));
    if (trem) { const lfo = osc('sine', trem, t, dur), lg = ctx.createGain(); lg.gain.value = 0.38; lfo.connect(lg); lg.connect(am.gain); }
    lp.connect(am); am.connect(g); g.connect(S.in);
  }
  function campana(t, f, vol, dur = 4) {
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    [[1, 1], [2.76, 0.22], [5.4, 0.07]].forEach(([k, a]) => { const o = osc('sine', f * k, t, dur), og = ctx.createGain(); og.gain.value = a; o.connect(og); og.connect(g); });
    g.connect(S.in);
  }
  /* golpe grave (latido) con un toque más agudo para que se oiga también en altavoces pequeños */
  function bombo(t, f, vol) {
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.34);
    const o = osc('sine', f * 1.6, t, 0.36); o.frequency.exponentialRampToValueAtTime(f, t + 0.12); o.connect(g);
    const o2 = osc('triangle', f * 2, t, 0.36), g2 = ctx.createGain(); g2.gain.value = 0.45; o2.connect(g2); g2.connect(g);
    g.connect(S.in);
  }
  function pluck(t, f, vol) {
    const g = ctx.createGain(), lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 720;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    const o = osc('triangle', f, t, 0.25); o.connect(lp); lp.connect(g); g.connect(S.in);
  }
  function drone(t, f, vol, dur, roce) {
    const g = ctx.createGain(), lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 240;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.35); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    [[f, 'sine', 1], [f * 1.5, 'triangle', 0.3], ...(roce ? [[f * 1.0595, 'sine', 0.18]] : [])].forEach(([fr, tipo, a]) => { const o = osc(tipo, fr, t, dur), og = ctx.createGain(); og.gain.value = a; o.connect(og); og.connect(lp); });
    lp.connect(g); g.connect(S.in);
  }
  function aire(t, dur, vol) {
    const n = ruido(dur + 0.2, 'brown'), f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = 'bandpass'; f.Q.value = 0.6; f.frequency.setValueAtTime(380, t); f.frequency.linearRampToValueAtTime(900, t + dur * 0.6); f.frequency.linearRampToValueAtTime(450, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.5); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    n.connect(f); f.connect(g); g.connect(S.in); n.start(t); n.stop(t + dur + 0.2);
  }

  const durPaso = () => (60 / tema.bpm / 2) * Math.max(0.78, 1 - Math.floor(paso / (tema.pasos * tema.prog.length)) * tema.acelera);
  function darPaso(t) {
    const T = tema; if (!T) return;
    const n = T.pasos, i = paso % n, ci = Math.floor(paso / n) % T.prog.length, ciclo = Math.floor(paso / (n * T.prog.length));
    const A = T.acordes[ci], st = durPaso(), mitad = Math.floor(n / 2), hum = () => 1 + (Math.random() - 0.5) * 0.16;
    if (i === 0) {
      if (T.pad) cuerdas(t, A.pad, T.pad, st * n + 1.8, T.trem);
      if (T.bajo) piano(t, m2f(A.bajo), T.bajo, 4.5);
      if (T.drone) drone(t, m2f(A.bajo - 12), T.drone, st * n + 1.5, T.color.includes('x'));
      if (T.aire && ci % 2 === 0) aire(t, st * n * 1.4, T.aire);
    }
    /* acompañamiento */
    if (T.arp === 'bloque') {
      if (i === 0) A.tonos.slice(0, 3).forEach((nt, j) => piano(t + j * 0.05, m2f(nt), T.arpVol * (1 - j * 0.12), 4.2));
      else if (i === mitad) piano(t, m2f(A.tonos[3]), T.arpVol * 0.6, 3.4);
    } else if (T.arp) {
      const pat = ARP[T.arp], k = pat[i % pat.length];
      if (k >= 0) piano(t + Math.random() * 0.015, m2f(A.tonos[k]), T.arpVol * (i === 0 ? 1.15 : i % 2 ? 0.7 : 0.9) * hum(), 2.6);
    }
    /* melodía: suena, varía, y cada cierto ciclo calla para respirar */
    const descanso = T.ciclo > 0 && ciclo % T.ciclo === T.ciclo - 1;
    if (T.mel && !descanso) {
      const m = T.melodia[ciclo % 2][ci].find((x) => x.s === i);
      if (m) {
        const v = T.melVol * hum(), f = m2f(m.n);
        if (T.melInst === 'solo') solo(t, f, v, Math.max(1.6, m.d * st * 1.15));
        else if (T.melInst === 'campana') campana(t, f, v, 3.6);
        else piano(t, f, v, 3.2 + m.d * st * 0.5);
      }
    }
    /* ritmo */
    if (T.pulso === 'latido' && i === 0) { bombo(t, m2f(A.bajo), T.pulsoVol); bombo(t + st * 1.4, m2f(A.bajo), T.pulsoVol * 0.7); }
    else if (T.pulso === 'latido2' && (i === 0 || i === mitad)) { bombo(t, m2f(A.bajo), T.pulsoVol); bombo(t + st * 0.9, m2f(A.bajo), T.pulsoVol * 0.7); }
    else if (T.pulso === 'ostinato') {
      pluck(t, m2f(A.bajo + 12), T.pulsoVol * OST[i % OST.length]);
      if (i === 0) bombo(t, m2f(A.bajo), T.pulsoVol * 1.1); else if (i === mitad) bombo(t, m2f(A.bajo), T.pulsoVol * 0.7);
    }
    if (T.campana && i === mitad && ci % 2 === 1) campana(t, m2f(A.tonos[2] + 12), T.campana, 4);
  }
  function relojMusica() {
    if (!ctx || !tema) return;
    if (prox < ctx.currentTime - 0.5) prox = ctx.currentTime + 0.2; // si la pestaña estuvo dormida, no se acumulan notas
    let guardia = 0;
    while (prox < ctx.currentTime + 1.8 && guardia++ < 64) { darPaso(prox); prox += durPaso(); paso++; }
  }
  function atenuarSalida(s) {
    if (!s) return;
    s.in.gain.cancelScheduledValues(ctx.currentTime); s.in.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.45);
    setTimeout(() => s.nodos.forEach((x) => { try { x.disconnect(); } catch (e) {} }), 6000);
  }
  function arrancarTema(id) {
    if (!init() || !musOn() || !on()) return;
    busMusica();
    if (!TEMAS[id]) return;
    if (temaId === id && reloj) return;
    const T = COMPILADOS[id] || (COMPILADOS[id] = compilar(TEMAS[id]));
    atenuarSalida(S);
    S = nuevaSalida(T); S.in.gain.setTargetAtTime(1, ctx.currentTime + 0.5, 0.7);
    tema = T; temaId = id; paso = 0; prox = ctx.currentTime + 0.7;
    if (!reloj) reloj = setInterval(relojMusica, 300);
    relojMusica();
  }
  function pararMusica() { if (reloj) { clearInterval(reloj); reloj = null; } if (ctx) atenuarSalida(S); S = null; temaId = null; }
  SND.musica = (escenaId) => { temaPedido = TEMA_DE[escenaId] || temaPedido; if (temaPedido) arrancarTema(temaPedido); };
  SND.musicaRefrescar = () => { if (on() && musOn()) { if (temaPedido) arrancarTema(temaPedido); } else pararMusica(); };
  /* golpe dramático: la música se aparta un instante y entra un impacto grave (llega la foto, se descubre algo) */
  SND.golpe = () => {
    if (!ctx || !S || !tema) return;
    const t = ctx.currentTime;
    S.in.gain.cancelScheduledValues(t); S.in.gain.setTargetAtTime(0.3, t, 0.08); S.in.gain.setTargetAtTime(1, t + 2.2, 0.9);
    tono({ t, f0: 64, f1: 38, dur: 1.5, vol: 0.09, a: 0.02 });
    soplo({ t, dur: 1.6, f0: 900, f1: 200, q: 0.7, vol: 0.03, a: 0.05, tipo: 'lowpass' });
  };
  const suspensoBase = SND.suspenso;
  SND.suspenso = (...a) => { suspensoBase(...a); SND.golpe(); };
  document.addEventListener('pointerdown', () => setTimeout(SND.musicaRefrescar, 30), { once: true });
  document.addEventListener('DOMContentLoaded', () => {
    const b = btnMus();
    if (b) b.addEventListener('click', () => {
      const act = b.getAttribute('aria-pressed') === 'false';
      b.setAttribute('aria-pressed', String(act));
      b.setAttribute('aria-label', act ? 'Desactivar la música' : 'Activar la música');
      b.title = act ? 'Música activada' : 'Música desactivada';
      const sp = b.querySelector('span'); if (sp) sp.textContent = act ? 'Música' : 'Sin música';
      SND.musicaRefrescar();
    });
    const bs = document.getElementById('btn-sonido');
    if (bs) bs.addEventListener('click', () => setTimeout(SND.musicaRefrescar, 10));
  });
  window.SND = SND;
  document.addEventListener('pointerdown', () => SND.ambiente(true), { once: true });
  document.addEventListener('DOMContentLoaded', () => btn() && btn().addEventListener('click', () => setTimeout(() => SND.ambiente(on()), 0)));
})();
