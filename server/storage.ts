import { users, leads, type User, type Lead, type InsertUser } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  addCredits(userId: number, amount: number): Promise<User>;
  createLead(lead: Omit<Lead, "id" | "createdAt">): Promise<Lead>;
  getLeadsByUserId(userId: number): Promise<Lead[]>;
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private leads: Map<number, Lead>;
  private currentUserId: number;
  private currentLeadId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.leads = new Map();
    this.currentUserId = 1;
    this.currentLeadId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      credits: 0,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async addCredits(userId: number, amount: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = {
      ...user,
      credits: user.credits + amount
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
}

export const storage = new MemStorage();
