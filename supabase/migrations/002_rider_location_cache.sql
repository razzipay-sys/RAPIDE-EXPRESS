-- Real-time rider position cache (synced from Redis via TrackingService)
-- This table holds only the current position — full history is in rider_location_history
CREATE TABLE IF NOT EXISTS rider_location_cache (
  rider_id   UUID PRIMARY KEY REFERENCES riders(id) ON DELETE CASCADE,
  latitude   DECIMAL(10, 8) NOT NULL,
  longitude  DECIMAL(11, 8) NOT NULL,
  heading    FLOAT,
  speed      FLOAT,
  accuracy   FLOAT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Spatial index for fast ST_DWithin proximity queries
CREATE INDEX IF NOT EXISTS idx_rider_location_cache_geom
  ON rider_location_cache
  USING GIST (ST_MakePoint(longitude, latitude)::geography);

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_rider_location_cache_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_rider_location_cache_updated_at
  BEFORE UPDATE ON rider_location_cache
  FOR EACH ROW EXECUTE FUNCTION update_rider_location_cache_timestamp();
