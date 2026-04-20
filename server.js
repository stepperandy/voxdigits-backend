const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// 🔐 Dummy users (we upgrade later)
const users = [
  { id: 1, email: "admin@voxvpn.com", password: "123456" }
];

// 🌍 VPN SERVERS (ADD MORE HERE)
const servers = [
  {
    id: 1,
    name: "London",
    ip: "45.76.133.13",
    country: "UK"
  }
];

// 🔑 GENERATE WIREGUARD CONFIG
function generateConfig(server) {
  return `
[Interface]
PrivateKey = WCJ9BJDw/R8dIjttKftW76a25R17AaElHizQW+aIcXY=
Address = 10.8.0.2/32
DNS = 1.1.1.1

[Peer]
PublicKey = gjXu3inhcpjJd8X6nRnoRlVe+e9mJdaB6m9/MY2ucHA=
Endpoint = ${server.ip}:443
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25
`;
}

// =========================
// 🔐 LOGIN
// =========================
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid login" });
  }

  res.json({
    message: "Login successful",
    token: "fake-jwt-token"
  });
});

// =========================
// 🌍 GET SERVERS
// =========================
app.get('/servers', (req, res) => {
  res.json(servers);
});

// =========================
// ⚡ GET CONFIG
// =========================
app.get('/connect/:serverId', (req, res) => {
  const server = servers.find(s => s.id == req.params.serverId);

  if (!server) {
    return res.status(404).json({ error: 'Server not found' });
  }

  const config = generateConfig(server);

  const filePath = path.join(__dirname, 'client.conf');
  fs.writeFileSync(filePath, config);

  res.json({
    message: 'Config generated',
    configPath: filePath,
    config: config
  });
});

// =========================
// 🚀 START SERVER
// =========================
app.listen(PORT, () => {
  console.log(`VoxVPN Backend running on http://localhost:${PORT}`);
});