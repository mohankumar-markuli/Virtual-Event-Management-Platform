// mocks
jest.mock("../../src/services/authServices", () => ({
    getHashPassword: jest.fn(),
    getJWT: jest.fn()
}));

jest.mock("../../src/middlewares/validator", () => ({
    validatePassword: jest.fn()
}));

jest.mock("../../src/models/userModel", () => {
    const mUser = jest.fn();
    mUser.findOne = jest.fn();
    return mUser;
});

const {
    getHashPassword,
    getJWT
} = require("../../src/services/authServices");

const {
    validatePassword
} = require("../../src/middlewares/validator");

const User = require("../../src/models/userModel");

const {
    userSignUp,
    userLogin,
    userlogout
} = require("../../src/controllers/authController");

describe("auth controller unit tests", () => {

    let req, res, next;

    beforeEach(() => {

        req = {
            body: {},
            cookies: {}
        };

        res = {
            cookie: jest.fn(),
            clearCookie: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        next = jest.fn();

        jest.clearAllMocks();
    });

    // signup
    describe("userSignUp", () => {

        test("should signup user successfully", async () => {

            User.findOne.mockResolvedValue(null);

            getHashPassword
                .mockResolvedValue("hashedPassword");

            const mockSavedUser = {
                _id: "123",
                firstName: "Test",
                lastName: "User",
                emailId: "test@test.com",
                role: "attendee"
            };

            User.mockImplementation(() => ({
                save: jest.fn()
                    .mockResolvedValue(mockSavedUser)
            }));

            getJWT.mockResolvedValue("token");

            req.body = {
                firstName: "Test",
                lastName: "User",
                emailId: "test@test.com",
                password: "Strong@123",
                role: "attendee"
            };

            await userSignUp(req, res, next);

            expect(User.findOne)
                .toHaveBeenCalledWith({
                    emailId: "test@test.com"
                });

            expect(getHashPassword)
                .toHaveBeenCalledWith(
                    "Strong@123"
                );

            expect(getJWT)
                .toHaveBeenCalledWith(
                    mockSavedUser
                );

            expect(res.cookie)
                .toHaveBeenCalled();

            expect(res.status)
                .toHaveBeenCalledWith(201);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message:
                        "User Test registered successfully",

                    data: {
                        _id: "123",
                        firstName: "Test",
                        lastName: "User",
                        emailId: "test@test.com",
                        role: "attendee"
                    }
                });
        });

        test("should fail if user already exists", async () => {

            User.findOne.mockResolvedValue({
                emailId: "test@test.com"
            });

            req.body = {
                firstName: "Test",
                emailId: "test@test.com",
                password: "Strong@123"
            };

            await userSignUp(req, res, next);

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

    });

    // login
    describe("userLogin", () => {

        test("should login successfully", async () => {

            const mockUser = {
                _id: "123",
                firstName: "Test",
                lastName: "User",
                emailId: "test@test.com",
                role: "attendee",
                password: "hashed"
            };

            User.findOne
                .mockResolvedValue(mockUser);

            validatePassword
                .mockResolvedValue(true);

            getJWT.mockResolvedValue("token");

            req.body = {
                emailId: "test@test.com",
                password: "Strong@123"
            };

            await userLogin(req, res, next);

            expect(validatePassword)
                .toHaveBeenCalledWith(
                    mockUser,
                    "Strong@123"
                );

            expect(getJWT)
                .toHaveBeenCalledWith(
                    mockUser
                );

            expect(res.cookie)
                .toHaveBeenCalled();

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message:
                        "Test Logged In Successfully",

                    data: {
                        _id: "123",
                        firstName: "Test",
                        lastName: "User",
                        emailId: "test@test.com",
                        role: "attendee"
                    }
                });
        });

        test("should fail if email or password missing", async () => {

            req.body = {
                emailId: "test@test.com"
            };

            await userLogin(req, res, next);

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

        test("should fail if user not found", async () => {

            User.findOne.mockResolvedValue(null);

            req.body = {
                emailId: "test@test.com",
                password: "Strong@123"
            };

            await userLogin(req, res, next);

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

        test("should fail if password invalid", async () => {

            const mockUser = {
                password: "hashed"
            };

            User.findOne
                .mockResolvedValue(mockUser);

            validatePassword
                .mockResolvedValue(false);

            req.body = {
                emailId: "test@test.com",
                password: "Wrong@123"
            };

            await userLogin(req, res, next);

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

    });

    // logout
    describe("userlogout", () => {

        test("should logout successfully", async () => {

            await userlogout(req, res, next);

            expect(res.clearCookie)
                .toHaveBeenCalledWith(
                    "token",
                    {
                        httpOnly: true,
                        sameSite: "strict"
                    }
                );

            expect(res.json)
                .toHaveBeenCalledWith({
                    message:
                        "Logout Successful"
                });
        });

        test("should call next on error", async () => {

            res.clearCookie
                .mockImplementation(() => {
                    throw new Error(
                        "logout error"
                    );
                });

            await userlogout(req, res, next);

            expect(next)
                .toHaveBeenCalledWith(
                    expect.any(Error)
                );
        });

    });

});