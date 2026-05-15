const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");

const { logger } = require('./middlewares/logger');
const { errorHandler } = require("./middlewares/errorHandler");

// DNS
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

app.use(logger);
app.use(express.json());
app.use(cookieParser());

// routes
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const eventRouter = require('./routes/eventRouter');

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/events", eventRouter);

// health
app.get("/api/v1/health", (req, res) => {
    res.json({
        status: "OK",
        message: "Server is running",
        timestamp: new Date().toISOString()
    });
});

// error handler
app.use(errorHandler);

module.exports = app;