const request = require("supertest");

const app = require("../utils/testApp");

const {
    connectTestDB,
    closeTestDB,
    clearTestDB
} = require("../utils/setup");

process.env.JWT_SECRET_KEY = "testsecret";
process.env.SALT_ROUNDS = 10;

describe("event routes integration tests", () => {

    let adminCookies;
    let attendeeCookies;
    let eventId;

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

        // admin
        await request(app)
            .post("/api/v1/auth/signup")
            .send({
                firstName: "Admin",
                lastName: "User",
                emailId: "admin@test.com",
                password: "Strong@123",
                role: "admin"
            });

        const adminLogin =
            await request(app)
                .post("/api/v1/auth/login")
                .send({
                    emailId: "admin@test.com",
                    password: "Strong@123"
                });

        adminCookies =
            adminLogin.headers["set-cookie"];

        // attendee
        await request(app)
            .post("/api/v1/auth/signup")
            .send({
                firstName: "User",
                lastName: "One",
                emailId: "user@test.com",
                password: "Strong@123"
            });

        const attendeeLogin =
            await request(app)
                .post("/api/v1/auth/login")
                .send({
                    emailId: "user@test.com",
                    password: "Strong@123"
                });

        attendeeCookies =
            attendeeLogin.headers["set-cookie"];
    });

    describe("POST /", () => {

        test("should create event successfully", async () => {

            const response =
                await request(app)
                    .post("/api/v1/events")
                    .set("Cookie", adminCookies)
                    .send({
                        title: "Tech Summit",
                        description: "event",
                        eventDate: "2099-12-10",
                        eventTime: "09:30 AM IST",
                        maxAttendees: 100
                    });

            expect(response.statusCode)
                .toBe(201);

            eventId =
                response.body.data._id;
        });

        test("should fail attendee event creation", async () => {

            const response =
                await request(app)
                    .post("/api/v1/events")
                    .set("Cookie", attendeeCookies)
                    .send({
                        title: "Tech Summit",
                        description: "event",
                        eventDate: "2099-12-10",
                        eventTime: "09:30 AM IST",
                        maxAttendees: 100
                    });

            expect(response.statusCode)
                .toBe(403);
        });

    });

    describe("GET /", () => {

        test("should fetch all events", async () => {

            await request(app)
                .post("/api/v1/events")
                .set("Cookie", adminCookies)
                .send({
                    title: "Tech Summit",
                    description: "event",
                    eventDate: "2099-12-10",
                    eventTime: "09:30 AM IST",
                    maxAttendees: 100
                });

            const response =
                await request(app)
                    .get("/api/v1/events")
                    .set("Cookie", attendeeCookies);

            expect(response.statusCode)
                .toBe(200);

            expect(response.body.data.length)
                .toBeGreaterThan(0);
        });

    });

    describe("GET /:id", () => {

        test("should fetch single event", async () => {

            const createResponse =
                await request(app)
                    .post("/api/v1/events")
                    .set("Cookie", adminCookies)
                    .send({
                        title: "Tech Summit",
                        description: "event",
                        eventDate: "2099-12-10",
                        eventTime: "09:30 AM IST",
                        maxAttendees: 100
                    });

            eventId =
                createResponse.body.data._id;

            const response =
                await request(app)
                    .get(`/api/v1/events/${eventId}`)
                    .set("Cookie", attendeeCookies);

            expect(response.statusCode)
                .toBe(200);

            expect(response.body.data._id)
                .toBe(eventId);
        });

    });

});