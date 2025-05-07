import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';


export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    name: text('name').notNull(),
    passwordHash: text('password_hash').notNull(),
    createdAt: integer('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const posts = sqliteTable('posts', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    author: text('author'),
    bannerImg: text('banner_img'),
    content: text('content').notNull(),
    likes: integer('likes').notNull().default(0),
    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    tags: text('tags').notNull().default('[]'),
    description: text('description').notNull().default(''),
    route: text('route').notNull().default(''),
});

export const comments = sqliteTable('comments', {
    id: text('id').primaryKey(),
    content: text('content').notNull(),
    fname: text('fname'),
    lname: text('lname'),
    email: text('email').notNull(),
    userId: text('user_id').notNull(),
    postId: text('post_id').references(() => posts.id).notNull(),
    createdAt: integer('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});


export const media = sqliteTable('media', {
    id: text('id').primaryKey(),
    path: text('path').notNull().unique(),
    url: text('url').notNull(),
    createdAt: integer('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const ratings = sqliteTable('ratings', {
    id: text('id').primaryKey(),
    postId: text('post_id').references(() => posts.id).notNull(),
    userId: text('user_id').notNull(),
    rating: integer('rating').notNull(),
    createdAt: integer('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});