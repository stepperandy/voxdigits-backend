const express = require("express");
const cors = require("cors");
require("dotenv").config();
const twilio = require("twilio");

const app = express();

app.use(cors({
  origin: "*"
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("VoxDigits backend is live");
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Railway backend connected successfully"
  });
});

// 🔥 TWILIO TOKEN ENDPOINT
app.get("/api/twilio/token", (req, res) => {
  try {
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_KEY,
      process.env.TWILIO_API_SECRET,
      { identity: "user" }
    );

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
      incomingAllow: true
    });

    token.addGrant(voiceGrant);

    res.json({
      token: token.toJwt()
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Token generation failed" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
