const { sendAutoReplies } = require('./igMessenger');
const AUTO_REPLY_MESSAGES = require('./autoReplyMessages');

// เก็บ senderId ที่เคยรับ auto reply ไปแล้ว (in-memory)
// ถ้าต้องการ persistent ให้เปลี่ยนไปใช้ DB
const repliedSenders = new Set();

async function handleWebhook(body) {
  if (body.object !== 'instagram') return;

  for (const entry of body.entry ?? []) {
    for (const event of entry.messaging ?? []) {
      const senderId = event.sender?.id;
      const igUserId = event.recipient?.id;

      // ข้ามถ้าไม่มี message หรือเป็นข้อความจากบัญชีตัวเอง
      if (!event.message || senderId === igUserId) continue;

      // ส่ง auto reply เฉพาะข้อความแรกของแต่ละคน
      if (!repliedSenders.has(senderId)) {
        repliedSenders.add(senderId);
        await sendAutoReplies(senderId, AUTO_REPLY_MESSAGES);
        console.log(`[Auto Reply] sent to ${senderId}`);
      }
    }
  }
}

module.exports = { handleWebhook };
