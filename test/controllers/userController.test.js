// mocks
jest.mock("../../src/services/userServices", () => ({
    getUserProfileService: jest.fn(),
    updateUserService: jest.fn(),
    changePasswordService: jest.fn()
}));

const {
    getUserProfileService,
    updateUserService,
    changePasswordService
} = require("../../src/services/userServices");

const {
    viewUser,
    editUser,
    changePassword
} = require("../../src/controllers/userController");

describe("user controller unit tests", () => {

    let req, res, next;

    beforeEach(() => {

        req = {
            user: {
                _id: "123",
                firstName: "test",
                save: jest.fn()
            },
            body: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            clearCookie: jest.fn()
        };

        next = jest.fn();

        jest.clearAllMocks();
    });

    // viewUser
    describe("viewUser", () => {

        test("should return user profile", async () => {

            const mockData = {
                name: "test"
            };

            getUserProfileService
                .mockReturnValue(mockData);

            await viewUser(req, res, next);

            expect(
                getUserProfileService
            ).toHaveBeenCalledWith(
                req.user
            );

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message:
                        "User test fetched successfully",

                    data: mockData
                });
        });

        test("should call next on error", async () => {

            getUserProfileService
                .mockImplementation(() => {
                    throw new Error("error");
                });

            await viewUser(req, res, next);

            expect(next)
                .toHaveBeenCalled();
        });

    });

    // editUser
    describe("editUser", () => {

        test("should update user profile", async () => {

            const updatedUser = {
                firstName: "updated"
            };

            updateUserService
                .mockResolvedValue(
                    updatedUser
                );

            req.body = {
                firstName: "updated"
            };

            await editUser(req, res, next);

            expect(updateUserService)
                .toHaveBeenCalledWith(
                    req.user,
                    req.body
                );

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message:
                        "Profile Updated Successfully",

                    data: updatedUser
                });
        });

        test("should call next on error", async () => {

            updateUserService
                .mockRejectedValue(
                    new Error("error")
                );

            await editUser(req, res, next);

            expect(next)
                .toHaveBeenCalled();
        });

    });

    // changePassword
    describe("changePassword", () => {

        test("should change password successfully", async () => {

            changePasswordService
                .mockResolvedValue(true);

            req.body = {
                newPassword: "Strong@123"
            };

            await changePassword(
                req,
                res,
                next
            );

            expect(
                changePasswordService
            ).toHaveBeenCalledWith(
                req.user,
                "Strong@123"
            );

            expect(res.clearCookie)
                .toHaveBeenCalledWith(
                    "token",
                    {
                        httpOnly: true,
                        sameSite: "strict"
                    }
                );

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message:
                        "Password Changed Successfully"
                });
        });

        test("should call next on error", async () => {

            changePasswordService
                .mockRejectedValue(
                    new Error("error")
                );

            await changePassword(
                req,
                res,
                next
            );

            expect(next)
                .toHaveBeenCalled();
        });

    });

});