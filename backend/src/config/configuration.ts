export default () => ({
  port: parseInt(process.env.PORT || '1000', 10),
  database: {
    url: process.env.DB_URL,
  },
  nodeEnv: process.env.NODE_ENV || 'development',
});
