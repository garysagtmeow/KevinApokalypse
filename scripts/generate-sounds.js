const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 22050;
const OUTPUT_DIR = path.join(__dirname, '../assets/audio/sfx');
const MUSIC_OUTPUT_DIR = path.join(__dirname, '../assets/audio/music');

function writeWav(filePath, samples) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (SAMPLE_RATE * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let index = 0; index < samples.length; index += 1) {
    const sample = Math.max(-1, Math.min(1, samples[index]));
    buffer.writeInt16LE(Math.floor(sample * 32767), 44 + index * 2);
  }

  fs.writeFileSync(filePath, buffer);
}

function silence(durationSeconds) {
  return new Array(Math.floor(SAMPLE_RATE * durationSeconds)).fill(0);
}

function tone(frequency, durationSeconds, volume = 0.4) {
  const sampleCount = Math.floor(SAMPLE_RATE * durationSeconds);
  const samples = [];

  for (let index = 0; index < sampleCount; index += 1) {
    const time = index / SAMPLE_RATE;
    const attack = Math.min(1, index / (SAMPLE_RATE * 0.01));
    const release = Math.max(0, 1 - (index - sampleCount * 0.65) / (sampleCount * 0.35));
    const envelope = attack * release;
    samples.push(Math.sin(2 * Math.PI * frequency * time) * volume * envelope);
  }

  return samples;
}

function concat(...parts) {
  return parts.flat();
}

function mixTracks(...tracks) {
  const maxLength = Math.max(...tracks.map((track) => track.length));
  const mixed = new Array(maxLength).fill(0);

  for (const track of tracks) {
    for (let index = 0; index < track.length; index += 1) {
      mixed[index] += track[index] ?? 0;
    }
  }

  const peak = mixed.reduce((currentPeak, sample) => Math.max(currentPeak, Math.abs(sample)), 0);
  if (peak <= 0.95) {
    return mixed;
  }

  const scale = 0.9 / peak;
  return mixed.map((sample) => sample * scale);
}

function padTrack(track, totalLength) {
  if (track.length >= totalLength) {
    return track.slice(0, totalLength);
  }

  return track.concat(new Array(totalLength - track.length).fill(0));
}

function appendAt(track, offsetSeconds, part) {
  const offset = Math.floor(SAMPLE_RATE * offsetSeconds);
  const totalLength = Math.max(track.length, offset + part.length);
  const result = new Array(totalLength).fill(0);

  for (let index = 0; index < track.length; index += 1) {
    result[index] = track[index];
  }

  for (let index = 0; index < part.length; index += 1) {
    result[offset + index] += part[index];
  }

  return result;
}

function createCheesePlingSound() {
  const durationSeconds = 0.5;
  const sampleCount = Math.floor(SAMPLE_RATE * durationSeconds);
  const samples = [];

  for (let index = 0; index < sampleCount; index += 1) {
    const time = index / SAMPLE_RATE;
    const attack = Math.min(1, index / (SAMPLE_RATE * 0.004));
    const decay = Math.exp(-time * 7.5);
    const envelope = attack * decay;
    const bell =
      Math.sin(2 * Math.PI * 1318.5 * time) * 0.55 +
      Math.sin(2 * Math.PI * 1760 * time) * 0.28 +
      Math.sin(2 * Math.PI * 2637 * time) * 0.12;
    samples.push(bell * envelope * 0.62);
  }

  return samples;
}

function createCollectSound() {
  const durationSeconds = 0.16;
  const sampleCount = Math.floor(SAMPLE_RATE * durationSeconds);
  const samples = [];

  for (let index = 0; index < sampleCount; index += 1) {
    const time = index / SAMPLE_RATE;
    const frequency = 420 - (time / durationSeconds) * 280;
    const envelope = 1 - time / durationSeconds;
    samples.push(Math.sin(2 * Math.PI * frequency * time) * 0.55 * envelope);
  }

  return samples;
}

function createKevinDropSound() {
  const durationSeconds = 0.48;
  const sampleCount = Math.floor(SAMPLE_RATE * durationSeconds);
  const samples = [];

  for (let index = 0; index < sampleCount; index += 1) {
    const time = index / SAMPLE_RATE;
    const progress = time / durationSeconds;
    const attack = Math.min(1, progress * 10);
    const release = Math.max(0, 1 - Math.pow(progress, 0.55));
    const envelope = attack * release;
    const frequency = 155 - progress * 95 + Math.sin(time * 42) * 14;
    const tonePart = Math.sin(2 * Math.PI * frequency * time);
    const wobble = Math.sin(2 * Math.PI * (frequency * 0.5) * time) * 0.25;
    const noisePart = (Math.random() * 2 - 1) * 0.4;
    samples.push((tonePart * 0.5 + wobble + noisePart * 0.35) * envelope * 0.7);
  }

  return samples;
}

