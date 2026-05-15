// mocks
jest.mock("../../src/models/eventModel", () => {
    const mEvent = jest.fn();

    mEvent.find = jest.fn();
    mEvent.findById = jest.fn();
    mEvent.findByIdAndDelete = jest.fn();

    return mEvent;
});

const Event =
    require("../../src/models/eventModel");

const {
    createEventService,
    getEventService,
    getEventByIdService,
    updateEventService,
    deleteEventService
} = require("../../src/services/eventServices");

describe("event services unit tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("createEventService", () => {

        test("should create event", async () => {

            const req = {
                body: {
                    title: "Tech Summit",
                    description: "desc",
                    eventDate: "2099-12-10",
                    eventTime: "09:30 AM IST",
                    maxAttendees: 100
                },

                user: {
                    _id: "123"
                }
            };

            const savedEvent = {
                _id: "1",
                organizer: "123",
                title: "Tech Summit",
                description: "desc",
                eventDate: "2099-12-10",
                eventTime: "09:30 AM IST",
                maxAttendees: 100
            };

            Event.mockImplementation(() => ({
                save: jest.fn()
                    .mockResolvedValue(savedEvent)
            }));

            const result =
                await createEventService(req);

            expect(result.title)
                .toBe("Tech Summit");
        });

    });

    describe("getEventService", () => {

        test("should return formatted events", async () => {

            const mockEvents = [
                {
                    _id: "1",

                    organizer: {
                        firstName: "John",
                        lastName: "Doe",
                        emailId: "john@test.com"
                    },

                    title: "Tech Summit"
                }
            ];

            Event.find.mockReturnValue({
                populate: jest.fn()
                    .mockResolvedValue(mockEvents)
            });

            const result =
                await getEventService();

            expect(result[0].title)
                .toBe("Tech Summit");
        });

    });

    describe("getEventByIdService", () => {

        test("should return event by id", async () => {

            const mockEvent = {
                _id: "1",

                organizer: {
                    firstName: "John",
                    lastName: "Doe",
                    emailId: "john@test.com"
                },

                title: "Tech Summit"
            };

            Event.findById.mockReturnValue({
                populate: jest.fn()
                    .mockResolvedValue(mockEvent)
            });

            const result =
                await getEventByIdService("1");

            expect(result.title)
                .toBe("Tech Summit");
        });

        test("should fail if event not found", async () => {

            Event.findById.mockReturnValue({
                populate: jest.fn()
                    .mockResolvedValue(null)
            });

            await expect(
                getEventByIdService("1")
            ).rejects.toThrow(
                "Event not found"
            );
        });

    });

    describe("updateEventService", () => {

        test("should update event", async () => {

            const mockEvent = {
                _id: "1",
                title: "Old Event",

                save: jest.fn()
                    .mockResolvedValue({
                        _id: "1",
                        title: "Updated Event"
                    })
            };

            Event.findById
                .mockResolvedValue(mockEvent);

            const req = {
                params: {
                    id: "1"
                },

                body: {
                    title: "Updated Event"
                }
            };

            const result =
                await updateEventService(req);

            expect(result.title)
                .toBe("Updated Event");
        });

        test("should fail if event not found", async () => {

            Event.findById
                .mockResolvedValue(null);

            const req = {
                params: {
                    id: "1"
                },

                body: {}
            };

            await expect(
                updateEventService(req)
            ).rejects.toThrow(
                "Event not found"
            );
        });

    });

    describe("deleteEventService", () => {

        test("should delete event", async () => {

            Event.findById
                .mockResolvedValue({
                    _id: "1"
                });

            Event.findByIdAndDelete
                .mockResolvedValue(true);

            await deleteEventService("1");

            expect(
                Event.findByIdAndDelete
            ).toHaveBeenCalledWith("1");
        });

        test("should fail if event not found", async () => {

            Event.findById
                .mockResolvedValue(null);

            await expect(
                deleteEventService("1")
            ).rejects.toThrow(
                "Event not found"
            );
        });

    });

});