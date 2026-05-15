const { createEventService,
    getEventService,
    getEventByIdService,
    updateEventService,
    deleteEventService
} = require("../services/eventServices");

const createEvent = async (req, res, next) => {
    try {
        const eventResponse = await createEventService(req);

        res.status(201).json({
            message: "Event created successfully",
            data: eventResponse
        });

    } catch (err) {
        next(err);
    }
};

const getEvents = async (req, res, next) => {
    try {

        const response = await getEventService();

        res.status(200).json({
            message: "Events retrieved successfully",
            data: response
        });

    } catch (err) {
        next(err);
    }
};

const getEventById = async (req, res, next) => {
    try {
        const eventId = req.params.id;
        const response = await getEventByIdService(eventId);

        res.status(200).json({
            message: "Events retrieved successfully",
            data: response
        });

    } catch (err) {
        next(err);
    }
};

const updateEvent = async (req, res, next) => {
    try {
        const eventUpdateResponse = await updateEventService(req);

        res.status(200).json({
            message: "Event updated successfully",
            data: eventUpdateResponse
        });

    } catch (err) {
        next(err);
    }
};

const deleteEvent = async (req, res, next) => {
    try {
        const eventId = req.params.id;
        await deleteEventService(eventId);

        res.status(200).json({
            message: "Event deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};


module.exports = { createEvent, getEvents, getEventById, updateEvent, deleteEvent };