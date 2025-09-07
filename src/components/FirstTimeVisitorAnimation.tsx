'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Newspaper, Globe, TrendingUp, Users, Clock, Zap, Target, Sparkles } from 'lucide-react';

interface FirstTimeVisitorAnimationProps {
  onComplete: () => void;
}

export function FirstTimeVisitorAnimation({ onComplete }: FirstTimeVisitorAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    {
      icon: Globe,
      title: "Connecting to Global News",
      subtitle: "Accessing real-time news feeds from around the world",
      color: "from-blue-500 to-cyan-500",
      duration: 2000
    },
    {
      icon: TrendingUp,
      title: "Analyzing Trends",
      subtitle: "Processing breaking news and trending topics",
      color: "from-purple-500 to-pink-500",
      duration: 2000
    },
    {
      icon: Users,
      title: "Personalizing Experience",
      subtitle: "Tailoring content to your interests and preferences",
      color: "from-green-500 to-emerald-500",
      duration: 2000
    },
    {
      icon: Target,
      title: "Optimizing Rankings",
      subtitle: "Applying AI algorithms for the best content discovery",
      color: "from-orange-500 to-red-500",
      duration: 2000
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(onComplete, 500);
        }, 1000);
      }
    }, steps[currentStep].duration);

    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  const currentStepData = steps[currentStep];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 bg-white flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, #3B82F6 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, #8B5CF6 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, #06B6D4 0%, transparent 50%)
              `,
            }} />
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center max-w-2xl mx-auto px-8">
            {/* Logo/Title */}
            <motion.div
              className="mb-16"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                className="inline-flex items-center space-x-3 mb-4"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Newspaper className="w-12 h-12 text-gray-900" />
                <h1 className="text-4xl font-light text-gray-900">Live News Explorer</h1>
              </motion.div>
              <motion.p
                className="text-lg text-gray-500 font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Personalized news with transparent AI ranking
              </motion.p>
            </motion.div>

            {/* Current Step */}
            <motion.div
              key={currentStep}
              className="mb-12"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Icon with Gradient Background */}
              <motion.div
                className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r ${currentStepData.color} flex items-center justify-center shadow-lg`}
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <currentStepData.icon className="w-12 h-12 text-white" />
              </motion.div>

              {/* Title */}
              <motion.h2
                className="text-2xl font-light text-gray-900 mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {currentStepData.title}
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                className="text-gray-500 font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {currentStepData.subtitle}
              </motion.p>
            </motion.div>

            {/* Progress Bar */}
            <div className="w-full max-w-md mx-auto mb-8">
              <div className="flex justify-between items-center mb-2">
                {steps.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index <= currentStep ? 'bg-gray-900' : 'bg-gray-200'
                    }`}
                    animate={{
                      scale: index === currentStep ? [1, 1.2, 1] : 1,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                ))}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <motion.div
                  className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Loading Dots */}
            <motion.div
              className="flex justify-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gray-300 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function WelcomeAnimation() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-40 bg-white/95 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              className="mb-6"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-16 h-16 text-blue-500 mx-auto" />
            </motion.div>
            
            <motion.h2
              className="text-3xl font-light text-gray-900 mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Welcome to Live News Explorer
            </motion.h2>
            
            <motion.p
              className="text-gray-500 font-light"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Your personalized news experience is ready
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ScrollRevealAnimation({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
