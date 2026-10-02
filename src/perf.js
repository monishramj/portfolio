// A rough guess at a weak (or touch/battery-sensitive) device, so heavy effects can be turned down there.
// `?quality=low` or `?quality=high` anywhere in the URL overrides the guess, handy for testing.
const forced = /[?&]quality=(low|high)\b/.exec(window.location.href)?.[1];
export const LOW_END = forced
  ? forced === 'low'
  : (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4 || window.matchMedia('(pointer: coarse)').matches;

if (LOW_END) document.documentElement.classList.add('low-end'); // lets the stylesheet lighten its effects too