function createAlarmSound() {
  const beep = tone(920, 0.12, 0.35);
  const gap = silence(0.08);
  return concat(beep, gap, beep, gap, beep, gap, beep, gap);
}

function createLevelCompleteSound() {
  return concat(
    tone(523, 0.1, 0.35),
    tone(659, 0.1, 0.35),
    tone(784, 0.1, 0.35),
    tone(1047, 0.24, 0.42),
  );
}

function createGameOverSound() {
  return concat(
    tone(392, 0.16, 0.4),
    tone(330, 0.16, 0.4),
    tone(262, 0.16, 0.4),
    tone(196, 0.34, 0.45),
  );
}

function bouncyTone(frequency, durationSeconds, volume = 0.15) {
  const sampleCount = Math.floor(SAMPLE_RATE * durationSeconds);
  const samples = [];

  for (let index = 0; index < sampleCount; index += 1) {
    const time = index / SAMPLE_RATE;
    const attack = Math.min(1, index / (SAMPLE_RATE * 0.012));
    const release = Math.max(0, 1 - (index - sampleCount * 0.4) / (sampleCount * 0.6));
    const envelope = attack * release;
    const sine = Math.sin(2 * Math.PI * frequency * time);
    const sparkle = Math.sin(2 * Math.PI * frequency * 2 * time) * 0.07;
    samples.push((sine + sparkle) * volume * envelope);
  }

  return samples;
}

function gentleBass(frequency, durationSeconds, volume = 0.09) {
  const sampleCount = Math.floor(SAMPLE_RATE * durationSeconds);
  const samples = [];

  for (let index = 0; index < sampleCount; index += 1) {
    const time = index / SAMPLE_RATE;
    const attack = Math.min(1, index / (SAMPLE_RATE * 0.02));
    const release = Math.max(0, 1 - (index - sampleCount * 0.6) / (sampleCount * 0.4));
    const envelope = attack * release;
    samples.push(Math.sin(2 * Math.PI * frequency * time) * volume * envelope);
  }

  return samples;
}

function softTap(durationSeconds, volume = 0.045) {
  const sampleCount = Math.floor(SAMPLE_RATE * durationSeconds);
  const samples = [];

  for (let index = 0; index < sampleCount; index += 1) {
    const time = index / SAMPLE_RATE;
    const envelope = Math.max(0, 1 - time / durationSeconds);
    const tick = Math.sin(2 * Math.PI * 240 * time) * 0.6;
    samples.push(tick * volume * envelope);
  }

  return samples;
}

function buildNoteTrack(pattern, notes, beat, createSample) {
  let track = [];
  let offset = 0;

  for (const [noteName, beats] of pattern) {
    const duration = beat * beats;
    track = appendAt(track, offset, createSample(notes[noteName], duration));
    offset += duration;
  }

  return { track, duration: offset };
}

function cheerfulTone(frequency, durationSeconds, volume = 0.17) {
  const sampleCount = Math.floor(SAMPLE_RATE * durationSeconds);
  const samples = [];

  for (let index = 0; index < sampleCount; index += 1) {
    const time = index / SAMPLE_RATE;
    const attack = Math.min(1, index / (SAMPLE_RATE * 0.008));
    const release = Math.max(0, 1 - (index - sampleCount * 0.35) / (sampleCount * 0.65));
    const envelope = attack * release;
    const fundamental = Math.sin(2 * Math.PI * frequency * time);
    const shimmer = Math.sin(2 * Math.PI * frequency * 2 * time) * 0.12;
    const sparkle = Math.sin(2 * Math.PI * frequency * 3 * time) * 0.05;
    samples.push((fundamental + shimmer + sparkle) * volume * envelope);
  }

  return samples;
}

