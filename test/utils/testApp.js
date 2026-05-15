const express = require("express");
const cookieParser = require("cookie-parser");

const authRouter = require("../../src/routes/authRouter");
const userRouter = require("../../src/routes/userRouter");
const eventRouter = require("../../src/routes/eventRouter");
const registrationRouter = require("../../src/routes/registrationRouter");

const { errorHandler } = require("../../src/middlewares/errorHandler");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/registration", registrationRouter);

app.use(errorHandler);

module.exports = app;