-- Add PostGIS geometry column to pricing_zones for polygon-based zone lookup
ALTER TABLE pricing_zones
  ADD COLUMN IF NOT EXISTS geometry GEOGRAPHY(POLYGON, 4326);

-- Spatial index
CREATE INDEX IF NOT EXISTS idx_pricing_zones_geometry
  ON pricing_zones USING GIST (geometry);

-- Seed Cotonou zone geometry (approximate bounding polygon)
-- Real coordinates should be set via admin UI or migration after zone design
UPDATE pricing_zones
SET geometry = ST_GeomFromText(
  'POLYGON((
    2.2800 6.3200,
    2.4200 6.3200,
    2.4200 6.4200,
    2.2800 6.4200,
    2.2800 6.3200
  ))',
  4326
)::geography
WHERE slug = 'cotonou-centre';

-- Add geometry to service_zones too
ALTER TABLE service_zones
  ADD COLUMN IF NOT EXISTS boundary GEOGRAPHY(POLYGON, 4326);

CREATE INDEX IF NOT EXISTS idx_service_zones_boundary
  ON service_zones USING GIST (boundary);
