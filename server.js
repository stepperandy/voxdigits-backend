import Fastify from "fastify";
import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();

const app = Fastify();
app.register(import("@fastify/formbody").then(m => m.default));

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;
const twimlAppSid = process.env.TWIML_APP_SID;

app.get("/token", async (req, reply) => {
  const identity = req.query.identity || "aagble_gmail_com";

  const AccessToken = twilio.jwt.AccessToken;
  const VoiceGrant = AccessToken.VoiceGrant;

  const token = new AccessToken(accountSid, apiKey, apiSecret, {
    identity,
  });

  const grant = new VoiceGrant({
    outgoingApplicationSid: twimlAppSid,
    incomingAllow: true,
  });

  token.addGrant(grant);

  return { token: token.toJwt() };
});

app.post("/voice", async (req, reply) => {
  const twiml = new twilio.twiml.VoiceResponse();
  const to = req.body?.To || "";
  const from = req.body?.From || "";

  if (String(from).startsWith("client:")) {
    twiml.dial({ callerId: process.env.TWILIO_NUMBER }).number(to);
  } else {
    twiml.dial().client("aagble_gmail_com");
  }

  reply.type("text/xml");
  return twiml.toString();
});

app.get("/", async () => {
  return { ok: true };
});

app.listen({ port: 3000, host: "0.0.0.0" });
