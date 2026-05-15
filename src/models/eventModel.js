const mongoose = require("mongoose");
const validator = require("validator");

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        index: true,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    eventStartDate: {
        type: Date,
        required: true
    },
    eventEndDate: {
        type: Date,
        required: true
    },
    eventStartTime: {
        type: String,
        required: true
    },
    eventEndTime: {
        type: String,
        required: true
    },
    organizer: {
        type: String,
        required: true
    },
    maxAttendees: {
        type: Number,
        required: true,
        min: 1
    },
    eventStatus: {
        type: String,
        enum: ["scheduled", "ongoing", "completed", "cancelled"],
        default: "scheduled"
    },
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Event", eventSchema);
