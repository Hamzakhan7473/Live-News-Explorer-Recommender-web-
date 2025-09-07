import { NextRequest, NextResponse } from 'next/server';
import { nytClient } from '@/lib/nyt-api';
import { redisClient } from '@/lib/redis';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'anonymous';
    const diversity = parseFloat(searchParams.get('diversity') || '0.5');
    const novelty = parseFloat(searchParams.get('novelty') || '0.5');
    const freshness = parseFloat(searchParams.get('freshness') || '0.5');

    // Get user vector from Redis
    const userVector = await redisClient.getUserVector(userId);
    
    // Fetch articles from NYT API
    const { topStories, mostPopular, timesWire } = await nytClient.getAllArticles();
    
    // Combine and deduplicate articles
    const allArticles = [...topStories, ...mostPopular, ...timesWire];
    const uniqueArticles = allArticles.filter((article, index, self) => 
      index === self.findIndex(a => a.url === article.url)
    );

    // Limit to top 50 articles for ranking
    const articlesToRank = uniqueArticles.slice(0, 50);

    // Call Python ranking service
    const rankingResponse = await fetch('http://localhost:8000/rank', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        articles: articlesToRank,
        user_id: userId,
        preferences: {
          diversity,
          novelty,
          freshness,
        },
        reading_history: userVector?.readingHistory || [],
      }),
    });

    if (!rankingResponse.ok) {
      throw new Error('Ranking service failed');
    }

    const rankingResult = await rankingResponse.json();

    // Cache articles in Redis
    await redisClient.cacheArticles(rankingResult.ranked_articles);

    return NextResponse.json({
      articles: rankingResult.ranked_articles,
      explanation: rankingResult.ranking_explanation,
      scores: {
        diversity: rankingResult.diversity_score,
        novelty: rankingResult.novelty_score,
        freshness: rankingResult.freshness_score,
      },
      userPreferences: {
        diversity,
        novelty,
        freshness,
      },
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
