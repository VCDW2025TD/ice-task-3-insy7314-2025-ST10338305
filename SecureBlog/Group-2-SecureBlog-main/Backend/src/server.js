// src/server.js
require("dotenv").config(); // Load env vars early

const fs = require("fs");
const http = require("http");
const https = require("https");
const mongoose = require("mongoose");
const path = require("path");
const app = require("./app"); // app applies helmet, cors, routes, etc.

const PORT = process.env.PORT || 5000;

// Mongo connection URI
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ Missing Mongo connection string. Set MONGO_URI (or MONGODB_URI) in .env");
  process.exit(1);
}

// SSL certificate paths
const keyPath = path.join(__dirname, "..", "ssl", "privatekey.pem");
const certPath = path.join(__dirname, "..", "ssl", "certificate.pem");

// Decide whether to launch HTTPS or fallback HTTP
let serverFactory;
let protoLabel;

if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  const sslOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };
  serverFactory = () => https.createServer(sslOptions, app);
  protoLabel = "https";
} else {
  serverFactory = () => http.createServer(app);
  protoLabel = "http";
  console.warn("⚠️ SSL certs not found in ./ssl; starting HTTP server for development.");
}

// Bootstrap server
(async () => {
  try {
    // MongoDB connection
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");

    // Start server
    const server = serverFactory();
    server.listen(PORT, () => {
      console.log(`🚀 Server running at ${protoLabel}://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err?.message || err);
    process.exit(1);
  }
})();





