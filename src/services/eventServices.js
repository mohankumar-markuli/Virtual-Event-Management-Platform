
const Event = require("../models/eventModel");

const createEventService = async (req) => {

    const eventData = req.body;

    const {
        title,
        description,
        eventDate,
        eventTime,
        maxAttendees, } = eventData;

    const event = new Event({
        organizer: req.user._id,
        title,
        description,
        eventDate,
        eventTime,
        maxAttendees,
    });

    const savedEvent = await event.save();

    const eventResponse = {
        _id: savedEvent._id,
        organizer: savedEvent.organizer,
        title: savedEvent.title,
        description: savedEvent.description,
        eventDate: savedEvent.eventDate,
        eventTime: savedEvent.eventTime,
        maxAttendees: savedEvent.maxAttendees,
    };

    return eventResponse;
};

const getEventService = async (req) => {
    const events = await Event.find().populate("organizer", "firstName lastName emailId");

    const formattedEvents = events.map(event => ({
        _id: event._id,
        organizer: {
            firstName: event.organizer.firstName,
            lastName: event.organizer.lastName,
            emailId: event.organizer.emailId
        },
        title: event.title,
        description: event.description,
        eventDate: event.eventDate,
        eventTime: event.eventTime,
        maxAttendees: event.maxAttendees,
    }));

    return formattedEvents;
};

const getEventByIdService = async (eventId) => {

    const event = await Event.findById(eventId).populate("organizer", "firstName lastName emailId");

    if (!event) throw new Error("Event not found");

    const eventResponse = {
        _id: event._id,
        organizer: {
            firstName: event.organizer.firstName,
            lastName: event.organizer.lastName,
            emailId: event.organizer.emailId
        },
        title: event.title,
        description: event.description,
        eventDate: event.eventDate,
        eventTime: event.eventTime,
        maxAttendees: event.maxAttendees,
    };

    return eventResponse;
};

const updateEventService = async (req) => {

    const eventId = req.params.id;

    const event = await Event.findById(eventId);

    if (!event)
        throw new Error("Event not found");

    Object.keys(req.body).forEach((key) => {
        event[key] = req.body[key];
    });

    const updatedEvent = await event.save();

    const eventResponse = {
        _id: updatedEvent._id,
        organizer: updatedEvent.organizer,
        title: updatedEvent.title,
        description: updatedEvent.description,
        eventDate: updatedEvent.eventDate,
        eventTime: updatedEvent.eventTime,
        maxAttendees: updatedEvent.maxAttendees,
    };

    return eventResponse;
};

const deleteEventService = async (eventId) => {
    const event = await Event.findById(eventId);

    if (!event)
        throw new Error("Event not found");
    await Event.findByIdAndDelete(eventId);
};

module.exports = {
    createEventService,
    getEventService,
    getEventByIdService,
    updateEventService,
    deleteEventService
};