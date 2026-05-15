// mocks
jest.mock("../../src/models/registerationModel", () => {
    const mRegistration = jest.fn();

    mRegistration.findOne = jest.fn();
    mRegistration.find = jest.fn();
    mRegistration.findOneAndDelete = jest.fn();
    mRegistration.findOneAndUpdate = jest.fn();

    return mRegistration;
});

jest.mock("../../src/utils/emailHelper", () => ({
    sendEmail: jest.fn()
}));

const Registration =
    require("../../src/models/registerationModel");

const {
    sendEmail
} = require("../../src/utils/emailHelper");

const {
    registrationService,
    getUserRegistrationsService,
    deleteEventRegistrationService,
    cancelEventRegistrationService
} = require("../../src/services/registerationServices");

describe("registration services unit tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("registrationService", () => {

        test("should register user", async () => {

            Registration.findOne
                .mockResolvedValue(null);

            const savedRegistration = {
                _id: "1",
                eventId: "event1",
                userId: "user1",
                registrationStatus:
                    "registered"
            };

            Registration
                .mockImplementation(() => ({
                    save: jest.fn()
                        .mockResolvedValue(
                            savedRegistration
                        )
                }));

            const req = {
                params: {
                    eventId: "event1"
                },

                user: {
                    id: "user1",
                    emailId: "test@test.com",
                    firstName: "John"
                }
            };

            const result =
                await registrationService(req);

            expect(result.eventId)
                .toBe("event1");

            expect(sendEmail)
                .toHaveBeenCalled();
        });

        test("should fail duplicate registration", async () => {

            Registration.findOne
                .mockResolvedValue(true);

            const req = {
                params: {
                    eventId: "event1"
                },

                user: {
                    id: "user1"
                }
            };

            await expect(
                registrationService(req)
            ).rejects.toThrow(
                "User already registered for this event"
            );
        });

    });

    describe("getUserRegistrationsService", () => {

        test("should return registrations", async () => {

            const mockRegistrations = [
                {
                    _id: "1",

                    userId: {
                        firstName: "John",
                        lastName: "Doe",
                        emailId: "john@test.com"
                    },

                    eventId: {
                        _id: "event1",
                        title: "Tech Summit"
                    },

                    registrationStatus:
                        "registered"
                }
            ];

            Registration.find
                .mockReturnValue({
                    populate: jest.fn()
                        .mockReturnValue({
                            populate: jest.fn()
                                .mockResolvedValue(
                                    mockRegistrations
                                )
                        })
                });

            const result =
                await getUserRegistrationsService(
                    "user1"
                );

            expect(result[0].eventTitle)
                .toBe("Tech Summit");
        });

    });

    describe("deleteEventRegistrationService", () => {

        test("should delete registration", async () => {

            Registration.findOneAndDelete
                .mockResolvedValue({
                    _id: "1"
                });

            const req = {
                params: {
                    registrationId: "1"
                },

                user: {
                    id: "user1",
                    emailId: "test@test.com"
                }
            };

            const result =
                await deleteEventRegistrationService(
                    req
                );

            expect(result._id)
                .toBe("1");

            expect(sendEmail)
                .toHaveBeenCalled();
        });

        test("should fail if registration not found", async () => {

            Registration.findOneAndDelete
                .mockResolvedValue(null);

            const req = {
                params: {
                    registrationId: "1"
                },

                user: {
                    id: "user1"
                }
            };

            await expect(
                deleteEventRegistrationService(
                    req
                )
            ).rejects.toThrow(
                "Registration not found"
            );
        });

    });

    describe("cancelEventRegistrationService", () => {

        test("should cancel registration", async () => {

            Registration.findOneAndUpdate
                .mockResolvedValue({
                    _id: "1",
                    registrationStatus:
                        "cancelled"
                });

            const req = {
                params: {
                    registrationId: "1"
                },

                user: {
                    id: "user1",
                    emailId: "test@test.com"
                }
            };

            const result =
                await cancelEventRegistrationService(
                    req
                );

            expect(
                result.registrationStatus
            ).toBe("cancelled");

            expect(sendEmail)
                .toHaveBeenCalled();
        });

        test("should fail if registration not found", async () => {

            Registration.findOneAndUpdate
                .mockResolvedValue(null);

            const req = {
                params: {
                    registrationId: "1"
                },

                user: {
                    id: "user1"
                }
            };

            await expect(
                cancelEventRegistrationService(
                    req
                )
            ).rejects.toThrow(
                "Registration not found"
            );
        });

    });

});