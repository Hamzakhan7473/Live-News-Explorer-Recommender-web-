'use client';

import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, TrendingUp, TrendingDown, Eye } from 'lucide-react';

interface Article {
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
}

interface NewsCardProps {
  article: Article;
  rank: number;
  originalRank: number;
  scores: {
    diversity: number;
    novelty: number;
    freshness: number;
    final: number;
  };
  onClick: () => void;
}

export function NewsCard({ article, rank, originalRank, scores, onClick }: NewsCardProps) {
  const rankChange = originalRank - rank;
  const imageUrl = article.multimedia?.find(m => m.format === 'superJumbo')?.url ||
                   article.multimedia?.find(m => m.format === 'large')?.url ||
                   article.multimedia?.find(m => m.format === 'mediumThreeByTwo210')?.url;

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const getSectionColor = (section: string) => {
    const colors: Record<string, string> = {
      world: 'bg-blue-100 text-blue-800',
      us: 'bg-red-100 text-red-800',
      politics: 'bg-purple-100 text-purple-800',
      business: 'bg-green-100 text-green-800',
      technology: 'bg-indigo-100 text-indigo-800',
      science: 'bg-yellow-100 text-yellow-800',
      health: 'bg-pink-100 text-pink-800',
      sports: 'bg-orange-100 text-orange-800',
      arts: 'bg-teal-100 text-teal-800',
      opinion: 'bg-gray-100 text-gray-800',
    };
    return colors[section] || 'bg-gray-100 text-gray-800';
  };

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
              {rank}
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSectionColor(article.section)}`}>
                {article.section}
              </span>
              {rankChange !== 0 && (
                <div className="flex items-center space-x-1 text-xs">
                  {rankChange > 0 ? (
                    <>
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-green-600">+{rankChange}</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-3 h-3 text-red-500" />
                      <span className="text-red-600">{rankChange}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {formatDate(article.published_date)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">
              {article.title}
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              {article.abstract}
            </p>
            {article.byline && (
              <p className="text-sm text-gray-500 mb-4">
                By {article.byline}
              </p>
            )}
          </div>

          {imageUrl && (
            <div className="md:col-span-1">
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={`https://static01.nyt.com/${imageUrl}`}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>Diversity: {(scores.diversity * 100).toFixed(0)}%</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>Novelty: {(scores.novelty * 100).toFixed(0)}%</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>Freshness: {(scores.freshness * 100).toFixed(0)}%</span>
            </div>
          </div>
          
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClick}
            className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>Read full article</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </article>
  );
}
