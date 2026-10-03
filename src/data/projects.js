const base = import.meta.env.BASE_URL;

export const PROJECTS = [
  {
    title: 'MedVR Haptic Glove',
    desc: 'Wearable glove that simulates touch feedback. Real-time finger tracking + custom Unity simulation with an Oculus Quest.',
    tech: ['Arduino', 'Unity', 'C#'],
    img: `${base}images/vrglove.jpg`,
    github: 'https://github.com/monishramj/medvr-haptic-glove',
    featured: true,
  },
  {
    title: 'Monkish',
    desc: 'Chess engine with a neural network evaluator: 6-layer CNN trained on 10M Stockfish-eval positions.',
    tech: ['Python', 'PyTorch', 'matplotlib'],
    img: `${base}images/chess_eval.png`,
    fit: 'contain',
    github: 'https://github.com/monishramj/monkish',
    featured: true,
  },
  {
    title: 'Passenger Princess',
    desc: 'Wearable hardware co-pilot using real-time IMU sensor fusion to coach drivers with hands-free audio feedback. Built at StarkHacks 2026.',
    tech: ['C++', 'ESP32-S3', 'WebSockets', 'ElevenLabs'],
    img: `${base}images/starkhacks2.jpg`,
    github: 'https://github.com/ethannsie/Amoeba-StarkHacks',
    devpost: 'https://devpost.com/software/passenger-princess',
    featured: true,
  },
  {
    title: 'ESP32 DOOM',
    desc: 'DOOM rendered on a 128 x 64 OLED display running on an ESP32-S3 microcontroller.',
    tech: ['C', 'ESP32-S3', 'ESP-IDF'],
    img: `${base}images/esp32doom.jpg`,
    github: 'https://github.com/monishramj/esp32-doom',
  },
];
