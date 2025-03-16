import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
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
  // Business information
  companyName: text("company_name"),
  vatId: text("vat_id"),
  // Billing address
  street: text("street"),
  city: text("city"),
  postalCode: text("postal_code"),
  country: text("country"),
  // Stripe information
  stripeCustomerId: text("stripe_customer_id"),
});

// Neue Tabelle für die Suchen
export const searches = pgTable("searches", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  query: text("query").notNull(),
  location: text("location").notNull(),
  count: integer("count").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  searchId: integer("search_id"), // Machen wir nullable
  businessName: text("business_name").notNull(),
  address: text("address").notNull(),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  category: text("category"),
  metadata: json("metadata"),
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

// Base user schema for validation
const baseUserSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen lang sein")
    .regex(/[A-Z]/, "Passwort muss mindestens einen Großbuchstaben enthalten")
    .regex(/[0-9]/, "Passwort muss mindestens eine Zahl enthalten"),
});

// Login schema
export const loginSchema = baseUserSchema;

// Registration schema with password confirmation
export const insertUserSchema = baseUserSchema.extend({
  passwordConfirm: z.string()
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwörter stimmen nicht überein",
  path: ["passwordConfirm"],
});

// Business information schema
export const businessInfoSchema = z.object({
  companyName: z.string().min(1, "Firmenname ist erforderlich"),
  vatId: z.string().optional(),
  street: z.string().min(1, "Straße ist erforderlich"),
  city: z.string().min(1, "Stadt ist erforderlich"),
  postalCode: z.string().min(4, "PLZ muss mindestens 4 Zeichen lang sein"),
  country: z.string().refine(
    (val) => ["DE", "AT", "CH"].includes(val),
    "Land muss Deutschland, Österreich oder Schweiz sein"
  )
});

export const insertLeadSchema = createInsertSchema(leads);

export const insertBlogPostSchema = z.object({
  title: z.string().min(5, "Titel muss mindestens 5 Zeichen lang sein"),
  content: z.string().min(50, "Inhalt muss mindestens 50 Zeichen lang sein"),
  authorId: z.number()
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BusinessInfo = z.infer<typeof businessInfoSchema>;
// Neue Types für die Suchen
export type Search = typeof searches.$inferSelect;
export type InsertSearch = typeof searches.$inferInsert;

export type InsertLead = typeof leads.$inferInsert;