-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis" VERSION '3.3.2';
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Verify
SELECT extname, extversion FROM pg_extension WHERE extname IN ('uuid-ossp', 'postgis', 'pg_trgm');
