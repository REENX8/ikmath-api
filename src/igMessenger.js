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

async function sendMessage(recipientId, msg) {
  await axios.post(
    `${metaApiUrl}/me/messages`,
    {
      recipient: { id: recipientId },
      message: buildMessagePayload(msg),
    },
    { params: { access_token: pageAccessToken } }
  );
}

async function sendAutoReplies(recipientId, messages) {
  for (const msg of messages) {
    await sendMessage(recipientId, msg);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

module.exports = { sendMessage, sendAutoReplies };
