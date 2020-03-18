const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

// Routers
const auth = require('./routers/auth');
const roles = require('./routers/roles');
const clients = require('./routers/clients');
const jobsheets = require('./routers/jobsheets');
const projects = require('./routers/projects');

// Middleware
const checkAccountExists = require('./middleware/auth/checkAccountExists');
const validateIdToken = require('./middleware/auth/validateIdToken');

const server = express();

server.use(cors());
server.use(express.json());
server.use(helmet());

server.use("/api/auth", auth);
server.use("/api/roles", roles);
server.use("/api/clients", validateIdToken, checkAccountExists(true), clients);
server.use("/api/projects", validateIdToken, projects);
server.use("/api/jobsheets", validateIdToken, jobsheets);

server.get("/", (req, res) => res.json({ running: true }));

module.exports = server;
