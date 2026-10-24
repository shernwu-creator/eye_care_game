export const GABOR_ANGLES = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165];
export const GABOR_FREQUENCIES = [3.2, 3.8, 4.4, 5.0, 5.6, 6.2];

export const PAIR_PATTERNS = [
  { angle: 0, frequency: 3.4 },
  { angle: 15, frequency: 4.8 },
  { angle: 35, frequency: 3.8 },
  { angle: 55, frequency: 5.6 },
  { angle: 75, frequency: 4.2 },
  { angle: 100, frequency: 5.2 },
  { angle: 125, frequency: 3.6 },
  { angle: 155, frequency: 4.6 },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const pick = (values) => values[Math.floor(Math.random() * values.length)];

export function patternKey(pattern) {
  return `${pattern.angle.toFixed(1)}|${pattern.frequency.toFixed(1)}`;
}

export function shuffle(values) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const nextIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[nextIndex]] = [result[nextIndex], result[index]];
  }
  return result;
}

export function createTapRound() {
  const target = {
    angle: pick(GABOR_ANGLES),
    frequency: pick(GABOR_FREQUENCIES),
  };
  target.key = patternKey(target);

  const keys = new Set([target.key]);
  const tiles = [{ ...target }];
  let attempts = 0;

  while (tiles.length < 16 && attempts < 500) {
    attempts += 1;
    let candidate;

    if (Math.random() < 0.55) {
      candidate = {
        angle: (target.angle + pick([-45, -30, -22.5, 22.5, 30, 45]) + 360) % 180,
        frequency: target.frequency,
      };
    } else {
      candidate = {
        angle: target.angle,
        frequency: clamp(
          target.frequency + pick([-1.4, -1, -0.6, 0.6, 1, 1.4]),
          2.8,
          6.6,
        ),
      };
    }

    const key = patternKey(candidate);
    if (!keys.has(key)) {
      keys.add(key);
      tiles.push({ ...candidate, key });
    }
  }

  if (tiles.length < 16) {
    for (let angleIndex = 0; angleIndex < GABOR_ANGLES.length && tiles.length < 16; angleIndex += 1) {
      for (
        let frequencyIndex = 0;
        frequencyIndex < GABOR_FREQUENCIES.length && tiles.length < 16;
        frequencyIndex += 1
      ) {
        const candidate = {
          angle: GABOR_ANGLES[angleIndex],
          frequency: GABOR_FREQUENCIES[frequencyIndex],
        };
        const key = patternKey(candidate);
        if (!keys.has(key)) {
          keys.add(key);
          tiles.push({ ...candidate, key });
        }
      }
    }
  }

  return {
    target,
    tiles: shuffle(tiles.slice(0, 16)),
  };
}

export function createPairsDeck() {
  const pairs = PAIR_PATTERNS.map((pattern, index) => {
    const key = patternKey(pattern);
    return {
      ...pattern,
      key,
      pairId: index,
    };
  });

  const cards = [...pairs, ...pairs].map((pattern, index) => ({
    ...pattern,
    cardId: `${pattern.pairId}-${index}-${Math.random().toString(36).slice(2, 7)}`,
  }));

  return shuffle(cards);
}