function createBonusBackgroundMusic() {
  const notes = {
    C3: 131,
    F3: 175,
    G3: 196,
    A3: 220,
    C4: 262,
    D4: 294,
    E4: 330,
    F4: 349,
    G4: 392,
    A4: 440,
    B4: 494,
    C5: 523,
    D5: 587,
    E5: 659,
    F5: 698,
    G5: 784,
    A5: 880,
  };

  const beat = 30 / 128;
  const melodyPhrases = [
    [
      ['C5', 1], ['E5', 1], ['G5', 1], ['C5', 1],
      ['D5', 1], ['E5', 1], ['G5', 1.5], ['E5', 0.5],
      ['C5', 1], ['G4', 1], ['E4', 1], ['G4', 1],
      ['A4', 1], ['G4', 1], ['E4', 2],
    ],
    [
      ['E5', 1], ['G5', 1], ['A5', 1], ['G5', 1],
      ['E5', 1], ['C5', 1], ['D5', 1], ['E5', 1.5],
      ['G5', 1], ['E5', 1], ['C5', 1], ['D5', 1],
      ['E5', 1], ['G5', 1], ['C5', 2],
    ],
    [
      ['G5', 1], ['E5', 1], ['C5', 1], ['E5', 1],
      ['G5', 1], ['A5', 1], ['G5', 1], ['E5', 1],
      ['F5', 1], ['E5', 1], ['D5', 1], ['C5', 1],
      ['D5', 1], ['E5', 1], ['G5', 2],
    ],
    [
      ['C5', 1], ['G4', 1], ['E4', 1], ['G4', 1],
      ['C5', 1], ['E5', 1], ['G5', 1], ['E5', 1],
      ['D5', 1], ['C5', 1], ['A4', 1], ['G4', 1],
      ['E4', 1], ['G4', 1], ['C5', 3],
    ],
  ];

  const bassPhrases = [
    [
      ['C3', 2], ['G3', 2], ['C3', 2], ['G3', 2],
      ['C3', 2], ['G3', 2], ['C3', 2], ['G3', 2],
    ],
    [
      ['C3', 2], ['G3', 2], ['A3', 2], ['G3', 2],
      ['C3', 2], ['G3', 2], ['C3', 2], ['G3', 2],
    ],
    [
      ['F3', 2], ['G3', 2], ['C3', 2], ['G3', 2],
      ['F3', 2], ['G3', 2], ['C3', 2], ['G3', 2],
    ],
    [
      ['C3', 2], ['C3', 2], ['G3', 2], ['C3', 2],
      ['G3', 2], ['C3', 2], ['G3', 4],
    ],
  ];

  const allMelodyPhrases = [...melodyPhrases, ...melodyPhrases];
  const allBassPhrases = [...bassPhrases, ...bassPhrases];

  let melodyTrack = [];
  let bassTrack = [];
  let sparkleTrack = [];
  let melodyOffset = 0;
  let bassOffset = 0;

  for (let phraseIndex = 0; phraseIndex < allMelodyPhrases.length; phraseIndex += 1) {
    const melodyPhrase = buildNoteTrack(
      allMelodyPhrases[phraseIndex],
      notes,
      beat,
      (frequency, duration) => cheerfulTone(frequency, duration * 0.92, 0.17),
    );
    melodyTrack = appendAt(melodyTrack, melodyOffset, melodyPhrase.track);
    melodyOffset += melodyPhrase.duration;

    const bassPhrase = buildNoteTrack(
      allBassPhrases[phraseIndex],
      notes,
      beat,
      (frequency, duration) => gentleBass(frequency, duration * 0.95, 0.08),
    );
    bassTrack = appendAt(bassTrack, bassOffset, bassPhrase.track);
    bassOffset += bassPhrase.duration;
  }

  const loopDuration = melodyOffset;
  const barLength = beat * 4;

  let percussionTrack = [];
  for (let time = 0; time < loopDuration; time += barLength) {
    percussionTrack = appendAt(percussionTrack, time, softTap(0.035, 0.055));
    percussionTrack = appendAt(
      percussionTrack,
      time + beat * 2,
      softTap(0.03, 0.038),
    );
  }

  for (let time = 0; time < loopDuration; time += beat * 8) {
    sparkleTrack = appendAt(
      sparkleTrack,
      time + beat * 6,
      cheerfulTone(1047, beat * 0.8, 0.08),
    );
  }

  const totalLength = Math.floor(SAMPLE_RATE * loopDuration);
  return mixTracks(
    padTrack(melodyTrack, totalLength),
    padTrack(bassTrack, totalLength),
    padTrack(percussionTrack, totalLength),
    padTrack(sparkleTrack, totalLength),
  );
}

