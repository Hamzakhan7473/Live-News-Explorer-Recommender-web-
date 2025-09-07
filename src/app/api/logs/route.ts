import { NextRequest, NextResponse } from 'next/server';
import { redisClient } from '@/lib/redis';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const format = searchParams.get('format') || 'json';

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    // Get user ranking logs from Redis
    const logs = await redisClient.getUserRankingLogs(userId, 50);

    if (format === 'csv') {
      // Convert to CSV format
      const csvHeaders = [
        'timestamp',
        'article_title',
        'original_rank',
        'personalized_rank',
        'diversity_score',
        'novelty_score',
        'freshness_score',
        'final_score',
        'explanation'
      ].join(',');

      const csvRows = logs.flatMap(log => 
        log.articles.map(article => [
          log.timestamp,
          `"${article.title.replace(/"/g, '""')}"`,
          article.originalRank,
          article.personalizedRank,
          article.diversityScore,
          article.noveltyScore,
          article.freshnessScore,
          article.finalScore,
          `"${article.reason.replace(/"/g, '""')}"`
        ].join(','))
      );

      const csvContent = [csvHeaders, ...csvRows].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="ranking-logs-${userId}.csv"`,
        },
      });
    }

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Error getting logs:', error);
    return NextResponse.json(
      { error: 'Failed to get logs' },
      { status: 500 }
    );
  }
}
