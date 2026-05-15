jest.mock("../../src/utils/emailHelper", () => ({
    sendEmail: jest.fn()
}));

const request = require("supertest");

const app = require("../utils/testApp");

const {
    connectTestDB,
    closeTestDB,
    clearTestDB
} = require("../utils/setup");

process.env.JWT_SECRET_KEY = "testsecret";
process.env.SALT_ROUNDS = 10;

describe("registration routes integration tests", () => {

    let cookies;
    let eventId;
    let registrationId;

    beforeAll(async () => {
        await connectTestDB();
    });

    afterAll(async () => {
        await closeTestDB();
    });

    afterEach(async () => {
        await clearTestDB();
    });

    beforeEach(async () => {

        // signup admin user
        await request(app)
            .post("/api/v1/auth/signup")
            .send({
                firstName: "Admin",
                lastName: "User",
                emailId: "admin@test.com",
                password: "Strong@123",
                role: "admin"
            });

        // login admin user
        const loginResponse =
            await request(app)
                .post("/api/v1/auth/login")
                .send({
                    emailId: "admin@test.com",
                    password: "Strong@123"
                });

        cookies =
            loginResponse.headers["set-cookie"];

        // create event
        const eventResponse =
            await request(app)
                .post("/api/v1/events")
                .set("Cookie", cookies)
                .send({
                    title: "Tech Summit",
                    description: "event description",
                    eventDate: "2099-12-10",
                    eventTime: "09:30 AM IST",
                    maxAttendees: 100
                });

        eventId =
            eventResponse.body.data._id;
    });

    // POST /:eventId/register
    describe("POST /:eventId/register", () => {

        test("should register successfully", async () => {

            const response =
                await request(app)
                    .post(
                        `/api/v1/registration/${eventId}/register`
                    )
                    .set("Cookie", cookies);

            expect(response.statusCode)
                .toBe(201);

            expect(response.body.data)
                .toBeDefined();

            registrationId =
                response.body.data._id;
        });

        test("should fail duplicate registration", async () => {

            await request(app)
                .post(
                    `/api/v1/registration/${eventId}/register`
                )
                .set("Cookie", cookies);

            const response =
                await request(app)
                    .post(
                        `/api/v1/registration/${eventId}/register`
                    )
                    .set("Cookie", cookies);

            expect(response.statusCode)
                .toBe(500);
        });

        test("should fail without token", async () => {

            const response =
                await request(app)
                    .post(
                        `/api/v1/registration/${eventId}/register`
                    );

            expect(response.statusCode)
                .toBe(401);
        });

    });

    // GET /myRegistrations
    describe("GET /myRegistrations", () => {

        test("should fetch registrations", async () => {

            await request(app)
                .post(
                    `/api/v1/registration/${eventId}/register`
                )
                .set("Cookie", cookies);

            const response =
                await request(app)
                    .get(
                        "/api/v1/registration/myRegistrations"
                    )
                    .set("Cookie", cookies);

            expect(response.statusCode)
                .toBe(200);

            expect(response.body.data.length)
                .toBeGreaterThan(0);
        });

    });

    // DELETE /myRegistrations/:registrationId
    describe("DELETE /myRegistrations/:registrationId", () => {

        test("should delete registration successfully", async () => {

            const registrationResponse =
                await request(app)
                    .post(
                        `/api/v1/registration/${eventId}/register`
                    )
                    .set("Cookie", cookies);

            registrationId =
                registrationResponse.body.data._id;

            const response =
                await request(app)
                    .delete(
                        `/api/v1/registration/myRegistrations/${registrationId}`
                    )
                    .set("Cookie", cookies);

            expect(response.statusCode)
                .toBe(200);
        });

    });

    // PATCH /myRegistrations/:registrationId/cancel
    describe("PATCH /myRegistrations/:registrationId/cancel", () => {

        test("should cancel registration successfully", async () => {

            const registrationResponse =
                await request(app)
                    .post(
                        `/api/v1/registration/${eventId}/register`
                    )
                    .set("Cookie", cookies);

            registrationId =
                registrationResponse.body.data._id;

            const response =
                await request(app)
                    .patch(
                        `/api/v1/registration/myRegistrations/${registrationId}/cancel`
                    )
                    .set("Cookie", cookies);

            expect(response.statusCode)
                .toBe(200);

            expect(response.body.message)
                .toBe(
                    "Event registration cancelled successfully"
                );
        });

    });

});