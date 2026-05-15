// mocks
jest.mock("bcrypt", () => ({
    hash: jest.fn()
}));

jest.mock("jsonwebtoken", () => ({
    sign: jest.fn()
}));

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
    getHashPassword,
    getJWT
} = require("../../src/services/authServices");

describe("auth services unit tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getHashPassword", () => {

        test("should hash password", async () => {

            process.env.SALT_ROUNDS = 10;

            bcrypt.hash
                .mockResolvedValue("hashed");

            const result =
                await getHashPassword(
                    "Strong@123"
                );

            expect(bcrypt.hash)
                .toHaveBeenCalledWith(
                    "Strong@123",
                    10
                );

            expect(result)
                .toBe("hashed");
        });

    });

    describe("getJWT", () => {

        test("should generate jwt token", async () => {

            process.env.JWT_SECRET_KEY =
                "secret";

            jwt.sign
                .mockReturnValue("token");

            const user = {
                _id: "123"
            };

            const result =
                await getJWT(user);

            expect(jwt.sign)
                .toHaveBeenCalledWith(
                    { _id: "123" },
                    "secret",
                    { expiresIn: "7d" }
                );

            expect(result)
                .toBe("token");
        });

    });

});