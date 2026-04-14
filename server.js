const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ ok: true, message: "NEW VERSION LIVE" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("NEW VERSION LIVE");
});
