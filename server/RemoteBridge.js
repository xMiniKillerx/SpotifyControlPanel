// RemoteBridge.js

(function RemoteBridge() {
  const SERVER_WS = "ws://192.168.1.104:7071";

  function log(msg) {
    console.log("[RemoteBridge]", msg);
  }

  function getState() {
    const track = Spicetify.Player?.data?.track;
    const isPlaying = !!Spicetify.Player?.isPlaying;
    const progressMs = Spicetify.Player?.getProgress?.() ?? 0;
    const volume = Spicetify.Player?.getVolume?.() ?? 50;

    return {
      isPlaying,
      progressMs,
      durationMs: track?.duration ?? 0,
      title: track?.name ?? "",
      artist: track?.artistName ?? "",
      album: track?.albumName ?? "",
      cover: track?.albumCoverUrl ?? "",
      volume
    };
  }

  async function execCommand(cmd, payload) {
    try {
      switch (cmd) {
        case "play": return Spicetify.Player.play();
        case "pause": return Spicetify.Player.pause();
        case "next": return Spicetify.Player.next();
        case "previous": return Spicetify.Player.back();
        case "setVolume": return Spicetify.Player.setVolume(Number(payload?.value) || 0);
        default: log(`Comando desconocido: ${cmd}`);
      }
    } catch (e) {
      log(`Error ejecutando ${cmd}: ${e.message}`);
    }
  }

  function connect() {
    const ws = new WebSocket(SERVER_WS);

    ws.onopen = () => {
      log("WS conectado");
      ws.send(JSON.stringify({ type: "status", data: getState() }));
    };
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === "cmd") {
          execCommand(msg.cmd, msg.payload).then(() => {
            ws.send(JSON.stringify({ type: "status", data: getState() }));
          });
        } else if (msg.type === "ping") {
          ws.send(JSON.stringify({ type: "pong" }));
        }
      } catch (e) {
        log(`Error parsing message: ${e.message}`);
      }
    };

    ws.onclose = () => {
      log("WS desconectado, reintentando en 3s...");
      setTimeout(connect, 3000);
    };

    ws.onerror = (e) => {
      log(`WS error: ${e.message || e}`);
    };

    setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "status", data: getState() }));
      }
    }, 2000);
  }

  function waitForSpicetify() {
    if (!window.Spicetify || !Spicetify.Player) {
      setTimeout(waitForSpicetify, 300);
      return;
    }
    log("Spicetify listo, conectando WS...");
    connect();
  }

  waitForSpicetify();
})();