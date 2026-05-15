const express = require("express");
const eventRouter = express.Router();


const { userAuth, allowAdmin } = require("../middlewares/appAuth");
const { validateEventData } = require("../middlewares/validator");
const { createEvent, getEvents, getEventById } = require("../controllers/eventController");

eventRouter.use(userAuth);
eventRouter.use(allowAdmin);

eventRouter.post('/', validateEventData, createEvent);
eventRouter.get('/', getEvents);
eventRouter.get('/:id', getEventById);

module.exports = eventRouter; 