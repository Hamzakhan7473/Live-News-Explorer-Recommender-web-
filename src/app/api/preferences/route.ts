import { NextRequest, NextResponse } from 'next/server';
import { redisClient } from '@/lib/redis';

export async function POST(request: NextRequest) {
  try {
    const { userId, preferences } = await request.json();
    
    if (!userId || !preferences) {
      return NextResponse.json(
        { error: 'Missing userId or preferences' },
        { status: 400 }
      );
    }

    // Update user preferences in Redis
    await redisClient.updateUserPreferences(userId, preferences);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    // Get user preferences from Redis
    const userVector = await redisClient.getUserVector(userId);

    return NextResponse.json({
      preferences: userVector?.preferences || {
        diversity: 0.5,
        novelty: 0.5,
        freshness: 0.5,
      },
    });
  } catch (error) {
    console.error('Error getting preferences:', error);
    return NextResponse.json(
      { error: 'Failed to get preferences' },
      { status: 500 }
    );
  }
}
