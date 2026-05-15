// mocks
jest.mock("bcrypt", () => ({
    compare: jest.fn()
}));

const bcrypt = require("bcrypt");

const {
    validateSignUpData,
    validatePassword,
    validateEditUserData,
    validateChangePassword,
    validateCreateEventData,
    validateEventUpdateData
} = require("../../src/middlewares/validator");

describe("validator middleware unit tests", () => {

    let req, res, next;

    beforeEach(() => {

        req = {
            body: {},
            user: {
                password: "hashedPassword"
            }
        };

        res = {};

        next = jest.fn();

        jest.clearAllMocks();
    });

    // validateSignUpData
    describe("validateSignUpData", () => {

        test("should validate signup data", () => {

            req.body = {
                firstName: "John",
                lastName: "Doe",
                emailId: "john@test.com",
                password: "Strong@123",
                role: "attendee"
            };

            validateSignUpData(req, res, next);

            expect(next)
                .toHaveBeenCalled();
        });

        test("should fail missing first name", () => {

            req.body = {
                emailId: "john@test.com",
                password: "Strong@123"
            };

            validateSignUpData(req, res, next);

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

        test("should fail invalid first name type", () => {

            req.body = {
                firstName: 123,
                emailId: "john@test.com",
                password: "Strong@123"
            };

            validateSignUpData(req, res, next);

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

        test("should fail short first name", () => {

            req.body = {
                firstName: "J",
                emailId: "john@test.com",
                password: "Strong@123"
            };

            validateSignUpData(req, res, next);

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

        test("should fail invalid lastname type", () => {

            req.body = {
                firstName: "John",
                lastName: 123,
                emailId: "john@test.com",
                password: "Strong@123"
            };

            validateSignUpData(req, res, next);

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

        test("should fail missing email", () => {

            req.body = {
                firstName: "John",
                password: "Strong@123"
            };

            validateSignUpData(req, res, next);

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

        test("should fail invalid email", () => {

            req.body = {
                firstName: "John",
                emailId: "invalid",
                password: "Strong@123"
            };

            validateSignUpData(req, res, next);

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

        test("should fail missing password", () => {

            req.body = {
                firstName: "John",
                emailId: "john@test.com"
            };

            validateSignUpData(req, res, next);

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

        test("should fail weak password", () => {

            req.body = {
                firstName: "John",
                emailId: "john@test.com",
                password: "123"
            };

            validateSignUpData(req, res, next);

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

        test("should fail invalid role", () => {

            req.body = {
                firstName: "John",
                emailId: "john@test.com",
                password: "Strong@123",
                role: "superadmin"
            };

            validateSignUpData(req, res, next);

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

    });

    // validatePassword
    describe("validatePassword", () => {

        test("should validate password", async () => {

            bcrypt.compare
                .mockResolvedValue(true);

            const user = {
                password: "hashed"
            };

            const result =
                await validatePassword(
                    user,
                    "Strong@123"
                );

            expect(bcrypt.compare)
                .toHaveBeenCalledWith(
                    "Strong@123",
                    "hashed"
                );

            expect(result)
                .toBe(true);
        });

        test("should fail invalid password", async () => {

            bcrypt.compare
                .mockResolvedValue(false);

            const user = {
                password: "hashed"
            };

            const result =
                await validatePassword(
                    user,
                    "Wrong@123"
                );

            expect(result)
                .toBe(false);
        });

    });

    // validateEditUserData
    describe("validateEditUserData", () => {

        test("should validate edit fields", () => {

            req.body = {
                firstName: "Updated"
            };

            validateEditUserData(
                req,
                res,
                next
            );

            expect(next)
                .toHaveBeenCalled();
        });

        test("should fail empty body", () => {

            req.body = {};

            validateEditUserData(
                req,
                res,
                next
            );

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

        test("should fail restricted field update", () => {

            req.body = {
                role: "admin"
            };

            validateEditUserData(
                req,
                res,
                next
            );

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

        test("should fail invalid field update", () => {

            req.body = {
                age: 25
            };

            validateEditUserData(
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

    // validateChangePassword
    describe("validateChangePassword", () => {

        test("should validate password change", async () => {

            req.body = {
                password: "Old@123",
                newPassword: "New@1234"
            };

            bcrypt.compare
                .mockResolvedValueOnce(true)
                .mockResolvedValueOnce(false);

            await validateChangePassword(
                req,
                res,
                next
            );

            expect(next)
                .toHaveBeenCalled();
        });

        test("should fail missing passwords", async () => {

            req.body = {};

            await validateChangePassword(
                req,
                res,
                next
            );

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

        test("should fail weak new password", async () => {

            req.body = {
                password: "Old@123",
                newPassword: "123"
            };

            await validateChangePassword(
                req,
                res,
                next
            );

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

        test("should fail if old password incorrect", async () => {

            req.body = {
                password: "wrong",
                newPassword: "New@1234"
            };

            bcrypt.compare
                .mockResolvedValue(false);

            await validateChangePassword(
                req,
                res,
                next
            );

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

        test("should fail same password reuse", async () => {

            req.body = {
                password: "Old@123",
                newPassword: "Old@123"
            };

            bcrypt.compare
                .mockResolvedValueOnce(true)
                .mockResolvedValueOnce(true);

            await validateChangePassword(
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

    // validateCreateEventData
    describe("validateCreateEventData", () => {

        test("should validate create event data", () => {

            req.body = {
                title: "Tech Summit",
                description: "event",
                eventDate: "2099-12-10",
                eventTime: "09:30 AM IST",
                maxAttendees: 100
            };

            validateCreateEventData(
                req,
                res,
                next
            );

            expect(next)
                .toHaveBeenCalled();
        });

        test("should fail missing title", () => {

            req.body = {
                eventDate: "2099-12-10",
                eventTime: "09:30 AM IST",
                maxAttendees: 100
            };

            validateCreateEventData(
                req,
                res,
                next
            );

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

        test("should fail invalid title type", () => {

            req.body = {
                title: 123,
                eventDate: "2099-12-10",
                eventTime: "09:30 AM IST",
                maxAttendees: 100
            };

            validateCreateEventData(
                req,
                res,
                next
            );

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

        test("should fail invalid date", () => {

            req.body = {
                title: "Tech Summit",
                eventDate: "invalid-date",
                eventTime: "09:30 AM IST",
                maxAttendees: 100
            };

            validateCreateEventData(
                req,
                res,
                next
            );

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

        test("should fail past date", () => {

            req.body = {
                title: "Tech Summit",
                eventDate: "2020-01-01",
                eventTime: "09:30 AM IST",
                maxAttendees: 100
            };

            validateCreateEventData(
                req,
                res,
                next
            );

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

        test("should fail invalid event time", () => {

            req.body = {
                title: "Tech Summit",
                eventDate: "2099-12-10",
                eventTime: "25:00",
                maxAttendees: 100
            };

            validateCreateEventData(
                req,
                res,
                next
            );

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

        test("should fail invalid attendees type", () => {

            req.body = {
                title: "Tech Summit",
                eventDate: "2099-12-10",
                eventTime: "09:30 AM IST",
                maxAttendees: "100"
            };

            validateCreateEventData(
                req,
                res,
                next
            );

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

        test("should fail max attendees less than 1", () => {

            req.body = {
                title: "Tech Summit",
                eventDate: "2099-12-10",
                eventTime: "09:30 AM IST",
                maxAttendees: 0
            };

            validateCreateEventData(
                req,
                res,
                next
            );

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

        test("should fail max attendees overflow", () => {

            req.body = {
                title: "Tech Summit",
                eventDate: "2099-12-10",
                eventTime: "09:30 AM IST",
                maxAttendees: 5000
            };

            validateCreateEventData(
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

    // validateEventUpdateData
    describe("validateEventUpdateData", () => {

        test("should validate update event data", () => {

            req.body = {
                title: "Updated Event"
            };

            validateEventUpdateData(
                req,
                res,
                next
            );

            expect(next)
                .toHaveBeenCalled();
        });

        test("should fail empty update body", () => {

            req.body = {};

            validateEventUpdateData(
                req,
                res,
                next
            );

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

        test("should fail restricted update field", () => {

            req.body = {
                organizer: "123"
            };

            validateEventUpdateData(
                req,
                res,
                next
            );

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

        test("should fail invalid update field", () => {

            req.body = {
                venue: "Bangalore"
            };

            validateEventUpdateData(
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