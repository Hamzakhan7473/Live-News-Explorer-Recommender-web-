import { NextRequest, NextResponse } from 'next/server';
import { redisClient } from '@/lib/redis';

export async function POST(request: NextRequest) {
  try {
    const { userId, articleId, feedback } = await request.json();
    
    if (!userId || !articleId || feedback === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Add to reading history
    await redisClient.addToReadingHistory(userId, articleId);

    // Send feedback to Python ranking service
    const feedbackResponse = await fetch('http://localhost:8000/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        article_id: articleId,
        feedback: feedback,
      }),
    });

    if (!feedbackResponse.ok) {
      console.warn('Failed to send feedback to ranking service');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording feedback:', error);
    return NextResponse.json(
      { error: 'Failed to record feedback' },
      { status: 500 }
    );
  }
}
