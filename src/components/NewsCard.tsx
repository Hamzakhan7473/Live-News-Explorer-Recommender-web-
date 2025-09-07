'use client';

import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, TrendingUp, TrendingDown, Eye, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <motion.article 
      className="group cursor-pointer"
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="relative">
        {/* Rank Badge */}
        <motion.div 
          className="absolute -left-4 -top-4 z-10"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-sm font-light text-gray-600 shadow-sm">
            {rank}
          </div>
        </motion.div>

        {/* Main Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-10 hover-lift group-hover:border-gray-200 transition-all duration-700">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-light rounded-full">
                {article.section}
              </span>
              {rankChange !== 0 && (
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  {rankChange > 0 ? (
                    <>
                      <TrendingUp className="w-3 h-3" />
                      <span>+{rankChange}</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-3 h-3" />
                      <span>{rankChange}</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="text-xs text-gray-400 font-light">
              {formatDate(article.published_date)}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <motion.h2 
              className="text-3xl font-light text-gray-900 leading-tight group-hover:text-gray-700 transition-colors duration-500"
              whileHover={{ x: 6 }}
            >
              {article.title}
            </motion.h2>
            
            <p className="text-lg text-gray-600 font-light leading-relaxed">
              {article.abstract}
            </p>
            
            {article.byline && (
              <p className="text-sm text-gray-400 font-light">
                By {article.byline}
              </p>
            )}
          </div>

          {imageUrl && (
            <motion.div 
              className="mt-8"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative aspect-video bg-gray-50 rounded-2xl overflow-hidden">
                <img
                  src={`https://static01.nyt.com/${imageUrl}`}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
            </motion.div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-10 pt-8 border-t border-gray-100">
            <div className="flex items-center space-x-8 text-xs text-gray-400">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="font-light">Diversity {(scores.diversity * 100).toFixed(0)}%</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="font-light">Novelty {(scores.novelty * 100).toFixed(0)}%</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span className="font-light">Freshness {(scores.freshness * 100).toFixed(0)}%</span>
              </div>
            </div>
            
            <motion.a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClick}
              className="inline-flex items-center space-x-3 text-sm text-gray-600 hover:text-gray-900 transition-colors group/link"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-light">Read article</span>
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ExternalLink className="w-4 h-4 group-hover/link:rotate-12 transition-transform duration-300" />
              </motion.div>
            </motion.a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
