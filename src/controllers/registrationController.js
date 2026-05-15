const { registrationService } = require('../services/registerationServices');

const registerForEvent = async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.id;

        const registration = await registrationService(req);

        res.status(201).json({
            message: "Registered for event successfully",
            data: registration
        });

    } catch (err) {
        next(err);
    }
};

module.exports = {
    registerForEvent
};