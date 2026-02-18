import { WebSocket, WebSocketServer } from "ws";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// change if needed
const PORT = 8080;

// change if needed
const server = http.createServer((req, res) => {
  if (req.url === "/" || req.url === "/index.html") {
    const filePath = path.join(__dirname, "index.html");

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("error loading index.html");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end("not found");
  }
});

const wss = new WebSocketServer({ server });

console.log(`server started on port ${PORT} ---`);

interface GameMessage {
  opcode: number;
  data?: any;
}

wss.on("connection", (ws: WebSocket) => {
  console.log("client connected");

  ws.on("message", (data: Buffer) => {
    try {
      const raw = data.toString();
      const msg: GameMessage = JSON.parse(raw);

      console.log(`opcode received: ${msg.opcode}`);

      switch (msg.opcode) {
        case 1: // heartbeat
          ws.send(JSON.stringify({ opcode: 2, data: { time: Date.now() } }));
          break;

        case 3: // identity/reconnection
          ws.send(
            JSON.stringify({
              opcode: 35,
              data: {
                user: {
                  id: "local-player",
                  username: "LocalUser",
                  avatar_url: "",
                },
              },
            })
          );

          ws.send(
            JSON.stringify({
              opcode: 46,
              data: {
                game: {
                  state: {
                    primary_user: "local-player",
                    participants: [
                      {
                        id: "local-player",
                        state: { phase: 1, strokes: 0, score: [], hole: 1 },
                      },
                    ],
                    properties: {
                      gameplay_mode: 0,
                      round_state: 1,
                      current_hole: 1,
                      level: 0,
                      level_seed: 12345,
                    },
                  },
                },
              },
            })
          );
          break;

        case 96: // presence/broadcast
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(raw);
            }
          });
          break;

        default:
          console.warn(`what the fucking kind of opcode is this: ${msg.opcode}`);
      }
    } catch (err) {
      console.error("what the fucking kind of message did you send me:", err);
    }
  });

  ws.on("close", () => {
    console.log("client left :<");
  });
});

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
