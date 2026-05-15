jest.mock("../../src/services/authServices", () => ({
    getHashPassword: jest.fn()
}));

const {
    getHashPassword
} = require("../../src/services/authServices");

const {
    getUserProfileService,
    updateUserService,
    changePasswordService
} = require("../../src/services/userServices");

describe("user services unit tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // getUserProfileService
    describe("getUserProfileService", () => {

        test("should return formatted user profile", () => {

            const user = {
                _id: "1",
                firstName: "John",
                lastName: "Doe",
                emailId: "john@test.com",
                role: "attendee"
            };

            const result =
                getUserProfileService(user);

            expect(result).toEqual({
                _id: "1",
                firstName: "John",
                lastName: "Doe",
                emailId: "john@test.com",
                role: "attendee"
            });
        });

    });

    // updateUserService
    describe("updateUserService", () => {

        test("should update user profile successfully", async () => {

            const user = {
                _id: "1",
                firstName: "John",
                lastName: "Doe",
                emailId: "john@test.com",
                role: "attendee",

                save: jest.fn()
                    .mockResolvedValue(true)
            };

            const updateData = {
                firstName: "Updated"
            };

            const result =
                await updateUserService(
                    user,
                    updateData
                );

            expect(user.firstName)
                .toBe("Updated");

            expect(user.save)
                .toHaveBeenCalled();

            expect(result).toEqual({
                _id: "1",
                firstName: "Updated",
                lastName: "Doe",
                emailId: "john@test.com",
                role: "attendee"
            });
        });

        test("should update multiple fields", async () => {

            const user = {
                _id: "1",
                firstName: "John",
                lastName: "Doe",
                emailId: "john@test.com",
                role: "attendee",

                save: jest.fn()
                    .mockResolvedValue(true)
            };

            const updateData = {
                firstName: "Jane",
                lastName: "Smith"
            };

            const result =
                await updateUserService(
                    user,
                    updateData
                );

            expect(result.firstName)
                .toBe("Jane");

            expect(result.lastName)
                .toBe("Smith");

            expect(user.save)
                .toHaveBeenCalled();
        });

    });

    // changePasswordService
    describe("changePasswordService", () => {

        test("should change password successfully", async () => {

            getHashPassword
                .mockResolvedValue(
                    "hashedPassword"
                );

            const user = {
                password: "oldPassword",

                save: jest.fn()
                    .mockResolvedValue(true)
            };

            const result =
                await changePasswordService(
                    user,
                    "New@1234"
                );

            expect(getHashPassword)
                .toHaveBeenCalledWith(
                    "New@1234"
                );

            expect(user.password)
                .toBe("hashedPassword");

            expect(user.save)
                .toHaveBeenCalled();

            expect(result)
                .toBe(true);
        });

        test("should throw if hashing fails", async () => {

            getHashPassword
                .mockRejectedValue(
                    new Error("Hash failed")
                );

            const user = {
                password: "oldPassword",

                save: jest.fn()
            };

            await expect(
                changePasswordService(
                    user,
                    "New@1234"
                )
            ).rejects.toThrow(
                "Hash failed"
            );
        });

    });

});