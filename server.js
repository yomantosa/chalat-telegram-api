// server.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors"

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["POST", "GET"],
}));

app.post("/send", async (req, res) => {
  try {
    const { name, phone, details } = req.body;

    if (!name || !phone || !details) {
      return res.status(400).json({ ok: false, error: "Missing fields" });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const message = `📦 *New Order Received*\n\n👤 Name: ${name}\n📱 WhatsApp: ${phone}\n🧋 Order: ${details}`;
    const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;

    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ ok: false, error: text });
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Telegram API running on port ${PORT}`));
