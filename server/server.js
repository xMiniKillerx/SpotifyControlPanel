const express = require("express");
const cors = require("cors");
const { WebSocketServer } = require("ws");

const HTTP_PORT = 7070; 
const WS_PORT = 7071;   


let lastStatus = null;
let bridgeSocket = null;

const wss = new WebSocketServer({ port: WS_PORT, host: "192.168.1.104" });
wss.on("connection", (ws) => {
  bridgeSocket = ws;
  console.log("[Server] Bridge conectado (Spicetify)");

  ws.on("message", (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.type === "status") {
        lastStatus = msg.data;
      }
    } catch (e) {
      console.error("WS parse error:", e.message);
    }
  });

  ws.on("close", () => {
    console.log("[Server] Bridge desconectado");
    bridgeSocket = null;
  });
});

function sendCmd(cmd, payload = {}) {
  if (!bridgeSocket || bridgeSocket.readyState !== 1) {
    throw new Error("Bridge no conectado");
  }
  bridgeSocket.send(JSON.stringify({ type: "cmd", cmd, payload }));
}

const app = express();
app.use(cors());

app.get("/play", (_req, res) => {
  try { sendCmd("play"); res.send("OK"); } catch (e) { res.status(500).send(e.message); }
});
app.get("/pause", (_req, res) => {
  try { sendCmd("pause"); res.send("OK"); } catch (e) { res.status(500).send(e.message); }
});
app.get("/next", (_req, res) => {
  try { sendCmd("next"); res.send("OK"); } catch (e) { res.status(500).send(e.message); }
});
app.get("/previous", (_req, res) => {
  try { sendCmd("previous"); res.send("OK"); } catch (e) { res.status(500).send(e.message); }
});
app.get("/volume/:val", (req, res) => {
  const val = Number(req.params.val);
  try { sendCmd("setVolume", { value: val }); res.send("OK"); } catch (e) { res.status(500).send(e.message); }
});
app.get("/status", (_req, res) => {
  res.json(lastStatus || {
    isPlaying: false, progressMs: 0, durationMs: 0,
    title: "", artist: "", album: "", cover: "", volume: 50
  });
});
app.listen(HTTP_PORT, "192.168.1.104", () => {
  console.log(`[Server] HTTP en http://192.168.1.104:${HTTP_PORT}`);
  console.log(`[Server] WS en   ws://192.168.1.104:${WS_PORT}`);
});