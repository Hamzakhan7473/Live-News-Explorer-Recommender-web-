'use client';

import { useState, useEffect } from 'react';
import { NewsCard } from '@/components/NewsCard';
import { RankingControls } from '@/components/RankingControls';
import { TransparencyPanel } from '@/components/TransparencyPanel';
import { DownloadLogs } from '@/components/DownloadLogs';
import { Loader2, Settings, Info, Sparkles } from 'lucide-react';
import { generateMockRankingData, MockRankingData } from '@/lib/mock-data';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { AIGraphics, MLVisualization } from '@/components/AIGraphics';
import { JournalismAnimations, NewsTicker, TypewriterEffect } from '@/components/JournalismAnimations';
import { FirstTimeVisitorAnimation, WelcomeAnimation, ScrollRevealAnimation } from '@/components/FirstTimeVisitorAnimation';
import { PageTransition, StaggeredReveal, FadeInUp, ScaleIn } from '@/components/PageTransition';
import { HeroAnimation, FloatingElements, PulseAnimation } from '@/components/HeroAnimation';
import { motion } from 'framer-motion';

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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Use mock data for now
      const mockPreferences = preferences || { diversity: 0.5, novelty: 0.5, freshness: 0.5 };
      const mockData = generateMockRankingData(mockPreferences);
      
      setArticles(mockData.articles);
      setRankingData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesChange = async (preferences: { diversity: number; novelty: number; freshness: number }) => {
    // For now, just refetch with new preferences (mock data)
    await fetchArticles(preferences);
  };

  const handleArticleClick = async (articleId: string) => {
    // For now, just log the click (mock feedback)
    console.log(`User clicked article: ${articleId}`);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-lg font-light text-gray-900">
                Live News Explorer
              </h1>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-12"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.button
                onClick={() => setShowTransparency(!showTransparency)}
                className="text-sm font-light text-gray-600 hover:text-gray-900 transition-colors relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Transparency
                <motion.div
                  className="absolute -bottom-1 left-0 w-0 h-px bg-gray-900 group-hover:w-full transition-all duration-300"
                  initial={false}
                />
              </motion.button>
              <motion.button
                onClick={() => setShowControls(!showControls)}
                className="text-sm font-light text-gray-600 hover:text-gray-900 transition-colors relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Controls
                <motion.div
                  className="absolute -bottom-1 left-0 w-0 h-px bg-gray-900 group-hover:w-full transition-all duration-300"
                  initial={false}
                />
              </motion.button>
              <DownloadLogs userId={userId} />
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        className="pt-40 pb-24 px-6 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        {/* Journalism Animations Background */}
        <div className="absolute inset-0 opacity-20">
          <JournalismAnimations />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.h1 
            className="text-6xl md:text-8xl lg:text-9xl font-light text-gray-900 mb-12 leading-none"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          >
            <span className="block">News,</span>
            <span className="block text-gray-400 font-extralight">reimagined</span>
          </motion.h1>
          
          <motion.div
            className="max-w-2xl mx-auto mb-16"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <p className="text-xl text-gray-600 font-light leading-relaxed mb-6">
              Personalized news with transparent AI ranking.
            </p>
            <p className="text-lg text-gray-500 font-light">
              See why you're seeing what you're seeing.
            </p>
          </motion.div>
          
          {/* CTA Button */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <motion.button
              className="group relative px-8 py-4 bg-gray-900 text-white text-sm font-light rounded-full hover:bg-gray-800 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Explore News</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* News Ticker */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 2 }}
      >
        <NewsTicker />
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="max-w-7xl mx-auto px-8 pb-24 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
          {/* Articles */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            {loading && (
              <motion.div 
                className="flex items-center justify-center py-24"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center">
                  <motion.div
                    className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <p className="text-sm font-light text-gray-500">
                    Curating your personalized news...
                  </p>
                </div>
              </motion.div>
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
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {articles.map((item, index) => (
                  <motion.div
                    key={item.article.id}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <NewsCard
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
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            className="space-y-8"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.8 }}
          >
            {showControls && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <RankingControls
                  preferences={rankingData?.userPreferences || { diversity: 0.5, novelty: 0.5, freshness: 0.5 }}
                  onPreferencesChange={handlePreferencesChange}
                />
              </motion.div>
            )}

            {showTransparency && rankingData && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <TransparencyPanel
                  explanation={rankingData.explanation}
                  scores={rankingData.scores}
                  preferences={rankingData.userPreferences}
                />
              </motion.div>
            )}

            {/* AI Visualization */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 2 }}
            >
              <MLVisualization />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}