const Registration = require('../models/registerationModel');
const { sendEmail } = require('../utils/emailHelper');

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

    await sendEmail({
        to: req.user.emailId,

        subject:
            "Event Registration Successful",

        text:
            `Hi ${req.user.firstName}, You have successfully registered for the event.`
    });

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

const deleteEventRegistrationService = async (req) => {

    const { registrationId } = req.params;
    const userId = req.user.id;
    const registration = await Registration.findOneAndDelete(
        { _id: registrationId, userId },
        { returnDocument: "after" });

    if (!registration) {
        throw new Error("Registration not found");
    }

    await sendEmail({
        to: req.user.emailId,
        subject: "Event Registration Deleted from Record",
        text: `Your registration record has been deleted successfully.`
    });

    return registration;
};

const cancelEventRegistrationService = async (req) => {
    const { registrationId } = req.params;
    const userId = req.user.id;

    const registration = await Registration.findOneAndUpdate(
        { _id: registrationId, userId },
        { registrationStatus: "cancelled" }
    );

    if (!registration)
        throw new Error("Registration not found");

    await sendEmail({
        to: req.user.emailId,
        subject: "Event Registration Cancelled",
        text: `Your event registration has been cancelled successfully.`
    });

    return registration;
};


module.exports = {
    registrationService,
    getUserRegistrationsService,
    deleteEventRegistrationService,
    cancelEventRegistrationService
};