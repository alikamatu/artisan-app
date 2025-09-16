export default () => ({
  port: parseInt(process.env.PORT || '1000', 10),
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  nodeEnv: process.env.NODE_ENV || 'development',
});
