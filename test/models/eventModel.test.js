const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Event = require("../../src/models/eventModel");

let mongoServer;

describe("event model integration tests", () => {

    beforeAll(async () => {

        mongoServer =
            await MongoMemoryServer.create();

        await mongoose.connect(
            mongoServer.getUri()
        );
    });

    afterAll(async () => {

        await mongoose.disconnect();

        await mongoServer.stop();
    });

    afterEach(async () => {

        await Event.deleteMany({});
    });

    test("should create event successfully", async () => {

        const event = new Event({
            organizer:
                new mongoose.Types.ObjectId(),

            title: "Tech Summit",

            description:
                "event description",

            eventDate: "2099-12-10",

            eventTime:
                "09:30 AM IST",

            maxAttendees: 100
        });

        const savedEvent =
            await event.save();

        expect(savedEvent._id)
            .toBeDefined();

        expect(savedEvent.title)
            .toBe("Tech Summit");
    });

    test("should fail invalid title", async () => {

        const event = new Event({
            organizer:
                new mongoose.Types.ObjectId(),

            title: "abc",

            eventDate: "2099-12-10",

            eventTime:
                "09:30 AM IST",

            maxAttendees: 100
        });

        await expect(
            event.save()
        ).rejects.toThrow();
    });

    test("should fail past event date", async () => {

        const event = new Event({
            organizer:
                new mongoose.Types.ObjectId(),

            title: "Tech Summit",

            eventDate: "2020-01-01",

            eventTime:
                "09:30 AM IST",

            maxAttendees: 100
        });

        await expect(
            event.save()
        ).rejects.toThrow(
            "Event date cannot be in the past"
        );
    });

    test("should fail invalid event time", async () => {

        const event = new Event({
            organizer:
                new mongoose.Types.ObjectId(),

            title: "Tech Summit",

            eventDate: "2099-12-10",

            eventTime: "25:00",

            maxAttendees: 100
        });

        await expect(
            event.save()
        ).rejects.toThrow(
            "Invalid event time format"
        );
    });

    test("should fail invalid attendees count", async () => {

        const event = new Event({
            organizer:
                new mongoose.Types.ObjectId(),

            title: "Tech Summit",

            eventDate: "2099-12-10",

            eventTime:
                "09:30 AM IST",

            maxAttendees: 0
        });

        await expect(
            event.save()
        ).rejects.toThrow();
    });

});