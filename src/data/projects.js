const base = import.meta.env.BASE_URL;

export const PROJECTS = [
  {
    title: 'Campout',
    desc: 'A multiplayer survival game that runs in the browser, built from scratch. Up to 50 players share one world in real time, backed by a custom game server.',
    tech: ['C++', 'FastAPI', 'PostgreSQL', 'Docker', 'WebSockets'],
    img: `${base}images/campout.png`,
    fit: 'contain',
    github: 'https://github.com/monishramj/campout',
    featured: true,
  },
  {
    title: 'FlyBy',
    desc: 'HackGT 13 winner (#2 overall). Agentic drone search-and-rescue triage: a local model ranks every detector flag and proposes an action, an LLM parses radio intel, and a commander approves in one click.',
    tech: ['Python', 'Grok', 'MongoDB Atlas', 'Three.js'],
    img: `${base}images/flyby.png`,
    fit: 'contain',
    github: 'https://github.com/monishramj/flyby',
    devpost: 'https://devpost.com/software/flyby-fdxcua',
    featured: true,
  },
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
];
