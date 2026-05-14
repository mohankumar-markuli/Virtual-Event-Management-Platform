const mongoose = require("mongoose");
const validator = require("validator");

const registrationSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: "Event"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: "User"
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    registrationStatus: {
        type: String,
        enum: ["registered", "cancelled"],
        default: "registered"
    },
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Registration", registrationSchema);