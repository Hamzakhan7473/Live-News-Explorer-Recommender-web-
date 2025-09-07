'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Info, TrendingUp, Eye, Clock, Sparkles } from 'lucide-react';

interface TransparencyPanelProps {
  explanation: string;
  scores: {
    diversity: number;
    novelty: number;
    freshness: number;
  };
  preferences: {
    diversity: number;
    novelty: number;
    freshness: number;
  };
}

export function TransparencyPanel({ explanation, scores, preferences }: TransparencyPanelProps) {
  const getScoreColor = (score: number) => {
    if (score >= 0.7) return 'text-green-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.7) return 'High';
    if (score >= 0.4) return 'Medium';
    return 'Low';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Info className="w-5 h-5" />
          <span>Why you're seeing this</span>
        </CardTitle>
        <CardDescription>
          Transparent explanation of our ranking algorithm
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Algorithm Explanation */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Algorithm Explanation</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {explanation}
          </p>
        </div>

        {/* Current Scores */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Current Feed Scores</h4>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Diversity</span>
                </div>
                <span className={`text-sm font-medium ${getScoreColor(scores.diversity)}`}>
                  {getScoreLabel(scores.diversity)} ({(scores.diversity * 100).toFixed(0)}%)
                </span>
              </div>
              <Progress value={scores.diversity * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Novelty</span>
                </div>
                <span className={`text-sm font-medium ${getScoreColor(scores.novelty)}`}>
                  {getScoreLabel(scores.novelty)} ({(scores.novelty * 100).toFixed(0)}%)
                </span>
              </div>
              <Progress value={scores.novelty * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium">Freshness</span>
                </div>
                <span className={`text-sm font-medium ${getScoreColor(scores.freshness)}`}>
                  {getScoreLabel(scores.freshness)} ({(scores.freshness * 100).toFixed(0)}%)
                </span>
              </div>
              <Progress value={scores.freshness * 100} className="h-2" />
            </div>
          </div>
        </div>

        {/* Your Preferences */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Your Preferences</h4>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Diversity Weight</span>
                </div>
                <span className="text-sm text-gray-600">
                  {(preferences.diversity * 100).toFixed(0)}%
                </span>
              </div>
              <Progress value={preferences.diversity * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Novelty Weight</span>
                </div>
                <span className="text-sm text-gray-600">
                  {(preferences.novelty * 100).toFixed(0)}%
                </span>
              </div>
              <Progress value={preferences.novelty * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium">Freshness Weight</span>
                </div>
                <span className="text-sm text-gray-600">
                  {(preferences.freshness * 100).toFixed(0)}%
                </span>
              </div>
              <Progress value={preferences.freshness * 100} className="h-2" />
            </div>
          </div>
        </div>

        {/* Algorithm Details */}
        <div className="pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-900 mb-2">How it works</h4>
          <div className="space-y-2 text-xs text-gray-600">
            <p>
              • <strong>LinUCB Bandit:</strong> Learns from your interactions to improve recommendations
            </p>
            <p>
              • <strong>Topic Diversity:</strong> Ensures balanced coverage across different subjects
            </p>
            <p>
              • <strong>Novelty Detection:</strong> Identifies content you haven't seen recently
            </p>
            <p>
              • <strong>Freshness Scoring:</strong> Prioritizes recent news based on your preference
            </p>
            <p>
              • <strong>Transparent Logging:</strong> All ranking decisions are logged and downloadable
            </p>
          </div>
        </div>

        {/* Data Sources */}
        <div className="pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Data Sources</h4>
          <div className="space-y-1 text-xs text-gray-600">
            <p>• New York Times Top Stories API</p>
            <p>• New York Times Most Popular API</p>
            <p>• New York Times Times Wire API</p>
            <p>• Your reading history and preferences</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
