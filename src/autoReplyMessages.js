// แต่ละ object คือ 1 ข้อความ — type: 'text' | 'image' | 'emoji'
const AUTO_REPLY_MESSAGES = [
  {
    type: 'text',
    content: 'สวัสดีครับ! ขอบคุณที่ทักมานะครับ ตอนนี้ไม่อยู่ จะรีบตอบกลับโดยเร็วที่สุดเลยครับ',
  },
  {
    type: 'image',
    content: 'https://your-image-url.com/welcome.jpg', // เปลี่ยนเป็น URL รูปที่ต้องการ
  },
  {
    type: 'emoji',
    content: '🙏😊✨',
  },
];

module.exports = AUTO_REPLY_MESSAGES;