function createBackgroundMusic() {
  const notes = {
    C3: 131,
    F3: 175,
    G3: 196,
    A3: 220,
    C4: 262,
    D4: 294,
    E4: 330,
    F4: 349,
    G4: 392,
    A4: 440,
    B4: 494,
    C5: 523,
  };

  const beat = 0.26;
  const melodyPhrases = [
    [
      ['C4', 1], ['E4', 1], ['G4', 1], ['E4', 1],
      ['G4', 1], ['A4', 1], ['G4', 1], ['E4', 1.5],
      ['C4', 1], ['E4', 1], ['G4', 1], ['C5', 1.5],
      ['G4', 1], ['E4', 1], ['C4', 2],
    ],
    [
      ['E4', 1], ['G4', 1], ['A4', 1], ['B4', 1],
      ['C5', 1], ['B4', 1], ['A4', 1], ['G4', 1.5],
      ['A4', 1], ['G4', 1], ['E4', 1], ['C4', 1],
      ['D4', 1], ['E4', 1], ['G4', 2],
    ],
    [
      ['G4', 1], ['F4', 1], ['E4', 1], ['D4', 1],
      ['C4', 1], ['D4', 1], ['E4', 1], ['G4', 1.5],
      ['A4', 1], ['G4', 1], ['F4', 1], ['E4', 1],
      ['D4', 1], ['C4', 1], ['E4', 2],
    ],
    [
      ['G4', 1], ['E4', 1], ['C4', 1], ['E4', 1],
      ['G4', 1], ['A4', 1], ['G4', 1], ['E4', 1],
      ['C4', 1], ['E4', 1], ['G4', 1], ['C5', 1],
      ['B4', 1], ['G4', 1], ['C4', 2.5],
    ],
  ];

  const bassPhrases = [
    [
      ['C3', 2], ['G3', 2], ['C3', 2], ['G3', 2],
      ['C3', 2], ['G3', 2], ['C3', 2], ['G3', 2],
    ],
    [
      ['C3', 2], ['G3', 2], ['A3', 2], ['G3', 2],
      ['C3', 2], ['G3', 2], ['C3', 2], ['G3', 2],
    ],
    [
      ['F3', 2], ['G3', 2], ['C3', 2], ['G3', 2],
      ['F3', 2], ['G3', 2], ['C3', 2], ['G3', 2],
    ],
    [
      ['C3', 2], ['C3', 2], ['G3', 2], ['C3', 2],
      ['C3', 2], ['G3', 2], ['C3', 4],
    ],
  ];

  let melodyTrack = [];
  let bassTrack = [];
  let melodyOffset = 0;
  let bassOffset = 0;

  for (let phraseIndex = 0; phraseIndex < melodyPhrases.length; phraseIndex += 1) {
    const melodyPhrase = buildNoteTrack(
      melodyPhrases[phraseIndex],
      notes,
      beat,
      (frequency, duration) => bouncyTone(frequency, duration * 0.88, 0.15),
    );
    melodyTrack = appendAt(melodyTrack, melodyOffset, melodyPhrase.track);
    melodyOffset += melodyPhrase.duration;

    const bassPhrase = buildNoteTrack(
      bassPhrases[phraseIndex],
      notes,
      beat,
      (frequency, duration) => gentleBass(frequency, duration * 0.95, 0.09),
    );
    bassTrack = appendAt(bassTrack, bassOffset, bassPhrase.track);
    bassOffset += bassPhrase.duration;
  }

  let percussionTrack = [];
  const loopDuration = melodyOffset;
  const barLength = beat * 4;

  for (let time = 0; time < loopDuration; time += barLength) {
    const phraseStart = time % (beat * 16) < barLength;
    percussionTrack = appendAt(
      percussionTrack,
      time,
      softTap(0.04, phraseStart ? 0.05 : 0.035),
    );
  }

  const totalLength = Math.floor(SAMPLE_RATE * loopDuration);
  return mixTracks(
    padTrack(melodyTrack, totalLength),
    padTrack(bassTrack, totalLength),
    padTrack(percussionTrack, totalLength),
  );
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.mkdirSync(MUSIC_OUTPUT_DIR, { recursive: true });

writeWav(path.join(OUTPUT_DIR, 'collect.wav'), createCollectSound());
writeWav(path.join(OUTPUT_DIR, 'cheese-pling.wav'), createCheesePlingSound());
writeWav(path.join(OUTPUT_DIR, 'kevin-drop.wav'), createKevinDropSound());
writeWav(path.join(OUTPUT_DIR, 'alarm.wav'), createAlarmSound());
writeWav(path.join(OUTPUT_DIR, 'level-complete.wav'), createLevelCompleteSound());
writeWav(path.join(OUTPUT_DIR, 'game-over.wav'), createGameOverSound());
writeWav(path.join(MUSIC_OUTPUT_DIR, 'background-loop.wav'), createBackgroundMusic());
writeWav(path.join(MUSIC_OUTPUT_DIR, 'bonus-loop.wav'), createBonusBackgroundMusic());

console.log('Generated game sounds in assets/audio/sfx');
console.log('Generated background music in assets/audio/music');
