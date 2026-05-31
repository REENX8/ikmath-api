require('dotenv').config();

module.exports = {
  verifyToken: process.env.VERIFY_TOKEN,
  pageAccessToken: process.env.PAGE_ACCESS_TOKEN,
  igUserId: process.env.IG_USER_ID,
  port: process.env.PORT || 3000,
  metaApiUrl: 'https://graph.facebook.com/v21.0',
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_ANON_KEY,
};
