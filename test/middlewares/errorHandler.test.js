const {
    errorHandler
} = require("../../src/middlewares/errorHandler");

describe("error handler middleware unit tests", () => {

    let req, res, next;

    beforeEach(() => {

        req = {};

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        next = jest.fn();
    });

    test("should handle error with statusCode", () => {

        const err = {
            statusCode: 400,
            message: "Bad Request"
        };

        errorHandler(err, req, res, next);

        expect(res.status)
            .toHaveBeenCalledWith(400);

        expect(res.json)
            .toHaveBeenCalledWith({
                message: "Bad Request"
            });
    });

    test("should handle error with status", () => {

        const err = {
            status: 404,
            message: "Not Found"
        };

        errorHandler(err, req, res, next);

        expect(res.status)
            .toHaveBeenCalledWith(404);

        expect(res.json)
            .toHaveBeenCalledWith({
                message: "Not Found"
            });
    });

    test("should handle unknown error", () => {

        const err = {};

        errorHandler(err, req, res, next);

        expect(res.status)
            .toHaveBeenCalledWith(500);

        expect(res.json)
            .toHaveBeenCalledWith({
                message:
                    "Internal Server Error"
            });
    });

});