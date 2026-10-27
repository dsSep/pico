CREATE TABLE `demo_events` (
	`event_id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`event_type` text NOT NULL,
	`scenario_id` text NOT NULL,
	`run_id` text NOT NULL,
	`execution_mode` text NOT NULL,
	`run_status` text NOT NULL,
	`duration_ms` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `events_created` ON `demo_events` (`created_at`);--> statement-breakpoint
CREATE INDEX `events_session` ON `demo_events` (`session_id`,`created_at`);