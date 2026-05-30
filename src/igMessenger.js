const axios = require('axios');
const { pageAccessToken, metaApiUrl } = require('./config');

async function sendMessage(recipientId, text) {
  await axios.post(
    `${metaApiUrl}/me/messages`,
    {
      recipient: { id: recipientId },
      message: { text },
    },
    {
      params: { access_token: pageAccessToken },
    }
  );
}

async function sendAutoReplies(recipientId, messages) {
  for (const text of messages) {
    await sendMessage(recipientId, text);
    // หน่วงเล็กน้อยเพื่อให้ข้อความมาตามลำดับ
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

module.exports = { sendMessage, sendAutoReplies };
