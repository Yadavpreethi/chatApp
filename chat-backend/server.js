const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const path = require("path");

// Load environment variables
dotenv.config();

// Create app and HTTP server
const app = express();
const server = http.createServer(app);

// ✅ Initialize Socket.IO
const socketHandler = require("./socket"); // ⬅️ socket.js must export a function
socketHandler(server); // ⬅️ Pass the HTTP server to socket.js

// ✅ Global Middleware
app.use(express.json());

// ✅ Proper CORS middleware
app.use(cors({
  origin: "http://localhost:3000", // frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// ✅ Optional preflight
app.options("*", cors());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ✅ Log incoming requests
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// ✅ API Routes
const authRoutes = require("./Routes/auth");
const messageRoutes = require("./Routes/message");
const conversationRoutes = require("./Routes/conversation");
const searchRoutes = require("./Routes/search");

// ✅ Use Routes
app.use("/api/auth", authRoutes);          // Login, register
app.use("/api", messageRoutes);            // Messages
app.use("/api", conversationRoutes);       // Conversations
app.use("/api", searchRoutes);             // User search

// ✅ Root
app.get("/", (req, res) => {
  res.send("💬 Chat API running...");
});

// ❌ Catch unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// 🛑 Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
