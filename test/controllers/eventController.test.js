// mocks
jest.mock("../../src/services/eventServices", () => ({
    createEventService: jest.fn(),
    getEventService: jest.fn(),
    getEventByIdService: jest.fn(),
    updateEventService: jest.fn(),
    deleteEventService: jest.fn()
}));

const {
    createEventService,
    getEventService,
    getEventByIdService,
    updateEventService,
    deleteEventService
} = require("../../src/services/eventServices");

const {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent
} = require("../../src/controllers/eventController");

describe("event controller unit tests", () => {

    let req, res, next;

    beforeEach(() => {

        req = {
            body: {},
            params: {},
            user: {
                _id: "123",
                firstName: "test"
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        next = jest.fn();

        jest.clearAllMocks();
    });

    // createEvent
    describe("createEvent", () => {

        test("should create event successfully", async () => {

            const mockEvent = {
                _id: "1",
                title: "Tech Summit"
            };

            createEventService
                .mockResolvedValue(mockEvent);

            await createEvent(req, res, next);

            expect(createEventService)
                .toHaveBeenCalledWith(req);

            expect(res.status)
                .toHaveBeenCalledWith(201);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message:
                        "Event created successfully",

                    data: mockEvent
                });
        });

        test("should call next on error", async () => {

            createEventService
                .mockRejectedValue(
                    new Error("error")
                );

            await createEvent(req, res, next);

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

    });

    // getEvents
    describe("getEvents", () => {

        test("should return all events", async () => {

            const mockEvents = [
                { _id: "1", title: "Event 1" }
            ];

            getEventService
                .mockResolvedValue(mockEvents);

            await getEvents(req, res, next);

            expect(getEventService)
                .toHaveBeenCalled();

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message:
                        "Events retrieved successfully",

                    data: mockEvents
                });
        });

        test("should call next on error", async () => {

            getEventService
                .mockRejectedValue(
                    new Error("error")
                );

            await getEvents(req, res, next);

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

    });

    // getEventById
    describe("getEventById", () => {

        test("should return single event", async () => {

            const mockEvent = {
                _id: "1",
                title: "Tech Summit"
            };

            req.params.id = "1";

            getEventByIdService
                .mockResolvedValue(mockEvent);

            await getEventById(req, res, next);

            expect(getEventByIdService)
                .toHaveBeenCalledWith("1");

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message:
                        "Events retrieved successfully",

                    data: mockEvent
                });
        });

        test("should call next on error", async () => {

            req.params.id = "1";

            getEventByIdService
                .mockRejectedValue(
                    new Error("error")
                );

            await getEventById(req, res, next);

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

    });

    // updateEvent
    describe("updateEvent", () => {

        test("should update event successfully", async () => {

            const updatedEvent = {
                _id: "1",
                title: "Updated Event"
            };

            updateEventService
                .mockResolvedValue(updatedEvent);

            await updateEvent(req, res, next);

            expect(updateEventService)
                .toHaveBeenCalledWith(req);

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message:
                        "Event updated successfully",

                    data: updatedEvent
                });
        });

        test("should call next on error", async () => {

            updateEventService
                .mockRejectedValue(
                    new Error("error")
                );

            await updateEvent(req, res, next);

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

    });

    // deleteEvent
    describe("deleteEvent", () => {

        test("should delete event successfully", async () => {

            req.params.id = "1";

            deleteEventService
                .mockResolvedValue(true);

            await deleteEvent(req, res, next);

            expect(deleteEventService)
                .toHaveBeenCalledWith("1");

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message:
                        "Event deleted successfully"
                });
        });

        test("should call next on error", async () => {

            req.params.id = "1";

            deleteEventService
                .mockRejectedValue(
                    new Error("error")
                );

            await deleteEvent(req, res, next);

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

    });

});