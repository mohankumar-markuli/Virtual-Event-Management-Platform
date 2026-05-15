const Registration = require('../models/registerationModel');

const registrationService = async (req) => {
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

const getUserRegistrationsService = async (userId) => {
    const registrations = await Registration.find({ userId })
        .populate('eventId', 'title date')
        .populate("userId", "firstName lastName emailId");

    return registrations.map(reg => ({
        _id: reg._id,
        Attendee: `${reg.userId.firstName} ${reg.userId.lastName} (${reg.userId.emailId})`,
        eventId: reg.eventId._id,
        eventTitle: reg.eventId.title,
        eventDate: reg.eventId.date,
        registrationDate: reg.registrationDate,
        registrationStatus: reg.registrationStatus,
    }));
};

const deleteEventRegistrationService = async (registrationId, userId) => {
    const registration = await Registration.findOneAndDelete({ _id: registrationId, userId });

    if (!registration) {
        throw new Error("Registration not found");
    }
    return registration;
};

const cancelEventRegistrationService = async (registrationId, userId) => {
    const registration = await Registration.findOneAndUpdate(
        { _id: registrationId, userId },
        { registrationStatus: "cancelled" },
        { new: true }
    );

    return registration;
};


module.exports = {
    registrationService,
    getUserRegistrationsService,
    deleteEventRegistrationService,
    cancelEventRegistrationService
};