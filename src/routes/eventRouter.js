const express = require("express");
const eventRouter = express.Router();


const { userAuth, allowAdmin } = require("../middlewares/appAuth");
const { validateEventData } = require("../middlewares/validator");

eventRouter.use(userAuth);
eventRouter.use(allowAdmin);

const { createEvent } = require("../controllers/eventController");

eventRouter.post('/', validateEventData, createEvent);

module.exports = eventRouter; 