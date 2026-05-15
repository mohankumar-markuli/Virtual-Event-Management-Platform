const { createEventService
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

module.exports = { createEvent };