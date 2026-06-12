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
    title: 'DiabFit',
    desc: 'An insulin management app for diabetics and others, with medical insights and insulin dose calculation. available on Android.',
    tech: ['Flutter', 'Dart', 'Rest-API'],
    img: `${base}images/diabfit.png`,
    github: 'https://github.com/monishramj/DiabFit',
    store: 'https://play.google.com/store/apps/details?id=com.mrj.diab_fit&referrer=utm_source%3Dappbrain%26utm_medium%3Dappbrain_web%26utm_campaign%3Dappbrain_web',
  },
  {
    title: 'Drone Survey Mission',
    desc: 'Computer vision algorithm to identify ground targets + GPS survey pipeline.',
    tech: ['Python', 'OpenCV', 'DroneKit', 'RPi 5'],
    img: `${base}images/drone.jpeg`,
    github: 'https://github.com/monishramj/uas4stem-survey-mission',
  },
  {
    title: 'ESP32 DOOM',
    desc: 'DOOM rendered on a 128 x 64 OLED display running on an ESP32-S3 microcontroller.',
    tech: ['C', 'ESP32-S3', 'ESP-IDF'],
    img: `${base}images/esp32doom.jpg`,
    github: 'https://github.com/monishramj/esp32-doom',
  },
  {
    title: 'Doffy',
    desc: 'AI platform for user made custom coaches with unique personalities and training models with Long-term vector memory database and coach marketplace. for the 2026 RevenueCat Shipyard: Creator Contest.',
    tech: ['React Native', 'Expo', 'Supabase', 'Gemini API', 'TypeScript'],
    img: `${base}images/doffy_logo.png`,
    github: 'https://github.com/monishramj/doffy',
  },
];
