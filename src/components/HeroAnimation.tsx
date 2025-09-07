'use client';

import { motion, useAnimation } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Newspaper, Globe, TrendingUp, Users, Clock, Zap, Target, Sparkles } from 'lucide-react';

export function HeroAnimation() {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const texts = [
    "Breaking News",
    "Global Stories", 
    "Personalized Content",
    "AI-Powered Insights",
    "Transparent Rankings"
  ];

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentIndex < texts.length) {
          const currentTextToType = texts[currentIndex];
          if (currentText.length < currentTextToType.length) {
            setCurrentText(currentTextToType.slice(0, currentText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting, texts]);

  return (
    <div className="relative">
      {/* Clean background - no floating icons */}

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Typewriter Text */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-light text-gray-900 mb-4 leading-none">
            <span className="block">News,</span>
            <span className="block text-gray-400 font-extralight">reimagined</span>
          </h1>
          
          <div className="text-2xl md:text-3xl font-light text-gray-600 h-12 flex items-center justify-center">
            <span>{currentText}</span>
            <motion.span
              className="inline-block w-0.5 h-8 bg-gray-600 ml-1"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Animated Description */}
        <motion.div
          className="max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className="text-xl text-gray-600 font-light leading-relaxed mb-6">
            Personalized news with transparent AI ranking.
          </p>
          <p className="text-lg text-gray-500 font-light">
            See why you're seeing what you're seeing.
          </p>
        </motion.div>

        {/* CTA Button with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.button
            className="group relative px-8 py-4 bg-gray-900 text-white text-sm font-light rounded-full hover:bg-gray-800 transition-all duration-300 overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Explore News</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
            <motion.div
              className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
              initial={false}
            />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export function FloatingElements() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Clean background - no floating elements */}
    </div>
  );
}

export function PulseAnimation({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
        opacity: [0.8, 1, 0.8],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
