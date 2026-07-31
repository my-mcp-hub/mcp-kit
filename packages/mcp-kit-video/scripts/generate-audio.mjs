import {mkdir, writeFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const sampleRate = 48_000;
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDir = join(root, 'public', 'audio');

const clamp = (value, min = -1, max = 1) => Math.max(min, Math.min(max, value));
const fract = value => value - Math.floor(value);
const noise = seed => fract(Math.sin(seed * 12.9898 + 78.233) * 43758.5453) * 2 - 1;
const smooth = value => value * value * (3 - 2 * value);
const envelope = (t, duration, attack, release) =>
  Math.min(1, smooth(Math.min(1, t / attack)), smooth(Math.min(1, (duration - t) / release)));

const writeWav = async (name, duration, sample) => {
  const frames = Math.floor(duration * sampleRate);
  const channels = 2;
  const bytesPerSample = 2;
  const dataSize = frames * channels * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * channels * bytesPerSample, 28);
  buffer.writeUInt16LE(channels * bytesPerSample, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < frames; i++) {
    const t = i / sampleRate;
    const [left, right = left] = sample(t, duration);
    buffer.writeInt16LE(Math.round(clamp(left) * 32767), 44 + i * 4);
    buffer.writeInt16LE(Math.round(clamp(right) * 32767), 46 + i * 4);
  }
  await writeFile(join(outputDir, name), buffer);
};

const hum = t => {
  const air = noise(Math.floor(t * sampleRate) * 0.11) * 0.004;
  const electric =
    Math.sin(2 * Math.PI * 60 * t) * 0.015 +
    Math.sin(2 * Math.PI * 120 * t + 0.2) * 0.006;
  return [electric + air, electric - air];
};

const impact = (t, duration, frequency, amount) => {
  const decay = Math.exp(-t * 4.8);
  const body = Math.sin(2 * Math.PI * (frequency - 18 * t) * t) * decay;
  const click = noise(Math.floor(t * sampleRate)) * Math.exp(-t * 35);
  return [(body * amount + click * 0.04) * envelope(t, duration, 0.004, 0.06)];
};

await mkdir(outputDir, {recursive: true});
await Promise.all([
  writeWav('crt-hum.wav', 48, hum),
  writeWav('power-on.wav', 1.095, (t, d) => {
    const rise = Math.min(1, t / 0.45);
    const tone = Math.sin(2 * Math.PI * (72 + 310 * rise * rise) * t);
    const fizz = noise(Math.floor(t * sampleRate) * 0.7) * Math.exp(-t * 5);
    return [(tone * 0.12 * rise + fizz * 0.035) * envelope(t, d, 0.01, 0.25)];
  }),
  writeWav('soft-impact.wav', 0.8, (t, d) => impact(t, d, 62, 0.19)),
  writeWav('final-impact.wav', 1.41, (t, d) => impact(t, d, 48, 0.24)),
  writeWav('key.wav', 0.09, (t, d) => {
    const body = Math.sin(2 * Math.PI * 860 * t) * Math.exp(-t * 45);
    const tick = noise(Math.floor(t * sampleRate)) * Math.exp(-t * 70);
    return [(body * 0.045 + tick * 0.035) * envelope(t, d, 0.001, 0.02)];
  }),
  writeWav('switch.wav', 0.24, (t, d) => {
    const tone =
      Math.sin(2 * Math.PI * 520 * t) * Math.exp(-t * 20) +
      Math.sin(2 * Math.PI * 760 * t) * Math.exp(-Math.max(0, t - 0.07) * 26) * (t > 0.07 ? 0.55 : 0);
    return [tone * 0.065 * envelope(t, d, 0.002, 0.03)];
  }),
  writeWav('whoosh.wav', 0.695, (t, d) => {
    const center = Math.sin(Math.PI * t / d);
    const wind = noise(Math.floor(t * sampleRate) * 0.23) * center;
    const tone = Math.sin(2 * Math.PI * (180 + 640 * t) * t) * center;
    return [(wind * 0.055 + tone * 0.025) * envelope(t, d, 0.02, 0.08)];
  }),
  writeWav('success-ding.wav', 1.07, (t, d) => {
    const decay = Math.exp(-t * 3.5);
    const tone =
      Math.sin(2 * Math.PI * 659.25 * t) +
      0.72 * Math.sin(2 * Math.PI * 987.77 * t) +
      0.4 * Math.sin(2 * Math.PI * 1318.51 * t);
    return [tone * decay * 0.07 * envelope(t, d, 0.004, 0.18)];
  }),
]);

console.log(`Generated original sound effects in ${outputDir}`);
