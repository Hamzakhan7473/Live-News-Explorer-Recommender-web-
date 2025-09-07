'use client';

import { useState, useEffect } from 'react';
import { NewsCard } from '@/components/NewsCard';
import { RankingControls } from '@/components/RankingControls';
import { TransparencyPanel } from '@/components/TransparencyPanel';
import { DownloadLogs } from '@/components/DownloadLogs';
import { Loader2, Settings, Info } from 'lucide-react';

interface Article {
  article: {
    id: string;
    title: string;
    abstract: string;
    url: string;
    byline: string;
    published_date: string;
    section: string;
    subsection?: string;
    multimedia?: Array<{
      url: string;
      format: string;
      height: number;
      width: number;
      type: string;
      subtype: string;
      caption: string;
      copyright: string;
    }>;
  };
  original_rank: number;
  diversity_score: number;
  novelty_score: number;
  freshness_score: number;
  final_score: number;
}

interface RankingData {
  articles: Article[];
  explanation: string;
  scores: {
    diversity: number;
    novelty: number;
    freshness: number;
  };
  userPreferences: {
    diversity: number;
    novelty: number;
    freshness: number;
  };
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rankingData, setRankingData] = useState<RankingData | null>(null);
  const [showTransparency, setShowTransparency] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [userId] = useState(() => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const fetchArticles = async (preferences?: { diversity: number; novelty: number; freshness: number }) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        userId,
        ...(preferences || {}),
      });

      const response = await fetch(`/api/articles?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }

      const data = await response.json();
      setArticles(data.articles);
      setRankingData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesChange = async (preferences: { diversity: number; novelty: number; freshness: number }) => {
    // Update preferences in backend
    await fetch('/api/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, preferences }),
    });

    // Refetch articles with new preferences
    await fetchArticles(preferences);
  };

  const handleArticleClick = async (articleId: string) => {
    // Record feedback (positive - user clicked)
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, articleId, feedback: 1.0 }),
    });
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Live News Explorer</h1>
              <p className="text-sm text-gray-600">Personalized news with transparent ranking</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowTransparency(!showTransparency)}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Info className="w-4 h-4" />
                <span>Why you're seeing this</span>
              </button>
              <button
                onClick={() => setShowControls(!showControls)}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Ranking Controls</span>
              </button>
              <DownloadLogs userId={userId} />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Loading personalized news...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{error}</p>
                <button
                  onClick={() => fetchArticles()}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && articles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No articles available at the moment.</p>
              </div>
            )}

            {!loading && !error && articles.length > 0 && (
              <div className="space-y-6">
                {articles.map((item, index) => (
                  <NewsCard
                    key={item.article.id}
                    article={item.article}
                    rank={index + 1}
                    originalRank={item.original_rank}
                    scores={{
                      diversity: item.diversity_score,
                      novelty: item.novelty_score,
                      freshness: item.freshness_score,
                      final: item.final_score,
                    }}
                    onClick={() => handleArticleClick(item.article.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {showControls && (
              <RankingControls
                preferences={rankingData?.userPreferences || { diversity: 0.5, novelty: 0.5, freshness: 0.5 }}
                onPreferencesChange={handlePreferencesChange}
              />
            )}

            {showTransparency && rankingData && (
              <TransparencyPanel
                explanation={rankingData.explanation}
                scores={rankingData.scores}
                preferences={rankingData.userPreferences}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}