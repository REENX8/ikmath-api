// แต่ละ object คือ 1 ข้อความ — type: 'text' | 'image' | 'emoji'
const AUTO_REPLY_MESSAGES = [
  {
    type: 'text',
    content: 'สวัสดีครับ! ขอบคุณที่ทักมานะครับ ตอนนี้ไม่อยู่ จะรีบตอบกลับโดยเร็วที่สุดเลยครับ',
  },
  {
    type: 'image',
    content: 'https://raw.githubusercontent.com/reenx8/ikmath-api/main/ikmath.jpg',
  },
  {
    type: 'emoji',
    content: '🙏😊✨',
  },
];

module.exports = AUTO_REPLY_MESSAGES;
