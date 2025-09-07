'use client';

import { motion } from 'framer-motion';
import { Newspaper, PenTool, Camera, Mic, Globe, TrendingUp, Users, Clock } from 'lucide-react';

export function JournalismAnimations() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Subtle floating elements - no bubbles */}

      {/* News Headlines Animation */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 1 }}
      >
        <div className="text-center">
          <motion.div
            className="text-2xl font-light text-gray-600 mb-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Breaking News
          </motion.div>
          <motion.div
            className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"
            animate={{ width: ["0%", "100%", "0%"] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          />
        </div>
      </motion.div>

      {/* Clean background - no floating bubbles */}

      {/* Floating Text Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-xs text-gray-400 font-light"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3
          }}
        >
          {['News', 'Truth', 'Story', 'Report', 'Update', 'Alert'][i]}
        </motion.div>
      ))}
    </div>
  );
}

export function NewsTicker() {
  const headlines = [
    "Breaking: Major developments in technology sector",
    "Global markets show positive trends",
    "New research reveals important insights",
    "Community leaders announce new initiatives",
    "Innovation drives economic growth"
  ];

  return (
    <div className="relative w-full h-12 bg-gray-50 border-t border-b border-gray-200 overflow-hidden">
      <motion.div
        className="flex items-center space-x-8 whitespace-nowrap"
        animate={{ x: [0, -1000] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[...headlines, ...headlines].map((headline, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-light text-gray-600">{headline}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function TypewriterEffect() {
  const text = "Live News Explorer";
  
  return (
    <motion.div
      className="text-4xl font-light text-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
      <motion.span
        className="inline-block w-0.5 h-8 bg-gray-900 ml-1"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </motion.div>
  );
}
