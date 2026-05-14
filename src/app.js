require("dotenv").config();
const express = require("express");
const app = express();

const { logger } = require('./middlewares/logger');

// DNS
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

app.use(logger);

// health
app.get("/api/v1/health", (req, res) => {
    res.json({
        status: "OK",
        message: "Server is running",
        timestamp: new Date().toISOString()
    });
});

module.exports = app;