const axios = require('axios');
const { pageAccessToken, metaApiUrl } = require('./config');

function buildMessagePayload(msg) {
  if (msg.type === 'image') {
    return {
      attachment: {
        type: 'image',
        payload: { url: msg.content, is_reusable: true },
      },
    };
  }
  // 'text' และ 'emoji' ส่งเหมือนกันคือ text field
  return { text: msg.content };
}

async function sendMessage(recipientId, msg, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await axios.post(
        `${metaApiUrl}/me/messages`,
        {
          recipient: { id: recipientId },
          message: buildMessagePayload(msg),
        },
        { params: { access_token: pageAccessToken } }
      );
      return;
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
}

async function sendAutoReplies(recipientId, messages) {
  let sent = 0;
  for (const msg of messages) {
    await sendMessage(recipientId, msg);
    sent++;
    await new Promise((r) => setTimeout(r, 500));
  }
  return { messagesSent: sent };
}

module.exports = { sendMessage, sendAutoReplies };
