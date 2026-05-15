// mocks
jest.mock("jsonwebtoken", () => ({
    verify: jest.fn()
}));

jest.mock("../../src/models/userModel", () => ({
    findById: jest.fn()
}));

const jwt = require("jsonwebtoken");
const User = require("../../src/models/userModel");

const {
    userAuth,
    admin
} = require("../../src/middlewares/appAuth");

describe("app auth middleware unit tests", () => {

    let req, res, next;

    beforeEach(() => {

        req = {
            cookies: {},
            user: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        next = jest.fn();

        jest.clearAllMocks();
    });

    // admin middleware
    describe("admin", () => {

        test("should allow organizer", () => {

            req.user.role = "organizer";

            admin(req, res, next);

            expect(next)
                .toHaveBeenCalled();
        });

        test("should allow admin", () => {

            req.user.role = "admin";

            admin(req, res, next);

            expect(next)
                .toHaveBeenCalled();
        });

        test("should deny attendee", () => {

            req.user.role = "attendee";

            admin(req, res, next);

            expect(res.status)
                .toHaveBeenCalledWith(403);

            expect(res.send)
                .toHaveBeenCalledWith(
                    "Access denied"
                );
        });

    });

    // userAuth middleware
    describe("userAuth", () => {

        test("should authenticate user successfully", async () => {

            req.cookies.token = "validToken";

            jwt.verify.mockReturnValue({
                _id: "123"
            });

            const mockUser = {
                _id: "123",
                firstName: "test"
            };

            User.findById
                .mockResolvedValue(mockUser);

            await userAuth(req, res, next);

            expect(jwt.verify)
                .toHaveBeenCalledWith(
                    "validToken",
                    process.env.JWT_SECRET_KEY
                );

            expect(User.findById)
                .toHaveBeenCalledWith("123");

            expect(req.user)
                .toEqual(mockUser);

            expect(next)
                .toHaveBeenCalled();
        });

        test("should fail if token missing", async () => {

            await userAuth(req, res, next);

            expect(res.status)
                .toHaveBeenCalledWith(401);

            expect(res.send)
                .toHaveBeenCalledWith(
                    "Please login"
                );
        });

        test("should fail if user not found", async () => {

            req.cookies.token = "validToken";

            jwt.verify.mockReturnValue({
                _id: "123"
            });

            User.findById
                .mockResolvedValue(null);

            await userAuth(req, res, next);

            expect(res.status)
                .toHaveBeenCalledWith(401);

            expect(res.send)
                .toHaveBeenCalledWith(
                    "User not found"
                );
        });

        test("should fail if jwt invalid", async () => {

            req.cookies.token = "invalid";

            jwt.verify.mockImplementation(() => {
                throw new Error("Invalid token");
            });

            await userAuth(req, res, next);

            expect(res.status)
                .toHaveBeenCalledWith(401);

            expect(res.send)
                .toHaveBeenCalledWith(
                    "Invalid token"
                );
        });

    });

});