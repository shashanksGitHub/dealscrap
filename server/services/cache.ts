import Redis from 'ioredis';
import { CONFIG } from '../config';

class CacheService {
  private redis: Redis;
  private defaultTTL = 300; // 5 minutes

  constructor() {
    this.redis = new Redis(CONFIG.REDIS_URL || 'redis://localhost:6379');
    
    this.redis.on('error', (err) => {
      console.error('Redis error:', err);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = this.defaultTTL): Promise<void> {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key: string): Promise<void> {
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