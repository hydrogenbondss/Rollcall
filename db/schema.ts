import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
  int,
} from "drizzle-orm/mysql-core";

// Specimen submissions from the community
export const submissions = mysqlTable("submissions", {
  id: serial("id").primaryKey(),
  brand: varchar("brand", { length: 255 }).notNull(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  city: varchar("city", { length: 100 }),
  ply: int("ply"),
  scent: varchar("scent", { length: 255 }),
  material: varchar("material", { length: 255 }),
  priceLocal: varchar("price_local", { length: 100 }),
  currency: varchar("currency", { length: 10 }),
  retailer: varchar("retailer", { length: 255 }),
  notes: text("notes"),
  contributorName: varchar("contributor_name", { length: 255 }),
  contributorEmail: varchar("contributor_email", { length: 255 }),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Contact / correspondence messages
export const messages = mysqlTable("messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
