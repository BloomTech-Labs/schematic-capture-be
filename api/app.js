const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

// Routers
const { auth, roles, clients } = require("./routers");

// Middleware
const { validateIdToken, checkAccountExists } = require('./middleware/auth');

const server = express();

server.use(cors());
server.use(express.json());
server.use(helmet());

server.use("/api/auth", auth);
server.use("/api/roles", roles);
server.use("/api/clients", validateIdToken, checkAccountExists(true), clients);

server.get("/", (req, res) => res.json({ running: true }));

module.exports = server;
