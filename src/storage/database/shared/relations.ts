import { relations } from "drizzle-orm/relations";
import { vibeSessions, vibeVersions, vibeMessages, vibeFileChanges } from "./schema";

export const vibeVersionsRelations = relations(vibeVersions, ({one, many}) => ({
	vibeSession: one(vibeSessions, {
		fields: [vibeVersions.sessionId],
		references: [vibeSessions.id]
	}),
	vibeVersion: one(vibeVersions, {
		fields: [vibeVersions.parentVersionId],
		references: [vibeVersions.id],
		relationName: "vibeVersions_parentVersionId_vibeVersions_id"
	}),
	vibeVersions: many(vibeVersions, {
		relationName: "vibeVersions_parentVersionId_vibeVersions_id"
	}),
	vibeFileChanges: many(vibeFileChanges),
}));

export const vibeSessionsRelations = relations(vibeSessions, ({many}) => ({
	vibeVersions: many(vibeVersions),
	vibeMessages: many(vibeMessages),
}));

export const vibeMessagesRelations = relations(vibeMessages, ({one}) => ({
	vibeSession: one(vibeSessions, {
		fields: [vibeMessages.sessionId],
		references: [vibeSessions.id]
	}),
}));

export const vibeFileChangesRelations = relations(vibeFileChanges, ({one}) => ({
	vibeVersion: one(vibeVersions, {
		fields: [vibeFileChanges.versionId],
		references: [vibeVersions.id]
	}),
}));