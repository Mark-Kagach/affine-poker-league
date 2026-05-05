// Generates a neon-drive 80s synthwave / Street Fighter-flavored techno
// loop as 16-bit mono PCM WAV.
// Three voices:
//   - Lead   (square wave): melodic, A minor, builds across 24 bars
//   - Bass   (triangle wave): walking, low-end groove
//   - Kick   (triangle wave, pitched-down sweep): 4-on-the-floor pulse
// Run: node scripts/gen-jingle.mjs
// Output: public/jingle.wav
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "..", "public", "jingle.wav");

const SAMPLE_RATE = 16000;
const BPM = 108;
const BEATS_PER_BAR = 4;
const BAR_SEC = (60 / BPM) * BEATS_PER_BAR;
const NUM_BARS = 24;
const TOTAL_SAMPLES = Math.floor(SAMPLE_RATE * BAR_SEC * NUM_BARS);

const SEMI = { C: -9, "C#": -8, D: -7, "D#": -6, E: -5, F: -4, "F#": -3, G: -2, "G#": -1, A: 0, "A#": 1, B: 2 };
function hz(note) {
  if (note === "-") return 0;
  const m = note.match(/^([A-G]#?)(\d)$/);
  if (!m) throw new Error("bad note " + note);
  const [, n, oct] = m;
  return 440 * 2 ** ((SEMI[n] + (parseInt(oct) - 4) * 12) / 12);
}

// 8 eighth notes per bar
const LEAD = [
  // 1-2: intro — pulse only, no lead
  ["-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-"],
  // 3-4: lead enters
  ["A4", "-", "-", "C5", "E5", "-", "-", "-"],
  ["G5", "-", "F5", "-", "E5", "-", "C5", "-"],
  // 5-8: A theme (Am - F - C - G)
  ["A4", "-", "C5", "-", "E5", "-", "A5", "-"],
  ["F4", "-", "A4", "-", "C5", "-", "F5", "-"],
  ["C5", "-", "E5", "-", "G5", "-", "C6", "-"],
  ["G4", "-", "B4", "-", "D5", "-", "G5", "-"],
  // 9-12: B theme (climbing arpeggios — Am C F G)
  ["A4", "C5", "E5", "A5", "-", "E5", "C5", "-"],
  ["C5", "E5", "G5", "C6", "-", "G5", "E5", "-"],
  ["F4", "A4", "C5", "F5", "-", "C5", "A4", "-"],
  ["G4", "B4", "D5", "G5", "-", "D5", "B4", "-"],
  // 13-16: A theme (return)
  ["A4", "-", "C5", "-", "E5", "-", "A5", "-"],
  ["F4", "-", "A4", "-", "C5", "-", "F5", "-"],
  ["C5", "-", "E5", "-", "G5", "-", "C6", "-"],
  ["G4", "-", "B4", "-", "D5", "-", "G5", "-"],
  // 17-20: bridge (Dm G Am F)
  ["D4", "-", "F4", "-", "A4", "-", "D5", "-"],
  ["G4", "-", "B4", "-", "D5", "-", "G5", "-"],
  ["A4", "-", "C5", "-", "E5", "-", "-", "-"],
  ["F4", "-", "A4", "-", "C5", "-", "-", "-"],
  // 21-24: final theme + resolution
  ["A4", "-", "C5", "-", "E5", "-", "A5", "-"],
  ["F4", "-", "A4", "-", "C5", "-", "F5", "-"],
  ["C5", "-", "E5", "-", "G5", "-", "C6", "-"],
  ["A4", "-", "-", "-", "-", "-", "-", "-"],
];

// 4 quarter notes per bar (walking bass)
const BASS = [
  ["A2", "E3", "A2", "C3"],
  ["A2", "E3", "A2", "C3"],
  ["A2", "E3", "A2", "C3"],
  ["A2", "E3", "A2", "C3"],
  ["A2", "E3", "A2", "C3"],
  ["F2", "C3", "F2", "A2"],
  ["C3", "G3", "C3", "E3"],
  ["G2", "D3", "G2", "B2"],
  ["A2", "E3", "A2", "C3"],
  ["C3", "G3", "C3", "E3"],
  ["F2", "C3", "F2", "A2"],
  ["G2", "D3", "G2", "B2"],
  ["A2", "E3", "A2", "C3"],
  ["F2", "C3", "F2", "A2"],
  ["C3", "G3", "C3", "E3"],
  ["G2", "D3", "G2", "B2"],
  ["D3", "A3", "D3", "F3"],
  ["G2", "D3", "G2", "B2"],
  ["A2", "E3", "A2", "C3"],
  ["F2", "C3", "F2", "A2"],
  ["A2", "E3", "A2", "C3"],
  ["F2", "C3", "F2", "A2"],
  ["C3", "G3", "C3", "E3"],
  ["A2", "-", "-", "-"],
];

// 4-on-the-floor kick (every quarter note across all 24 bars)
const KICK = Array(NUM_BARS).fill(["x", "x", "x", "x"]);

const samples = new Float32Array(TOTAL_SAMPLES);

function square(t, freq) {
  return ((t * freq) % 1) < 0.5 ? 1 : -1;
}
function triangle(t, freq) {
  const phase = (t * freq) % 1;
  return 4 * Math.abs(phase - 0.5) - 1;
}

function leadEnv(i, total) {
  const a = Math.min(i / 220, 1);
  const decay = Math.exp(-1.6 * (i / total));
  return a * decay;
}
function bassEnv(i, total) {
  const a = Math.min(i / 350, 1);
  // Long sustain so the bass keeps the room rumbling between notes
  const decay = 0.6 + 0.4 * Math.exp(-0.55 * (i / total));
  return a * decay;
}
function kickEnv(i, total) {
  const a = Math.min(i / 25, 1);
  const decay = Math.exp(-22 * (i / total));
  return a * decay;
}

function render(track, notesPerBar, gain, waveFn, envFn) {
  const noteDur = BAR_SEC / notesPerBar;
  const noteSamples = Math.floor(SAMPLE_RATE * noteDur);
  let cursor = 0;
  for (const bar of track) {
    for (const note of bar) {
      const f = hz(note);
      if (f > 0) {
        for (let i = 0; i < noteSamples && cursor + i < TOTAL_SAMPLES; i++) {
          const t = (cursor + i) / SAMPLE_RATE;
          samples[cursor + i] += waveFn(t, f) * envFn(i, noteSamples) * gain;
        }
      }
      cursor += noteSamples;
    }
  }
}

// 4-on-the-floor kick: low-frequency triangle with pitch sweep + sharp envelope
function renderKick(gain) {
  const noteDur = BAR_SEC / 4;
  const noteSamples = Math.floor(SAMPLE_RATE * noteDur);
  const kickLen = Math.min(noteSamples, Math.floor(SAMPLE_RATE * 0.18));
  let cursor = 0;
  for (let bar = 0; bar < NUM_BARS; bar++) {
    for (let beat = 0; beat < 4; beat++) {
      // Pitch sweep: 90Hz → 45Hz
      let phase = 0;
      let lastT = 0;
      for (let i = 0; i < kickLen && cursor + i < TOTAL_SAMPLES; i++) {
        const t = i / SAMPLE_RATE;
        const freq = 90 + (45 - 90) * (i / kickLen);
        // Integrate frequency to get phase (so pitch sweep is smooth)
        phase += (t - lastT) * freq;
        lastT = t;
        const wave = 4 * Math.abs((phase % 1) - 0.5) - 1;
        samples[cursor + i] += wave * kickEnv(i, kickLen) * gain;
      }
      cursor += noteSamples;
    }
  }
}

render(LEAD, 8, 0.18, square, leadEnv);
render(BASS, 4, 0.20, triangle, bassEnv);
renderKick(0.32);

// Cross-fade the loop point so the cycle is seamless
const FADE = Math.floor(SAMPLE_RATE * 0.12);
for (let i = 0; i < FADE; i++) {
  const k = 1 - i / FADE;
  samples[TOTAL_SAMPLES - FADE + i] *= k;
  samples[i] *= 1 - k * 0.5;
}

const dataBytes = TOTAL_SAMPLES * 2;
const buf = Buffer.alloc(44 + dataBytes);
buf.write("RIFF", 0);
buf.writeUInt32LE(36 + dataBytes, 4);
buf.write("WAVE", 8);
buf.write("fmt ", 12);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(1, 22);
buf.writeUInt32LE(SAMPLE_RATE, 24);
buf.writeUInt32LE(SAMPLE_RATE * 2, 28);
buf.writeUInt16LE(2, 32);
buf.writeUInt16LE(16, 34);
buf.write("data", 36);
buf.writeUInt32LE(dataBytes, 40);
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  const clamped = Math.max(-1, Math.min(1, samples[i]));
  buf.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, buf);
console.log(
  `Wrote ${OUT} (${(buf.length / 1024).toFixed(0)} KB, ${(BAR_SEC * NUM_BARS).toFixed(2)}s loop @ ${BPM} BPM, A minor)`
);
