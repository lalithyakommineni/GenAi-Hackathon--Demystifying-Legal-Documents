
import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  // FIX: Narrow the type of the `icon` prop to ensure it can be cloned with a className, resolving a TypeScript error.
  icon: React.ReactElement<{ className?: string }>;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <motion.div
      className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center"
      whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.25)" }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="bg-gray-700 w-16 h-16 rounded-full mx-auto flex items-center justify-center text-indigo-400">
        {React.cloneElement(icon, { className: 'w-8 h-8' })}
      </div>
      <h3 className="mt-4 text-xl font-bold text-white">{title}</h3>
      <p className="mt-2 text-gray-400">{description}</p>
    </motion.div>
  );
};
