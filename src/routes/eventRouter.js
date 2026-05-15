const express = require("express");
const eventRouter = express.Router();


const { userAuth, admin } = require("../middlewares/appAuth");
const { validateCreateEventData, validateEventUpdateData } = require("../middlewares/validator");
const { createEvent, getEvents, getEventById, updateEvent, deleteEvent } = require("../controllers/eventController");

eventRouter.use(userAuth);

eventRouter.post('/', admin, validateCreateEventData, createEvent);
eventRouter.get('/', getEvents);
eventRouter.get('/:id', getEventById);
eventRouter.patch('/:id', admin, validateEventUpdateData, updateEvent);
eventRouter.delete('/:id', admin, deleteEvent);

module.exports = eventRouter; 