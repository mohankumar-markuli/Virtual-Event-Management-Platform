const validator = require("validator");
const bcrypt = require("bcrypt");
const { validate } = require("../models/userModel");

const validateSignUpData = (req, res, next) => {
    try {

        const { firstName, lastName, emailId, password, role } = req.body;

        // firstName
        if (!firstName || typeof firstName !== "string")
            throw new Error("First name is required");

        if (firstName.trim().length < 2 || firstName.trim().length > 50)
            throw new Error("First name should be between 2 and 50 characters");

        // lastName
        if (lastName && typeof lastName !== "string")
            throw new Error("Last name must be a string");

        // email
        if (!emailId)
            throw new Error("Email is required");

        if (!validator.isEmail(emailId))
            throw new Error("Invalid email format");

        // password
        if (!password)
            throw new Error("Password is required");

        if (!validator.isStrongPassword(password))
            throw new Error("Password must be strong");

        // role
        const allowedRoles = ["attendee", "admin"];

        if (role && !allowedRoles.includes(role))
            throw new Error("Invalid role");

        next();

    } catch (err) {
        next(err);
    }
};

const validatePassword = async (user, userInputPassword) => {
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(
        userInputPassword,
        passwordHash
    );
    return isPasswordValid;
};

const validateFields = (keys, allowed, restricted) => {
    const forbidden = keys.filter(k => restricted.has(k));
    if (forbidden.length) {
        throw new Error(`Restricted fields: ${forbidden.join(", ")}`);
    }

    const invalid = keys.filter(k => !allowed.has(k));
    if (invalid.length) {
        throw new Error(`Invalid fields: ${invalid.join(", ")}`);
    }

};

const validateEditUserData = (req, res, next) => {
    try {
        const ALLOWED_FIELDS = new Set(["firstName", "lastName"]);
        const RESTRICTED_FIELDS = new Set(["emailId", "password", "role"]);

        const keys = Object.keys(req.body || {});

        if (keys.length === 0) {
            throw new Error("No fields provided for update");
        }
        validateFields(keys, ALLOWED_FIELDS, RESTRICTED_FIELDS);

        next();

    } catch (err) {
        next(err);
    }
};

const validateChangePassword = async (req, res, next) => {
    try {
        const { password, newPassword } = req.body;

        if (!password || !newPassword) {
            throw new Error("Both old and new passwords are required");
        }

        if (!validator.isStrongPassword(newPassword)) {
            throw new Error("New password must be strong");
        }

        const isOldPasswordValid = await validatePassword(req.user, password);
        if (!isOldPasswordValid) {
            throw new Error("Incorrect current password");
        }

        const isNewPasswordSame = await validatePassword(req.user, newPassword);
        if (isNewPasswordSame) {
            throw new Error("New password cannot be same as old password");
        }
        next();

    } catch (err) {
        next(err);
    }
};

const validateEventData = (data) => {

    const { title, description, eventDate, eventTime, maxAttendees } = data;

    // title
    if (title !== undefined && title !== null) {
        if (typeof title !== "string")
            throw new Error("Title must be a string");

        if (title.trim().length < 5 || title.trim().length > 100)
            throw new Error("Title should be between 5 and 100 characters");
    }

    // description
    if (description !== undefined && description !== null) {
        if (typeof description !== "string")
            throw new Error("Description must be a string");

        if (description.length > 1000)
            throw new Error("Description too long");

    }

    // event date
    if (eventDate !== undefined && eventDate !== null) {
        const parsedDate = new Date(eventDate);

        if (parsedDate.toString() === "Invalid Date")
            throw new Error("Invalid event date");

        const today = new Date();

        today.setHours(0, 0, 0, 0);
        parsedDate.setHours(0, 0, 0, 0);

        if (parsedDate < today)
            throw new Error(
                "Event date cannot be in the past"
            );
    }

    // event time
    if (eventTime !== undefined && eventTime !== null) {
        const timeRegex =
            /^(0?[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)\s?(IST|GMT|UTC)$/i;

        if (!timeRegex.test(eventTime))
            throw new Error("Invalid event time format");

        const [time, meridian] = eventTime.split(" ");

        let [hours, minutes] = time.split(":").map(Number);

        if (meridian.toUpperCase() === "PM" && hours !== 12) hours += 12;
        if (meridian.toUpperCase() === "AM" && hours === 12) hours = 0;

        const eventDateTime = new Date(eventDate);

        eventDateTime.setHours(hours, minutes, 0, 0);

        if (eventDateTime < new Date())
            throw new Error("Event time cannot be in the past");
    }

    // max attendees
    if (maxAttendees !== undefined && maxAttendees !== null) {
        if (typeof maxAttendees !== "number")
            throw new Error("Max attendees must be a number");

        if (maxAttendees < 1)
            throw new Error("Max attendees must be at least 1");

        if (maxAttendees > 1000)
            throw new Error("Max attendees limit exceeded");

    }

    return true;
}

const validateCreateEventData = (req, res, next) => {
    try {

        const { title, description, eventDate, eventTime, maxAttendees } = req.body;

        // validate required fields
        if (!title)
            throw new Error("Title is required");

        if (!eventDate)
            throw new Error("Event date is required");

        if (!eventTime)
            throw new Error("Event time is required");

        if (maxAttendees === undefined || maxAttendees === null)
            throw new Error("Max attendees is required");

        const data = { title, description, eventDate, eventTime, maxAttendees };

        if (!validateEventData(data)) throw new Error("Event data validation failed");

        next();

    } catch (err) {
        next(err);
    }
};

const validateEventUpdateData = (req, res, next) => {
    try {

        const { title, description, eventDate, eventTime, maxAttendees } = req.body;

        const ALLOWED_FIELDS = new Set(["title", "description", "eventDate",
            "eventTime", "maxAttendees"
        ]);
        const RESTRICTED_FIELDS = new Set(["organizer"]);

        const keys = Object.keys(req.body || {});

        if (keys.length === 0) {
            throw new Error("No fields provided for update");
        }
        validateFields(keys, ALLOWED_FIELDS, RESTRICTED_FIELDS);

        const data = { title, description, eventDate, eventTime, maxAttendees };

        if (!validateEventData(data)) throw new Error("Update not allowed");

        next();

    } catch (err) {
        next(err);
    }
};


module.exports = {
    validateSignUpData,
    validatePassword,
    validateEditUserData,
    validateChangePassword,
    validateCreateEventData,
    validateEventUpdateData
};