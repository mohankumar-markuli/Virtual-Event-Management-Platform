
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

module.exports = {
    createEventService
};