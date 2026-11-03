import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(currentDir, '../../.env') });

const { Client } = pg;

const getConnectionString = () => {
  const direct = process.env.DATABASE_URL;
  const pooler = 'postgresql://postgres.gpyyrpqbapxbxfrktznb:%23maliha2003%40Supabase%21@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres';
  return pooler || direct;
};

const client = new Client({
  connectionString: getConnectionString(),
  ssl: { rejectUnauthorized: false }
});

const migrationSQL = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  phone VARCHAR(50),
  avatar TEXT,
  bio TEXT,
  location VARCHAR(255),
  skills TEXT[] DEFAULT '{}',
  services_offered TEXT[] DEFAULT '{}',
  hourly_rate NUMERIC DEFAULT 0,
  is_available_now BOOLEAN DEFAULT false,
  verification_status VARCHAR(50) DEFAULT 'Unverified',
  verification_details JSONB DEFAULT '{}'::jsonb,
  reliability_score INTEGER DEFAULT 100,
  rating NUMERIC DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  completed_jobs_count INTEGER DEFAULT 0,
  saved_jobs UUID[] DEFAULT '{}',
  saved_services UUID[] DEFAULT '{}',
  saved_products UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poster_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  budget NUMERIC NOT NULL,
  payment_type VARCHAR(50) DEFAULT 'Fixed',
  location VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'Open',
  urgency VARCHAR(50) DEFAULT 'Normal',
  work_date VARCHAR(100),
  start_time VARCHAR(100),
  expected_duration VARCHAR(100),
  workers_needed INTEGER DEFAULT 1,
  required_skills TEXT[] DEFAULT '{}',
  requirements TEXT[] DEFAULT '{}',
  escrow_funded BOOLEAN DEFAULT false,
  assigned_worker_id UUID REFERENCES users(id) ON DELETE SET NULL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Applications Table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  introduction TEXT NOT NULL,
  proposed_payment NUMERIC,
  experience TEXT,
  status VARCHAR(50) DEFAULT 'Pending',
  proof_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Services Table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  pricing_model VARCHAR(50) DEFAULT 'Hourly',
  starting_price NUMERIC NOT NULL,
  portfolio_images TEXT[] DEFAULT '{}',
  location VARCHAR(255) NOT NULL,
  availability VARCHAR(100),
  rating NUMERIC DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Quotes Table
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  requirements TEXT NOT NULL,
  budget NUMERIC,
  preferred_date VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  price NUMERIC NOT NULL,
  condition VARCHAR(50) NOT NULL,
  images TEXT[] DEFAULT '{}',
  location VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'Available',
  buyer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Free Items Table
CREATE TABLE IF NOT EXISTS free_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  giver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  condition VARCHAR(50) NOT NULL,
  images TEXT[] DEFAULT '{}',
  location VARCHAR(255) NOT NULL,
  pickup_instructions TEXT,
  status VARCHAR(50) DEFAULT 'Available',
  recipient_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Favourites Table
CREATE TABLE IF NOT EXISTS favourites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL,
  post_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_user_post_type UNIQUE (user_id, post_id, post_type)
);

-- 9. Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  currency VARCHAR(10) DEFAULT 'BDT',
  payment_method VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending',
  transaction_id VARCHAR(255) UNIQUE NOT NULL,
  purpose VARCHAR(50) NOT NULL,
  related_job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  related_service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  related_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  payment_details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Proof Records Table
CREATE TABLE IF NOT EXISTS proof_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  poster_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  before_photos TEXT[] DEFAULT '{}',
  after_photos TEXT[] DEFAULT '{}',
  documents TEXT[] DEFAULT '{}',
  notes TEXT,
  status VARCHAR(50) DEFAULT 'Submitted',
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  signature_hash VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type VARCHAR(50) NOT NULL,
  target_id UUID NOT NULL,
  rating NUMERIC NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participants UUID[] NOT NULL,
  last_message_text TEXT,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  unread_counts JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  read_by UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'system',
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Reports Table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type VARCHAR(50) NOT NULL,
  target_id UUID NOT NULL,
  reason VARCHAR(255) NOT NULL,
  details TEXT,
  status VARCHAR(50) DEFAULT 'Pending',
  resolution_notes TEXT,
  resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(255) NOT NULL,
  performed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  target_type VARCHAR(100),
  target_id VARCHAR(255),
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Website Settings Table
CREATE TABLE IF NOT EXISTS website_settings (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'current',
  general JSONB DEFAULT '{}'::jsonb,
  theme JSONB DEFAULT '{}'::jsonb,
  content JSONB DEFAULT '{}'::jsonb,
  last_updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
DO $$ 
DECLARE
  tbl text;
BEGIN
  FOR tbl IN 
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
    AND tablename IN (
      'users', 'jobs', 'applications', 'services', 'quotes', 
      'products', 'free_items', 'favourites', 'payments', 
      'proof_records', 'reviews', 'conversations', 'messages', 
      'notifications', 'reports', 'audit_logs', 'website_settings'
    )
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Service role full access" ON public.%I;', tbl);
    EXECUTE format('CREATE POLICY "Service role full access" ON public.%I FOR ALL USING (true) WITH CHECK (true);', tbl);
  END LOOP;
END $$;
`;

const runMigration = async () => {
  try {
    console.log('Connecting to Supabase PostgreSQL database...');
    await client.connect();
    console.log('Connected successfully!');

    console.log('Executing 17 table migrations with RLS policies...');
    await client.query(migrationSQL);
    console.log('✅ Successfully created all 17 tables and enabled RLS policies!');

    // Verify tables exist in public schema
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('\nVerified Public Tables in Supabase:');
    res.rows.forEach((row, i) => {
      console.log(`  ${i + 1}. ${row.table_name}`);
    });

  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
};

runMigration();
