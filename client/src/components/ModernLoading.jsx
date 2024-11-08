import React from 'react';
import { motion } from 'framer-motion';
import EcoNetflixLoader from './EcoLoading';

const ModernLoading = () => {
  const colors = {
    primary: '#6366F1',
    secondary: '#8B5CF6',
    tertiary: '#EC4899',
    background: '#111827',
    text: '#F3F4F6',
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const circleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 10,
        delay: i * 0.1,
      },
    }),
  };

  const pulseVariants = {
    scale: [1, 1.2, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 10,
        delay: 0.5,
      },
    },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <motion.div
        className="relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[colors.primary, colors.secondary, colors.tertiary].map((color, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            custom={i}
            variants={circleVariants}
          >
            <motion.div
              className="w-40 h-40 rounded-full opacity-30"
              style={{ 
                backgroundColor: color,
                filter: 'blur(40px)',
              }}
              animate={pulseVariants}
            />
          </motion.div>
        ))}
        <motion.div
          className="w-20 h-20 rounded-full border-4 border-white border-t-transparent animate-spin"
          style={{ borderTopColor: colors.primary }}
        />
        <motion.p
          className="mt-8 text-2xl font-semibold text-center"
          style={{ color: colors.text }}
          variants={textVariants}
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ModernLoading;