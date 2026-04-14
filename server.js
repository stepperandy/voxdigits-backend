const express = require("express");
const cors = require("cors");
const twilio = require("twilio");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("VoxDigits backend is live");
});

app.get("/", (req, res) => {
  res.send("VOXDIGITS NEW SERVER CHECK");
});
app.get("/api/twilio/token", (req, res) => {
  try {
    const {
      TWILIO_ACCOUNT_SID,
      TWILIO_API_KEY,
      TWILIO_API_SECRET,
      TWILIO_TWIML_APP_SID,
    } = process.env;

    res.json({
      ok: true,
      seen: {
        TWILIO_ACCOUNT_SID: !!TWILIO_ACCOUNT_SID,
        TWILIO_API_KEY: !!TWILIO_API_KEY,
        TWILIO_API_SECRET: !!TWILIO_API_SECRET,
        TWILIO_TWIML_APP_SID: !!TWILIO_TWIML_APP_SID,
      },
      values: {
        accountSidPrefix: TWILIO_ACCOUNT_SID ? TWILIO_ACCOUNT_SID.slice(0, 2) : null,
        apiKeyPrefix: TWILIO_API_KEY ? TWILIO_API_KEY.slice(0, 2) : null,
        twimlAppPrefix: TWILIO_TWIML_APP_SID ? TWILIO_TWIML_APP_SID.slice(0, 2) : null,
      }
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message,
      stack: err.stack
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
