// mocks
jest.mock("../../src/services/registerationServices", () => ({
    registrationService: jest.fn(),
    getUserRegistrationsService: jest.fn(),
    deleteEventRegistrationService: jest.fn(),
    cancelEventRegistrationService: jest.fn()
}));

const {
    registrationService,
    getUserRegistrationsService,
    deleteEventRegistrationService,
    cancelEventRegistrationService
} = require("../../src/services/registerationServices");

const {
    registerForEvent,
    getUserRegistrations,
    deleteEventRegistration,
    cancelEventRegistration
} = require("../../src/controllers/registerationController");

describe("registration controller unit tests", () => {

    let req, res, next;

    beforeEach(() => {

        req = {
            params: {},
            body: {},
            user: {
                id: "user123",
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

    // registerForEvent
    describe("registerForEvent", () => {

        test("should register user for event", async () => {

            const mockRegistration = {
                _id: "1",
                userId: "user123",
                eventId: "event123"
            };

            req.params.eventId = "event123";

            registrationService
                .mockResolvedValue(
                    mockRegistration
                );

            await registerForEvent(
                req,
                res,
                next
            );

            expect(registrationService)
                .toHaveBeenCalledWith(req);

            expect(res.status)
                .toHaveBeenCalledWith(201);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message:
                        "Registered for event successfully",

                    data: mockRegistration
                });
        });

        test("should call next on error", async () => {

            registrationService
                .mockRejectedValue(
                    new Error("error")
                );

            await registerForEvent(
                req,
                res,
                next
            );

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

    });

    // getUserRegistrations
    describe("getUserRegistrations", () => {

        test("should fetch user registrations", async () => {

            const mockRegistrations = [
                {
                    _id: "1",
                    eventId: "event123"
                }
            ];

            getUserRegistrationsService
                .mockResolvedValue(
                    mockRegistrations
                );

            await getUserRegistrations(
                req,
                res,
                next
            );

            expect(
                getUserRegistrationsService
            ).toHaveBeenCalledWith(
                "user123"
            );

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message:
                        "User registrations fetched successfully",

                    data: mockRegistrations
                });
        });

        test("should call next on error", async () => {

            getUserRegistrationsService
                .mockRejectedValue(
                    new Error("error")
                );

            await getUserRegistrations(
                req,
                res,
                next
            );

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

    });

    // deleteEventRegistration
    describe("deleteEventRegistration", () => {

        test("should delete registration", async () => {

            const mockRegistration = {
                _id: "1"
            };

            deleteEventRegistrationService
                .mockResolvedValue(
                    mockRegistration
                );

            await deleteEventRegistration(
                req,
                res,
                next
            );

            expect(
                deleteEventRegistrationService
            ).toHaveBeenCalledWith(req);

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message:
                        "Event registration deleted successfully",

                    data: mockRegistration
                });
        });

        test("should call next on error", async () => {

            deleteEventRegistrationService
                .mockRejectedValue(
                    new Error("error")
                );

            await deleteEventRegistration(
                req,
                res,
                next
            );

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

    });

    // cancelEventRegistration
    describe("cancelEventRegistration", () => {

        test("should cancel registration", async () => {

            cancelEventRegistrationService
                .mockResolvedValue(true);

            await cancelEventRegistration(
                req,
                res,
                next
            );

            expect(
                cancelEventRegistrationService
            ).toHaveBeenCalledWith(req);

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message:
                        "Event registration cancelled successfully"
                });
        });

        test("should call next on error", async () => {

            cancelEventRegistrationService
                .mockRejectedValue(
                    new Error("error")
                );

            await cancelEventRegistration(
                req,
                res,
                next
            );

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

    });

});