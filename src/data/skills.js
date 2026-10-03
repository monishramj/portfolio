import { siPython, siCplusplus, siTypescript, siPytorch, siReact, siNextdotjs, siFlutter, siFastapi, siPostgresql, siDocker } from 'simple-icons';

// Selected from public/resume.pdf; descriptions point to work on the résumé.
export const SKILLS = [
  { name: 'Python', icon: siPython, category: 'Language', detail: 'Research pipelines for clinical speech analysis and a chess move generator sustaining 140,000+ nodes per second.' },
  { name: 'C / C++', icon: siCplusplus, category: 'Language', detail: 'A 20 Hz multiplayer game server for up to 50 players, plus the embedded side of a haptic VR glove.' },
  { name: 'TypeScript', icon: siTypescript, category: 'Language', detail: 'A production borrower portal with document uploads and application intake at Hill Mortgage Company.' },
  { name: 'PyTorch', icon: siPytorch, category: 'Machine learning', detail: 'A six-layer chess evaluator trained on 10 million+ positions and a diagnostic pipeline for aphasic speech.' },
  { name: 'React', icon: siReact, category: 'Frontend', detail: 'Production interfaces, including responsive layouts across 35+ components in a borrower portal.' },
  { name: 'Next.js', icon: siNextdotjs, category: 'Full stack', detail: 'A borrower portal connected to a legacy backend, with secure session state and document intake.' },
  { name: 'Flutter', icon: siFlutter, category: 'Mobile', detail: 'Co-built UPlate for 800+ students, with dining hall menus, meal recommendations, and photo-based nutrition logging.' },
  { name: 'FastAPI', icon: siFastapi, category: 'Backend', detail: 'Part of the Campout multiplayer stack, alongside a C++ server and a WebSockets gateway.' },
  { name: 'PostgreSQL', icon: siPostgresql, category: 'Database', detail: 'The relational database in the Campout multiplayer game stack.' },
  { name: 'Docker', icon: siDocker, category: 'Infrastructure', detail: 'Container tooling used in the Campout multiplayer game stack.' },
];
