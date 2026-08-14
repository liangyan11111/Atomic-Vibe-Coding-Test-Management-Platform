import { pgTable, serial, timestamp, index, varchar, text, foreignKey, jsonb } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const vibeSessions = pgTable("vibe_sessions", {
	id: varchar({ length: 36 }).default(sql`gen_random_uuid()`).primaryKey().notNull(),
	title: text().default('New Conversation').notNull(),
	status: varchar({ length: 20 }).default('active').notNull(),
	modulePath: text("module_path"),
	modelUsed: text("model_used"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("vibe_sessions_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("vibe_sessions_updated_at_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
]);

export const vibeVersions = pgTable("vibe_versions", {
	id: varchar({ length: 36 }).default(sql`gen_random_uuid()`).primaryKey().notNull(),
	sessionId: varchar("session_id", { length: 36 }).notNull(),
	version: varchar({ length: 50 }).notNull(),
	description: text().default('').notNull(),
	status: varchar({ length: 20 }).default('draft').notNull(),
	parentVersionId: varchar("parent_version_id", { length: 36 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("vibe_versions_session_id_idx").using("btree", table.sessionId.asc().nullsLast().op("text_ops")),
	index("vibe_versions_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.sessionId],
			foreignColumns: [vibeSessions.id],
			name: "vibe_versions_session_id_vibe_sessions_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.parentVersionId],
			foreignColumns: [table.id],
			name: "vibe_versions_parent_version_id_vibe_versions_id_fk"
		}),
]);

export const vibeMessages = pgTable("vibe_messages", {
	id: varchar({ length: 36 }).default(sql`gen_random_uuid()`).primaryKey().notNull(),
	sessionId: varchar("session_id", { length: 36 }).notNull(),
	role: varchar({ length: 20 }).notNull(),
	content: text().notNull(),
	attachments: jsonb(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("vibe_messages_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("vibe_messages_session_id_idx").using("btree", table.sessionId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.sessionId],
			foreignColumns: [vibeSessions.id],
			name: "vibe_messages_session_id_vibe_sessions_id_fk"
		}).onDelete("cascade"),
]);

export const vibeFileChanges = pgTable("vibe_file_changes", {
	id: varchar({ length: 36 }).default(sql`gen_random_uuid()`).primaryKey().notNull(),
	versionId: varchar("version_id", { length: 36 }).notNull(),
	filePath: text("file_path").notNull(),
	action: varchar({ length: 20 }).notNull(),
	beforeContent: text("before_content"),
	afterContent: text("after_content").default('').notNull(),
	diff: text(),
	language: varchar({ length: 50 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("vibe_file_changes_version_id_idx").using("btree", table.versionId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.versionId],
			foreignColumns: [vibeVersions.id],
			name: "vibe_file_changes_version_id_vibe_versions_id_fk"
		}).onDelete("cascade"),
]);
