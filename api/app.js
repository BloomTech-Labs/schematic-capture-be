const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

// Routers
const { auth, roles } = require("./routers");

const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());

server.use("/api/auth", auth);
server.use("/api/roles", roles);

server.get("/", (req, res) => res.json({ running: true }));

module.exports = server;
