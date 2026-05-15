const { registrationService,
    getUserRegistrationsService,
    deleteEventRegistrationService,
    cancelEventRegistrationService
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

const deleteEventRegistration = async (req, res, next) => {
    try {
        const { registrationId } = req.params;
        const userId = req.user.id;
        const registration = await deleteEventRegistrationService(registrationId, userId);

        res.status(200).json({
            message: "Event registration deleted successfully",
            data: registration
        });
    } catch (err) {
        next(err);
    }
};

const cancelEventRegistration = async (req, res, next) => {
    try {
        const { registrationId } = req.params;
        const userId = req.user.id;

        const registration = await cancelEventRegistrationService(registrationId, userId);

        res.status(200).json({
            message: "Event registration cancelled successfully",
            data: registration
        });
    }
    catch (err) {
        next(err);
    }
};

module.exports = {
    registerForEvent,
    getUserRegistrations,
    deleteEventRegistration,
    cancelEventRegistration
};