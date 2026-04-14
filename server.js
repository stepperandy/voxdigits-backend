const express = require("express");
const cors = require("cors");
const twilio = require("twilio");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("VoxDigits backend is live");
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/test", (req, res) => {
  res.json({ ok: true, message: "test route working" });
});

app.get("/api/twilio/token", (req, res) => {
  try {
    const {
      TWILIO_ACCOUNT_SID,
      TWILIO_API_KEY,
      TWILIO_API_SECRET,
      TWILIO_TWIML_APP_SID,
    } = process.env;

    if (!TWILIO_ACCOUNT_SID) {
      return res.status(500).json({ error: "Missing TWILIO_ACCOUNT_SID" });
    }

    if (!TWILIO_API_KEY) {
      return res.status(500).json({ error: "Missing TWILIO_API_KEY" });
    }

    if (!TWILIO_API_SECRET) {
      return res.status(500).json({ error: "Missing TWILIO_API_SECRET" });
    }

    if (!TWILIO_TWIML_APP_SID) {
      return res.status(500).json({ error: "Missing TWILIO_TWIML_APP_SID" });
    }

    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    const identity = req.query.identity || "user";

    const token = new AccessToken(
      TWILIO_ACCOUNT_SID,
      TWILIO_API_KEY,
      TWILIO_API_SECRET,
      { identity }
    );

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: TWILIO_TWIML_APP_SID,
      incomingAllow: true,
    });

    token.addGrant(voiceGrant);

    return res.json({
      ok: true,
      token: token.toJwt(),
      identity,
    });
  } catch (err) {
    console.error("TWILIO TOKEN ERROR:", err);
    return res.status(500).json({
      error: err.message || "Unknown Twilio token error",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
