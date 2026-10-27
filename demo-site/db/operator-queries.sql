-- Run only through the owner-restricted Sites database console. No HTTP read endpoint.
SELECT scenario_id, event_type, count(*) AS event_count
FROM demo_events GROUP BY scenario_id,event_type;

SELECT date(created_at / 1000, 'unixepoch') AS day, scenario_id, event_type, count(*) AS event_count
FROM demo_events GROUP BY day,scenario_id,event_type ORDER BY day DESC;

-- Strict retention: run daily, including when the website receives no writes.
DELETE FROM demo_events WHERE created_at < (unixepoch() * 1000 - 2592000000);
