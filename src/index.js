const express = require('express');
const { verifyToken, port } = require('./config');
const { handleWebhook } = require('./webhookHandler');
const supabase = require('./supabase');

const app = express();
app.use(express.json());

// Webhook verification (Meta จะ GET มาตอน setup)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('Webhook verified');
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

// รับ webhook events จาก Meta
app.post('/webhook', async (req, res) => {
  // ตอบ 200 ก่อนเสมอเพื่อไม่ให้ Meta retry
  res.sendStatus(200);
  try {
    await handleWebhook(req.body);
  } catch (err) {
    console.error('Webhook handler error:', err.response?.data ?? err.message);
  }
});

app.get('/stats', async (req, res) => {
  try {
    const [{ count: totalUsers }, { count: totalSuccess }, { count: totalFailed }, { data: recent }] =
      await Promise.all([
        supabase.from('replied_senders').select('*', { count: 'exact', head: true }),
        supabase.from('reply_logs').select('*', { count: 'exact', head: true }).eq('status', 'success'),
        supabase.from('reply_logs').select('*', { count: 'exact', head: true }).eq('status', 'failed'),
        supabase.from('reply_logs').select('*').order('created_at', { ascending: false }).limit(10),
      ]);
    res.json({ totalUsers, totalSuccess, totalFailed, recent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`IG Auto Reply server running on port ${port}`);
});
