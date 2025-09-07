'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RefreshCw, Target, Sparkles, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface RankingControlsProps {
  preferences: {
    diversity: number;
    novelty: number;
    freshness: number;
  };
  onPreferencesChange: (preferences: { diversity: number; novelty: number; freshness: number }) => void;
}

export function RankingControls({ preferences, onPreferencesChange }: RankingControlsProps) {
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSliderChange = (key: keyof typeof preferences, value: number[]) => {
    setLocalPreferences(prev => ({
      ...prev,
      [key]: value[0],
    }));
  };

  const handleApply = async () => {
    setIsUpdating(true);
    try {
      await onPreferencesChange(localPreferences);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReset = () => {
    const defaultPrefs = { diversity: 0.5, novelty: 0.5, freshness: 0.5 };
    setLocalPreferences(defaultPrefs);
    onPreferencesChange(defaultPrefs);
  };

  const getPreferenceDescription = (key: keyof typeof preferences) => {
    const descriptions = {
      diversity: {
        low: 'Focus on your preferred topics',
        high: 'Explore diverse perspectives and topics',
      },
      novelty: {
        low: 'Include familiar, trusted sources',
        high: 'Emphasize fresh, new content',
      },
      freshness: {
        low: 'Include both recent and background stories',
        high: 'Highlight the latest breaking news',
      },
    };
    
    const value = localPreferences[key];
    return value > 0.6 ? descriptions[key].high : descriptions[key].low;
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white border border-gray-100 rounded-3xl p-8 hover-lift">
        <div className="mb-8">
          <h3 className="text-xl font-light text-gray-900 mb-3">Ranking Controls</h3>
          <p className="text-sm text-gray-500 font-light">
            Adjust how articles are personalized for you
          </p>
        </div>
        <div className="space-y-8">
          {/* Diversity Control */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm font-light text-gray-700">Diversity</span>
              </div>
              <span className="text-sm font-light text-gray-500">
                {(localPreferences.diversity * 100).toFixed(0)}%
              </span>
            </div>
            <Slider
              value={[localPreferences.diversity]}
              onValueChange={(value) => handleSliderChange('diversity', value)}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-gray-500 font-light">
              {getPreferenceDescription('diversity')}
            </p>
          </div>

          {/* Novelty Control */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-sm font-light text-gray-700">Novelty</span>
              </div>
              <span className="text-sm font-light text-gray-500">
                {(localPreferences.novelty * 100).toFixed(0)}%
              </span>
            </div>
            <Slider
              value={[localPreferences.novelty]}
              onValueChange={(value) => handleSliderChange('novelty', value)}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-gray-500 font-light">
              {getPreferenceDescription('novelty')}
            </p>
          </div>

          {/* Freshness Control */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span className="text-sm font-light text-gray-700">Freshness</span>
              </div>
              <span className="text-sm font-light text-gray-500">
                {(localPreferences.freshness * 100).toFixed(0)}%
              </span>
            </div>
            <Slider
              value={[localPreferences.freshness]}
              onValueChange={(value) => handleSliderChange('freshness', value)}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-gray-500 font-light">
              {getPreferenceDescription('freshness')}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-8">
            <motion.button
              onClick={handleApply}
              disabled={isUpdating}
              className="flex-1 px-6 py-3 bg-gray-900 text-white text-sm font-light rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isUpdating ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Updating...
                </div>
              ) : (
                'Apply Changes'
              )}
            </motion.button>
            <motion.button
              onClick={handleReset}
              className="px-6 py-3 border border-gray-200 text-gray-600 text-sm font-light rounded-full hover:border-gray-300 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Reset
            </motion.button>
          </div>

          {/* Current Settings Summary */}
          <div className="pt-6 border-t border-gray-100">
            <h4 className="text-sm font-light text-gray-700 mb-3">Current Settings</h4>
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex justify-between">
                <span className="font-light">Diversity:</span>
                <span className="font-light">{(localPreferences.diversity * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="font-light">Novelty:</span>
                <span className="font-light">{(localPreferences.novelty * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="font-light">Freshness:</span>
                <span className="font-light">{(localPreferences.freshness * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
