const {
    logger
} = require("../../src/middlewares/logger");

describe("logger middleware unit tests", () => {

    let req, res, next;

    beforeEach(() => {

        req = {
            url: "/api/test"
        };

        res = {};

        next = jest.fn();

        jest.spyOn(console, "log")
            .mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("should log request url and call next", () => {

        process.env.PORT = 3000;

        logger(req, res, next);

        expect(console.log)
            .toHaveBeenCalledWith(
                "-- Request received: http://localhost:3000/api/test"
            );

        expect(next)
            .toHaveBeenCalled();
    });

});