import React from 'react';
// FIX: Import AnimatePresence from framer-motion.
import { motion, AnimatePresence } from 'framer-motion';

const loadingTexts = [
    "Untangling the fine print...",
    "Consulting with our digital lawyers...",
    "Translating jargon into plain English...",
    "Scanning for hidden clauses...",
    "Almost there, simplifying the complex..."
];

export const Loader: React.FC = () => {
  const [textIndex, setTextIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 h-64">
      <motion.div
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          border: '5px solid #4F46E5',
          borderTopColor: '#A78BFA',
        }}
        animate={{ rotate: 360 }}
        transition={{
          // FIX: The correct property for repeating an animation is `repeat`, not `loop`.
          repeat: Infinity,
          ease: 'linear',
          duration: 1,
        }}
      />
      <AnimatePresence mode="wait">
        <motion.p
          key={textIndex}
          className="mt-6 text-xl font-semibold text-gray-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          {loadingTexts[textIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};