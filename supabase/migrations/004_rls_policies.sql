-- Enable Row Level Security on all core tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE rider_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- users: can only read/update own row
-- ============================================================
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (supabase_id = auth.uid());

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (supabase_id = auth.uid());

-- ============================================================
-- user_addresses: own addresses only
-- ============================================================
CREATE POLICY "user_addresses_own" ON user_addresses
  FOR ALL USING (user_id = (SELECT id FROM users WHERE supabase_id = auth.uid()));

-- ============================================================
-- deliveries: customer sees their own, rider sees assigned ones
-- ============================================================
CREATE POLICY "deliveries_customer" ON deliveries
  FOR SELECT USING (
    customer_id = (SELECT id FROM users WHERE supabase_id = auth.uid())
  );

CREATE POLICY "deliveries_rider" ON deliveries
  FOR SELECT USING (
    rider_id = (SELECT id FROM riders WHERE user_id = (SELECT id FROM users WHERE supabase_id = auth.uid()))
  );

CREATE POLICY "deliveries_customer_insert" ON deliveries
  FOR INSERT WITH CHECK (
    customer_id = (SELECT id FROM users WHERE supabase_id = auth.uid())
  );

-- ============================================================
-- wallets: owner only
-- ============================================================
CREATE POLICY "wallets_owner" ON wallets
  FOR SELECT USING (
    owner_id = (SELECT id FROM users WHERE supabase_id = auth.uid())
    OR owner_id = (SELECT id FROM riders WHERE user_id = (SELECT id FROM users WHERE supabase_id = auth.uid()))
  );

-- ============================================================
-- transactions: wallet owner only
-- ============================================================
CREATE POLICY "transactions_owner" ON transactions
  FOR SELECT USING (
    wallet_id IN (
      SELECT id FROM wallets WHERE owner_id = (SELECT id FROM users WHERE supabase_id = auth.uid())
    )
  );

-- ============================================================
-- riders: read own profile
-- ============================================================
CREATE POLICY "riders_self" ON riders
  FOR ALL USING (
    user_id = (SELECT id FROM users WHERE supabase_id = auth.uid())
  );

-- ============================================================
-- notifications: own only
-- ============================================================
CREATE POLICY "notifications_own" ON notifications
  FOR ALL USING (
    user_id = (SELECT id FROM users WHERE supabase_id = auth.uid())
  );

-- ============================================================
-- service role bypasses all RLS (used by NestJS API)
-- ============================================================
-- Service role key always bypasses RLS — no additional policy needed.
-- API uses SUPABASE_SERVICE_ROLE_KEY, which auto-bypasses.
