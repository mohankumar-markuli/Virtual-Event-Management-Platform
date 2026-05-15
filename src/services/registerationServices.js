const Registration = require('../models/registerationModel');

const registerationService = async (req) => {
    const { eventId } = req.params;
    const userId = req.user.id;

    const existingRegistration = await Registration.findOne({ eventId, userId });

    if (existingRegistration) {
        throw new Error("User already registered for this event");
    }

    const registration = new Registration({
        eventId,
        userId,
    });

    const regesteredData = await registration.save();

    const registrationResponse = {
        _id: regesteredData._id,
        eventId: regesteredData.eventId,
        userId: regesteredData.userId,
        registrationDate: regesteredData.registrationDate,
        registrationStatus: regesteredData.registrationStatus,
    };
    return registrationResponse;
};

module.exports = {
    registerationService
};