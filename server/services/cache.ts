import Redis from 'ioredis';
import { CONFIG } from '../config';

class CacheService {
  private redis: Redis | null = null;
  private defaultTTL = 300; // 5 minutes
  private redisEnabled = false;

  constructor() {
    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      this.redis = new Redis(redisUrl, {
        maxRetriesPerRequest: 1,
        retryStrategy: () => null, // Don't retry on failure
        connectTimeout: 1000 // 1 second timeout
      });
      
      this.redis.on('error', (err) => {
        if (this.redisEnabled) {
          console.error('Redis error:', err);
          this.redisEnabled = false;
        }
      });
      
      this.redis.on('connect', () => {
        console.log('Redis connected successfully');
        this.redisEnabled = true;
      });
    } catch (error) {
      console.error('Failed to initialize Redis:', error);
      this.redis = null;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.redis || !this.redisEnabled) {
      return null;
    }
    
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = this.defaultTTL): Promise<void> {
    if (!this.redis || !this.redisEnabled) {
      return;
    }
    
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.redis || !this.redisEnabled) {
      return;
    }
    
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  // Cache user data
  async getUser(id: number) {
    return this.get<any>(`user:${id}`);
  }

  async setUser(id: number, userData: any) {
    await this.set(`user:${id}`, userData, 600); // 10 minutes
  }

  // Cache leads data
  async getLeads(userId: number) {
    return this.get<any[]>(`leads:${userId}`);
  }

  async setLeads(userId: number, leads: any[]) {
    await this.set(`leads:${userId}`, leads, 300); // 5 minutes
  }

  // Cache search results
  async getSearchResults(searchId: number) {
    return this.get<any[]>(`search:${searchId}`);
  }

  async setSearchResults(searchId: number, results: any[]) {
    await this.set(`search:${searchId}`, results, 3600); // 1 hour
  }

  // Clear user-related caches
  async clearUserCaches(userId: number) {
    await Promise.all([
      this.del(`user:${userId}`),
      this.del(`leads:${userId}`),
    ]);
  }
}

export const cacheService = new CacheService(); 