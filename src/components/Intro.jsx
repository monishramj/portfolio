import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { TextAnimate } from './TextAnimate';

// Opening card: the name blurs in letter by letter on black, then the name blurs out as the black fades.
export default function Intro() {
  const reduced = useReducedMotion();
  const [show, setShow] = useState(!reduced);
  useEffect(() => { const t = setTimeout(() => setShow(false), 1400); return () => clearTimeout(t); }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="intro" exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }} aria-hidden>
          <motion.p exit={{ filter: 'blur(14px)', opacity: 0, transition: { duration: 0.4 } }}>
            <TextAnimate as="span" by="character" duration={0.3}>{'monish '}</TextAnimate>
            <em><TextAnimate as="span" by="character" duration={0.45} delay={0.3}>ramesh jayakumar</TextAnimate></em>
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
