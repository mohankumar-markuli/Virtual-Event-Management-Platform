const mongoose = require("mongoose");
const validator = require("validator");

const eventSchema = new mongoose.Schema(
    {
        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true,
            ref: "User"
        },

        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 100,
            index: true
        },

        description: {
            type: String,
            trim: true,
            maxlength: 1000
        },

        eventDate: {
            type: Date,
            required: true,

            validate(value) {
                if (new Date(value) < new Date()) {
                    throw new Error(
                        "Event date cannot be in the past"
                    );
                }
            }
        },

        eventTime: {
            type: String,
            required: true,

            validate(value) {
                const timeRegex =
                    /^(0?[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)\s?(IST|GMT|UTC)$/i;

                if (!timeRegex.test(value)) {
                    throw new Error(
                        "Invalid event time format"
                    );
                }
            }
        },

        maxAttendees: {
            type: Number,
            required: true,
            min: 1,
            max: 1000
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Event", eventSchema);