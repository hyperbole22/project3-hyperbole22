const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'klsullivan03@gmail.com',
    pass: process.env.GMAIL_PASS,
  },
});

app.post('/send', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    await transporter.sendMail({
      from: 'klsullivan03@gmail.com',
      to: 'klsullivan03@gmail.com',
      subject: `Portfolio contact from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));