'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RefreshCw, Target, Sparkles, Clock } from 'lucide-react';

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="w-5 h-5" />
          <span>Ranking Controls</span>
        </CardTitle>
        <CardDescription>
          Adjust how articles are personalized for you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Diversity Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Diversity</span>
            </div>
            <span className="text-sm text-gray-500">
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
          <p className="text-xs text-gray-600">
            {getPreferenceDescription('diversity')}
          </p>
        </div>

        {/* Novelty Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Novelty</span>
            </div>
            <span className="text-sm text-gray-500">
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
          <p className="text-xs text-gray-600">
            {getPreferenceDescription('novelty')}
          </p>
        </div>

        {/* Freshness Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">Freshness</span>
            </div>
            <span className="text-sm text-gray-500">
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
          <p className="text-xs text-gray-600">
            {getPreferenceDescription('freshness')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4">
          <Button
            onClick={handleApply}
            disabled={isUpdating}
            className="flex-1"
          >
            {isUpdating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              'Apply Changes'
            )}
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="px-3"
          >
            Reset
          </Button>
        </div>

        {/* Current Settings Summary */}
        <div className="pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Current Settings</h4>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Diversity:</span>
              <span>{(localPreferences.diversity * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Novelty:</span>
              <span>{(localPreferences.novelty * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Freshness:</span>
              <span>{(localPreferences.freshness * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
