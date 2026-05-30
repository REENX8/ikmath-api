const { sendAutoReplies } = require('./igMessenger');
const AUTO_REPLY_MESSAGES = require('./autoReplyMessages');
const { hasReplied, markReplied } = require('./supabaseClient');

async function handleWebhook(body) {
  if (body.object !== 'instagram') return;

  for (const entry of body.entry ?? []) {
    for (const event of entry.messaging ?? []) {
      const senderId = event.sender?.id;
      const igUserId = event.recipient?.id;

      if (!event.message || senderId === igUserId) continue;

      if (!(await hasReplied(senderId))) {
        await markReplied(senderId);
        await sendAutoReplies(senderId, AUTO_REPLY_MESSAGES);
        console.log(`[Auto Reply] sent to ${senderId}`);
      }
    }
  }
}

module.exports = { handleWebhook };
