import { users, leads, blogPosts, type User, type Lead, type BlogPost, type InsertUser, type InsertBlogPost } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  createUser(user: Omit<InsertUser, "passwordConfirm">): Promise<User>;
  setResetToken(userId: number, token: string, expiry: Date): Promise<void>;
  clearResetToken(userId: number): Promise<void>;
  updatePassword(userId: number, hashedPassword: string): Promise<void>;
  addCredits(userId: number, amount: number): Promise<User>;
  setStripeCustomerId(userId: number, stripeCustomerId: string): Promise<User>;
  createLead(lead: Omit<Lead, "id" | "createdAt">): Promise<Lead>;
  getLeadsByUserId(userId: number): Promise<Lead[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPosts(authorId?: number): Promise<BlogPost[]>;
  updateBlogPost(id: number, post: Partial<BlogPost>): Promise<BlogPost>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private leads: Map<number, Lead>;
  private blogPosts: Map<number, BlogPost>;
  private currentUserId: number;
  private currentLeadId: number;
  private currentBlogPostId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.leads = new Map();
    this.blogPosts = new Map();
    this.currentUserId = 1;
    this.currentLeadId = 1;
    this.currentBlogPostId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    console.log(`Getting user with ID: ${id}`);
    const user = this.users.get(id);
    console.log(`Found user:`, user);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.resetToken === token,
    );
  }

  async createUser(insertUser: Omit<InsertUser, "passwordConfirm">): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      id,
      email: insertUser.email,
      password: insertUser.password,
      credits: 0,
      isActive: true,
      createdAt: new Date(),
      resetToken: null,
      resetTokenExpiry: null,
      stripeCustomerId: ''
    };
    console.log(`Creating new user:`, user);
    this.users.set(id, user);
    return user;
  }

  async setResetToken(userId: number, token: string, expiry: Date): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const updatedUser = {
      ...user,
      resetToken: token,
      resetTokenExpiry: expiry
    };
    this.users.set(userId, updatedUser);
  }

  async clearResetToken(userId: number): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const updatedUser = {
      ...user,
      resetToken: null,
      resetTokenExpiry: null
    };
    this.users.set(userId, updatedUser);
  }

  async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const updatedUser = {
      ...user,
      password: hashedPassword
    };
    this.users.set(userId, updatedUser);
  }

  async addCredits(userId: number, amount: number): Promise<User> {
    console.log(`Adding credits - User ID: ${userId}, Amount: ${amount}`);
    const user = await this.getUser(userId);
    if (!user) {
      console.error(`User not found: ${userId}`);
      throw new Error("User not found");
    }

    const currentCredits = user.credits || 0;
    console.log(`Current credits: ${currentCredits}`);

    const updatedUser = {
      ...user,
      credits: currentCredits + amount
    };

    console.log(`Updated user with new credits:`, updatedUser);
    this.users.set(userId, updatedUser);

    // Verify the update
    const verifiedUser = await this.getUser(userId);
    console.log(`Verified updated user:`, verifiedUser);

    return updatedUser;
  }

  async setStripeCustomerId(userId: number, stripeCustomerId: string): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const updatedUser = {
      ...user,
      stripeCustomerId
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  async createLead(lead: Omit<Lead, "id" | "createdAt">): Promise<Lead> {
    const id = this.currentLeadId++;
    const newLead: Lead = {
      ...lead,
      id,
      createdAt: new Date()
    };
    this.leads.set(id, newLead);
    return newLead;
  }

  async getLeadsByUserId(userId: number): Promise<Lead[]> {
    return Array.from(this.leads.values()).filter(
      (lead) => lead.userId === userId
    );
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentBlogPostId++;
    const newPost: BlogPost = {
      id,
      authorId: post.authorId,
      title: post.title,
      content: post.content,
      isPublished: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.blogPosts.set(id, newPost);
    return newPost;
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPosts(authorId?: number): Promise<BlogPost[]> {
    const posts = Array.from(this.blogPosts.values());
    return authorId
      ? posts.filter(post => post.authorId === authorId)
      : posts;
  }

  async updateBlogPost(id: number, updates: Partial<BlogPost>): Promise<BlogPost> {
    const post = await this.getBlogPost(id);
    if (!post) throw new Error("Blog post not found");

    const updatedPost: BlogPost = {
      ...post,
      ...updates,
      updatedAt: new Date()
    };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }
}

export const storage = new MemStorage();