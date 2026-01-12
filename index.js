const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 3000;
const wss = new WebSocket.Server({ port: PORT });

const clients = new Map();

wss.on("connection", (ws) => {
  const id = uuidv4();
  clients.set(id, ws);

  ws.send(JSON.stringify({ type: "id", id }));

  ws.on("message", (msg) => {
    const data = JSON.parse(msg);

    if (data.to && clients.has(data.to)) {
      clients.get(data.to).send(JSON.stringify({
        ...data,
        from: id
      }));
    }
  });

  ws.on("close", () => {
    clients.delete(id);
  });
});

console.log("🚀 Signaling server rodando na porta", PORT);
