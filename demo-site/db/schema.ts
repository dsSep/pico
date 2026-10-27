// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import {sqliteTable,text,integer,index} from 'drizzle-orm/sqlite-core';
export const demoEvents=sqliteTable('demo_events',{
 eventId:text('event_id').primaryKey(), sessionId:text('session_id').notNull(),
 eventType:text('event_type').notNull(),scenarioId:text('scenario_id').notNull(),
 runId:text('run_id').notNull(),executionMode:text('execution_mode').notNull(),
 runStatus:text('run_status').notNull(),durationMs:integer('duration_ms').notNull(),
 createdAt:integer('created_at').notNull(),
},t=>[index('events_created').on(t.createdAt),index('events_session').on(t.sessionId,t.createdAt)]);
