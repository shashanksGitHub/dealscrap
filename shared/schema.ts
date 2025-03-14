import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  credits: integer("credits").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  businessName: text("business_name").notNull(),
  address: text("address").notNull(),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  category: text("category"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").notNull(),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
}).extend({
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen lang sein")
    .regex(/[A-Z]/, "Passwort muss mindestens einen Großbuchstaben enthalten")
    .regex(/[0-9]/, "Passwort muss mindestens eine Zahl enthalten"),
  passwordConfirm: z.string(),
  email: z.string().email("Ungültige E-Mail-Adresse"),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwörter stimmen nicht überein",
  path: ["passwordConfirm"],
});

export const insertLeadSchema = createInsertSchema(leads);

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  content: true,
  authorId: true,
}).extend({
  title: z.string().min(5, "Titel muss mindestens 5 Zeichen lang sein"),
  content: z.string().min(50, "Inhalt muss mindestens 50 Zeichen lang sein"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;