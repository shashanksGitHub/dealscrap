import { users, leads, blogPosts, type User, type Lead, type BlogPost, type InsertUser, type InsertBlogPost } from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

interface BusinessInfo {
  [key: string]: any;
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  createUser(user: Omit<InsertUser, "passwordConfirm">): Promise<User>;
  setResetToken(userId: number, token: string, expiry: Date): Promise<void>;
  clearResetToken(userId: number): Promise<void>;
  updatePassword(userId: number, hashedPassword: string): Promise<void>;
  addCredits(userId: number, amount: number): Promise<User>;
  createLead(lead: Omit<Lead, "id" | "createdAt">): Promise<Lead>;
  getLeadsByUserId(userId: number): Promise<Lead[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPosts(authorId?: number): Promise<BlogPost[]>;
  updateBlogPost(id: number, post: Partial<BlogPost>): Promise<BlogPost>;
  sessionStore: session.Store;
  updateStripeCustomerId(userId: number, stripeCustomerId: string): Promise<User>;
  updateBusinessInfo(userId: number, businessInfo: BusinessInfo): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    console.log(`Getting user with ID: ${id}`);
    const [user] = await db.select().from(users).where(eq(users.id, id));
    console.log(`Found user:`, user);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.resetToken, token));
    return user;
  }

  async createUser(insertUser: Omit<InsertUser, "passwordConfirm">): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async setResetToken(userId: number, token: string, expiry: Date): Promise<void> {
    await db
      .update(users)
      .set({ resetToken: token, resetTokenExpiry: expiry })
      .where(eq(users.id, userId));
  }

  async clearResetToken(userId: number): Promise<void> {
    await db
      .update(users)
      .set({ resetToken: null, resetTokenExpiry: null })
      .where(eq(users.id, userId));
  }

  async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));
  }

  async addCredits(userId: number, amount: number): Promise<User> {
    console.log(`Adding credits - User ID: ${userId}, Amount: ${amount}`);
    const [user] = await db
      .update(users)
      .set({
        credits: sql`${users.credits} + ${amount}`,
      })
      .where(eq(users.id, userId))
      .returning();

    if (!user) {
      console.error(`User not found: ${userId}`);
      throw new Error("User not found");
    }

    console.log(`Updated credits for user ${userId} to ${user.credits}`);
    return user;
  }

  async createLead(lead: Omit<Lead, "id" | "createdAt">): Promise<Lead> {
    console.log('Creating lead:', lead);
    const [newLead] = await db.insert(leads).values(lead).returning();
    console.log('Created lead:', newLead);
    return newLead;
  }

  async getLeadsByUserId(userId: number): Promise<Lead[]> {
    console.log('Fetching leads for user:', userId);
    const userLeads = await db.select().from(leads).where(eq(leads.userId, userId));
    console.log('Found leads:', userLeads);
    return userLeads;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPosts(authorId?: number): Promise<BlogPost[]> {
    if (authorId) {
      return db.select().from(blogPosts).where(eq(blogPosts.authorId, authorId));
    }
    return db.select().from(blogPosts);
  }

  async updateBlogPost(id: number, updates: Partial<BlogPost>): Promise<BlogPost> {
    const [post] = await db
      .update(blogPosts)
      .set(updates)
      .where(eq(blogPosts.id, id))
      .returning();
    if (!post) throw new Error("Blog post not found");
    return post;
  }

  async updateStripeCustomerId(userId: number, stripeCustomerId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ stripeCustomerId })
      .where(eq(users.id, userId))
      .returning();
    if (!user) throw new Error("User not found");
    return user;
  }

  async updateBusinessInfo(userId: number, businessInfo: BusinessInfo): Promise<User> {
    const [user] = await db
      .update(users)
      .set(businessInfo)
      .where(eq(users.id, userId))
      .returning();
    if (!user) throw new Error("User not found");
    return user;
  }
}

export const storage = new DatabaseStorage();