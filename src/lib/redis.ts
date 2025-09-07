import { createClient, RedisClientType } from 'redis';

export interface UserVector {
  userId: string;
  preferences: {
    diversity: number; // 0-1 scale
    novelty: number;   // 0-1 scale
    freshness: number; // 0-1 scale
  };
  readingHistory: string[]; // Article IDs
  topicInterests: Record<string, number>; // Topic -> weight
  lastUpdated: string;
}

export interface RankingLog {
  userId: string;
  timestamp: string;
  articles: Array<{
    id: string;
    title: string;
    originalRank: number;
    personalizedRank: number;
    diversityScore: number;
    noveltyScore: number;
    freshnessScore: number;
    finalScore: number;
    reason: string;
  }>;
  userPreferences: UserVector['preferences'];
}

class RedisClient {
  private client: RedisClientType | null = null;
  private isConnected = false;

  async connect(): Promise<void> {
    if (this.isConnected && this.client) {
      return;
    }

    try {
      this.client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      });

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('Connected to Redis');
        this.isConnected = true;
      });

      await this.client.connect();
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      // Fallback to in-memory storage for development
      this.isConnected = false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client && this.isConnected) {
      await this.client.disconnect();
      this.isConnected = false;
    }
  }

  private async ensureConnected(): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }
  }

  // User Vector Management
  async getUserVector(userId: string): Promise<UserVector | null> {
    await this.ensureConnected();
    
    if (!this.client || !this.isConnected) {
      return this.getDefaultUserVector(userId);
    }

    try {
      const data = await this.client.get(`user:${userId}`);
      return data ? JSON.parse(data) : this.getDefaultUserVector(userId);
    } catch (error) {
      console.error('Error getting user vector:', error);
      return this.getDefaultUserVector(userId);
    }
  }

  async setUserVector(userVector: UserVector): Promise<void> {
    await this.ensureConnected();
    
    if (!this.client || !this.isConnected) {
      return;
    }

    try {
      await this.client.setEx(
        `user:${userVector.userId}`,
        86400 * 30, // 30 days expiration
        JSON.stringify(userVector)
      );
    } catch (error) {
      console.error('Error setting user vector:', error);
    }
  }

  async updateUserPreferences(
    userId: string,
    preferences: Partial<UserVector['preferences']>
  ): Promise<void> {
    const userVector = await this.getUserVector(userId);
    if (userVector) {
      userVector.preferences = { ...userVector.preferences, ...preferences };
      userVector.lastUpdated = new Date().toISOString();
      await this.setUserVector(userVector);
    }
  }

  async addToReadingHistory(userId: string, articleId: string): Promise<void> {
    const userVector = await this.getUserVector(userId);
    if (userVector) {
      // Add to beginning and keep only last 100 articles
      userVector.readingHistory = [articleId, ...userVector.readingHistory.slice(0, 99)];
      userVector.lastUpdated = new Date().toISOString();
      await this.setUserVector(userVector);
    }
  }

  // Ranking Logs Management
  async saveRankingLog(log: RankingLog): Promise<void> {
    await this.ensureConnected();
    
    if (!this.client || !this.isConnected) {
      return;
    }

    try {
      const key = `ranking_log:${log.userId}:${log.timestamp}`;
      await this.client.setEx(key, 86400 * 7, JSON.stringify(log)); // 7 days expiration
      
      // Also add to user's log list
      await this.client.lPush(`user_logs:${log.userId}`, key);
      await this.client.lTrim(`user_logs:${log.userId}`, 0, 99); // Keep only last 100 logs
    } catch (error) {
      console.error('Error saving ranking log:', error);
    }
  }

  async getUserRankingLogs(userId: string, limit = 10): Promise<RankingLog[]> {
    await this.ensureConnected();
    
    if (!this.client || !this.isConnected) {
      return [];
    }

    try {
      const logKeys = await this.client.lRange(`user_logs:${userId}`, 0, limit - 1);
      const logs: RankingLog[] = [];

      for (const key of logKeys) {
        const data = await this.client.get(key);
        if (data) {
          logs.push(JSON.parse(data));
        }
      }

      return logs;
    } catch (error) {
      console.error('Error getting user ranking logs:', error);
      return [];
    }
  }

  // Session Management
  async createSession(userId: string): Promise<string> {
    await this.ensureConnected();
    
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    if (this.client && this.isConnected) {
      try {
        await this.client.setEx(`session:${sessionId}`, 86400, userId); // 24 hours
      } catch (error) {
        console.error('Error creating session:', error);
      }
    }

    return sessionId;
  }

  async getSession(sessionId: string): Promise<string | null> {
    await this.ensureConnected();
    
    if (!this.client || !this.isConnected) {
      return null;
    }

    try {
      return await this.client.get(`session:${sessionId}`);
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  // Default user vector for new users
  private getDefaultUserVector(userId: string): UserVector {
    return {
      userId,
      preferences: {
        diversity: 0.5,
        novelty: 0.5,
        freshness: 0.5,
      },
      readingHistory: [],
      topicInterests: {},
      lastUpdated: new Date().toISOString(),
    };
  }

  // Cache management for articles
  async cacheArticles(articles: any[], ttl = 3600): Promise<void> {
    await this.ensureConnected();
    
    if (!this.client || !this.isConnected) {
      return;
    }

    try {
      const key = `articles:${Date.now()}`;
      await this.client.setEx(key, ttl, JSON.stringify(articles));
    } catch (error) {
      console.error('Error caching articles:', error);
    }
  }

  async getCachedArticles(): Promise<any[] | null> {
    await this.ensureConnected();
    
    if (!this.client || !this.isConnected) {
      return null;
    }

    try {
      const keys = await this.client.keys('articles:*');
      if (keys.length > 0) {
        const data = await this.client.get(keys[0]);
        return data ? JSON.parse(data) : null;
      }
      return null;
    } catch (error) {
      console.error('Error getting cached articles:', error);
      return null;
    }
  }
}

export const redisClient = new RedisClient();
