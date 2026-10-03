// Magic UI's TextAnimate (https://magicui.design/docs/components/text-animate), ported to plain JSX
// without Tailwind and trimmed to the blurInUp preset the intro uses.
import { memo } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const motionElements = { div: motion.div, h1: motion.h1, p: motion.p, span: motion.span };

// `transform` instead of motion's `y`: `y` is driven from JS every frame, so it stuttered while the
// TV's shaders compiled underneath; opacity/filter/transform all hand off to the compositor
const item = {
  hidden: { opacity: 0, filter: 'blur(10px)', transform: 'translateY(20px)' },
  show: { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)', transition: { transform: { duration: 0.3 }, opacity: { duration: 0.4 }, filter: { duration: 0.3 } } },
  exit: { opacity: 0, filter: 'blur(10px)', transform: 'translateY(20px)', transition: { transform: { duration: 0.3 }, opacity: { duration: 0.4 }, filter: { duration: 0.3 } } },
};

function TextAnimateBase({ children, delay = 0, duration = 0.3, as = 'p', by = 'word', style, ...props }) {
  const MotionComponent = motionElements[as];
  const segments = by === 'character' ? children.split('') : children.split(/(\s+)/);
  const stagger = duration / segments.length;
  const container = {
    hidden: { opacity: 1 },
    show: { opacity: 1, transition: { delayChildren: delay, staggerChildren: stagger } },
    exit: { opacity: 0, transition: { staggerChildren: stagger, staggerDirection: -1 } },
  };

  return (
    <AnimatePresence mode="popLayout">
      <MotionComponent variants={container} initial="hidden" animate="show" exit="exit" aria-label={children} style={{ whiteSpace: 'pre-wrap', ...style }} {...props}>
        <span className="sr-only">{children}</span>
        {segments.map((segment, i) => (
          <motion.span key={`${by}-${segment}-${i}`} variants={item} style={{ display: 'inline-block', whiteSpace: 'pre' }} aria-hidden>
            {segment}
          </motion.span>
        ))}
      </MotionComponent>
    </AnimatePresence>
  );
}

export const TextAnimate = memo(TextAnimateBase);
