const express = require("express");
const eventRouter = express.Router();


const { userAuth, allowAdmin } = require("../middlewares/appAuth");
const { validateCreateEventData, validateEventUpdateData } = require("../middlewares/validator");
const { createEvent, getEvents, getEventById, updateEvent, deleteEvent } = require("../controllers/eventController");

eventRouter.use(userAuth);

eventRouter.post('/', allowAdmin, validateCreateEventData, createEvent);
eventRouter.get('/', getEvents);
eventRouter.get('/:id', getEventById);
eventRouter.patch('/:id', allowAdmin, validateEventUpdateData, updateEvent);
eventRouter.delete('/:id', allowAdmin, deleteEvent);

module.exports = eventRouter; 