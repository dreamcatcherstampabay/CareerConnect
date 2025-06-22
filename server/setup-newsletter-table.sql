-- Create newsletter subscriptions table in Supabase
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  preferences JSONB
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscriptions(is_active);

-- Grant permissions for the service role
GRANT ALL ON newsletter_subscriptions TO service_role;
GRANT USAGE, SELECT ON SEQUENCE newsletter_subscriptions_id_seq TO service_role;