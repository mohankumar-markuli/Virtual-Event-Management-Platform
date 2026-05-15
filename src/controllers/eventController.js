const { createEventService,
    getEventService
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

        const response = await getEventService(req);

        res.status(200).json({
            message: "Events retrieved successfully",
            data: response
        });

    } catch (err) {
        next(err);
    }
};

module.exports = { createEvent, getEvents };