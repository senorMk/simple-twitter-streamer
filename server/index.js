import express from "express";
import cors from "cors";
import logger from "./core/logger/app-logger.js";
import config from "./core/config/config.dev.js";
import { Server } from "socket.io";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import request from "request";
import morgan from "morgan";
import http from "http";
import tweets from "./routes/tweets.route.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

logger.stream = {
  write(message, encoding) {
    logger.info(message);
  },
};

const app = express();

let port = config.serverPort;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev", { stream: logger.stream }));
app.use(express.static(path.join(__dirname, "../client/build")));
app.use("/api/v1/tweets", tweets);

app.get("*", (request, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let timeout = 0;

const sleep = async (delay) => {
  return new Promise((resolve) => setTimeout(() => resolve(true), delay));
};

const streamTweets = (socket, token) => {
  const requestConfig = {
    url: config.streamURL,
    auth: {
      bearer: token,
    },
    timeout: 31000,
  };

  try {
    const stream = request.get(requestConfig);

    stream
      .on("data", (data) => {
        try {
          const json = JSON.parse(data);
          if (json.connection_issue) {
            socket.emit("error", json);
            reconnect(stream, socket, token);
          } else {
            if (json.data) {
              socket.emit("tweet", json);
            } else {
              socket.emit("authError", json);
            }
          }
        } catch (e) {
          socket.emit("heartbeat");
        }
      })
      .on("error", (error) => {
        reconnect(stream, socket, token);
      });
  } catch (e) {
    console.log("Error 1:", e);
    socket.emit("authError", config.authMessage);
  }
};

const reconnect = async (stream, socket, token) => {
  timeout++;
  if (timeout === 100) timeout = 0;
  stream.abort();
  await sleep(2 ** timeout * 1000);
  streamTweets(socket, token);
};

io.on("connection", async (socket) => {
  try {
    io.emit("connected", "Client connected");
    const stream = streamTweets(io, config.bearer_token);
  } catch (e) {
    console.log("Error 2:", e);
    io.emit("authError", config.authMessage);
  }
});

server.listen(port, async () => {
  logger.info(`Server started on port: ${port}.`);
});
