const { sendAutoReplies } = require('./igMessenger');
const AUTO_REPLY_MESSAGES = require('./autoReplyMessages');
const supabase = require('./supabase');

async function hasReplied(senderId) {
  const { data } = await supabase
    .from('replied_senders')
    .select('sender_id')
    .eq('sender_id', senderId)
    .maybeSingle();
  return !!data;
}

async function markReplied(senderId) {
  await supabase.from('replied_senders').insert({ sender_id: senderId });
}

async function logReply(senderId, status, messagesSent, error = null) {
  await supabase.from('reply_logs').insert({ sender_id: senderId, status, messages_sent: messagesSent, error });
}

async function handleWebhook(body) {
  if (body.object !== 'instagram') return;

  for (const entry of body.entry ?? []) {
    for (const event of entry.messaging ?? []) {
      const senderId = event.sender?.id;
      const igUserId = event.recipient?.id;

      if (!event.message || senderId === igUserId) continue;

      if (!(await hasReplied(senderId))) {
        await markReplied(senderId);
        try {
          const result = await sendAutoReplies(senderId, AUTO_REPLY_MESSAGES);
          await logReply(senderId, 'success', result.messagesSent);
          console.log(`[Auto Reply] sent to ${senderId} (${result.messagesSent} messages)`);
        } catch (err) {
          const errMsg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
          await logReply(senderId, 'failed', 0, errMsg);
          console.error(`[Auto Reply] failed for ${senderId}:`, errMsg);
        }
      }
    }
  }
}

module.exports = { handleWebhook };
