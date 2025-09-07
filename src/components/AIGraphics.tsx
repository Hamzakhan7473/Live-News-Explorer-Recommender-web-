'use client';

import { motion } from 'framer-motion';
import { Brain, Cpu, Zap, Network, TrendingUp, BarChart3 } from 'lucide-react';

export function AIGraphics() {
  return (
    <div className="relative">
      {/* Floating AI Elements */}
      <motion.div
        className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 360],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Brain className="w-4 h-4 text-white" />
      </motion.div>

      <motion.div
        className="absolute -bottom-2 -left-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
        animate={{
          y: [0, 8, 0],
          x: [0, 5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <Cpu className="w-3 h-3 text-white" />
      </motion.div>

      <motion.div
        className="absolute top-1/2 -left-6 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        <Zap className="w-3 h-3 text-white" />
      </motion.div>
    </div>
  );
}

export function MLVisualization() {
  return (
    <div className="relative p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">AI Ranking Engine</h3>
        <Network className="w-5 h-5 text-blue-600" />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          className="text-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-xs text-gray-600">Diversity</p>
          <motion.div
            className="w-full bg-gray-200 rounded-full h-2 mt-1"
            initial={{ width: 0 }}
            animate={{ width: "75%" }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="bg-blue-500 h-2 rounded-full"></div>
          </motion.div>
        </motion.div>

        <motion.div
          className="text-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-xs text-gray-600">Novelty</p>
          <motion.div
            className="w-full bg-gray-200 rounded-full h-2 mt-1"
            initial={{ width: 0 }}
            animate={{ width: "60%" }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <div className="bg-purple-500 h-2 rounded-full"></div>
          </motion.div>
        </motion.div>

        <motion.div
          className="text-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <BarChart3 className="w-6 h-6 text-cyan-600" />
          </div>
          <p className="text-xs text-gray-600">Freshness</p>
          <motion.div
            className="w-full bg-gray-200 rounded-full h-2 mt-1"
            initial={{ width: 0 }}
            animate={{ width: "85%" }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="bg-cyan-500 h-2 rounded-full"></div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="mt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="text-sm text-gray-600">
          <span className="inline-flex items-center">
            <motion.span
              className="w-2 h-2 bg-green-500 rounded-full mr-2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            AI Learning Active
          </span>
        </p>
      </motion.div>
    </div>
  );
}
