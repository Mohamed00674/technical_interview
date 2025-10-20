import http from "http";
import { Server as SocketIOServer } from "socket.io";
import rateLimit from "express-rate-limit";

import app from "./app";
import { connectDB } from "./config/database";
import { EnvConfig } from "./config/env";
import { ERROR_MAP } from "./middlewares/errorHandler";
import _logger from "./middlewares/logger";

/**
 * RATE LIMITING
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests, please try again later.",
  },
});

app.use(limiter);

/**
 * SOCKET
 */
const userEventCounts = new Map<string, { count: number; lastReset: number }>();
const MAX_EVENTS_PER_MIN = 20;
const server = http.createServer(app);
export const io = new SocketIOServer(server, {
  cors: {
    origin: EnvConfig.origins.split(","),
    methods: ["GET", "POST"],
  },
});

io.on("Connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  socket.on("addComment", (blogId: string) => {
    const now = Date.now();
    const entry = userEventCounts.get(socket.id) || {
      count: 0,
      lastReset: now,
    };

    // Reset every minute
    if (now - entry.lastReset > 60_000) {
      entry.count = 0;
      entry.lastReset = now;
    }

    entry.count += 1;
    userEventCounts.set(socket.id, entry);

    if (entry.count > MAX_EVENTS_PER_MIN) {
      socket.emit("error", "Rate limit exceeded, please slow down.");
      return;
    }

    socket.join(blogId);
    console.log(`User ${socket.id} joined blog room ${blogId}`);
  });

  socket.on("addReply", (blogId: string) => {
    const now = Date.now();
    const entry = userEventCounts.get(socket.id) || {
      count: 0,
      lastReset: now,
    };

    // Reset every minute
    if (now - entry.lastReset > 60_000) {
      entry.count = 0;
      entry.lastReset = now;
    }

    entry.count += 1;
    userEventCounts.set(socket.id, entry);

    if (entry.count > MAX_EVENTS_PER_MIN) {
      socket.emit("error", "Rate limit exceeded, please slow down.");
      return;
    }

    socket.leave(blogId);
    console.log(`User ${socket.id} left blog room ${blogId}`);
  });

  socket.on("disconnect", () => {
    console.log(" User disconnected:", socket.id);
  });
});

/**
 * DATABASE AND SERVER
 */

connectDB().then(
  () => {
    app.listen(EnvConfig.port, () => {
      console.log(
        ` Server running on port ${EnvConfig.host}:${EnvConfig.port}`
      );
    });
  },
  (reason) => {
    const error = ERROR_MAP.DATABASE_ERROR;

    console.log(" Failed to connect to database", {
      error,
      reason,
    });

    throw error;
  }
);
