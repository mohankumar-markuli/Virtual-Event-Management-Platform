const { registrationService,
    getUserRegistrationsService
} = require('../services/registerationServices');

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

const getUserRegistrations = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const registrations = await getUserRegistrationsService(userId);
        res.status(200).json({
            message: "User registrations fetched successfully",
            data: registrations
        });

    } catch (err) {
        next(err);
    }
};

module.exports = {
    registerForEvent,
    getUserRegistrations
};