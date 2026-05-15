const request = require("supertest");

const app = require("../utils/testApp");

const {
    connectTestDB,
    closeTestDB,
    clearTestDB
} = require("../utils/setup");

const User =
    require("../../src/models/userModel");

process.env.JWT_SECRET_KEY = "testsecret";
process.env.SALT_ROUNDS = 10;

describe("auth routes integration tests", () => {

    beforeAll(async () => {
        await connectTestDB();
    });

    afterAll(async () => {
        await closeTestDB();
    });

    afterEach(async () => {
        await clearTestDB();
    });

    // signup
    describe("POST /signup", () => {

        test("should signup successfully", async () => {

            const response =
                await request(app)
                    .post("/api/v1/auth/signup")
                    .send({
                        firstName: "John",
                        lastName: "Doe",
                        emailId: "john@test.com",
                        password: "Strong@123"
                    });

            expect(response.statusCode)
                .toBe(201);

            expect(response.body.message)
                .toBe(
                    "User John registered successfully"
                );

            const user =
                await User.findOne({
                    emailId: "john@test.com"
                });

            expect(user).not.toBeNull();
        });

        test("should fail duplicate signup", async () => {

            await request(app)
                .post("/api/v1/auth/signup")
                .send({
                    firstName: "John",
                    lastName: "Doe",
                    emailId: "john@test.com",
                    password: "Strong@123"
                });

            const response =
                await request(app)
                    .post("/api/v1/auth/signup")
                    .send({
                        firstName: "John",
                        lastName: "Doe",
                        emailId: "john@test.com",
                        password: "Strong@123"
                    });

            expect(response.statusCode)
                .toBe(400);
        });

        test("should fail invalid email", async () => {

            const response =
                await request(app)
                    .post("/api/v1/auth/signup")
                    .send({
                        firstName: "John",
                        lastName: "Doe",
                        emailId: "invalid",
                        password: "Strong@123"
                    });

            expect(response.statusCode)
                .toBe(500);
        });

    });

    // login
    describe("POST /login", () => {

        beforeEach(async () => {

            await request(app)
                .post("/api/v1/auth/signup")
                .send({
                    firstName: "John",
                    lastName: "Doe",
                    emailId: "john@test.com",
                    password: "Strong@123"
                });
        });

        test("should login successfully", async () => {

            const response =
                await request(app)
                    .post("/api/v1/auth/login")
                    .send({
                        emailId: "john@test.com",
                        password: "Strong@123"
                    });

            expect(response.statusCode)
                .toBe(200);

            expect(response.body.message)
                .toBe(
                    "John Logged In Successfully"
                );

            expect(
                response.headers["set-cookie"]
            ).toBeDefined();
        });

        test("should fail invalid password", async () => {

            const response =
                await request(app)
                    .post("/api/v1/auth/login")
                    .send({
                        emailId: "john@test.com",
                        password: "Wrong@123"
                    });

            expect(response.statusCode)
                .toBe(401);
        });

        test("should fail invalid email", async () => {

            const response =
                await request(app)
                    .post("/api/v1/auth/login")
                    .send({
                        emailId: "wrong@test.com",
                        password: "Strong@123"
                    });

            expect(response.statusCode)
                .toBe(404);
        });

    });

    // logout
    describe("POST /logout", () => {

        test("should logout successfully", async () => {

            await request(app)
                .post("/api/v1/auth/signup")
                .send({
                    firstName: "John",
                    lastName: "Doe",
                    emailId: "john@test.com",
                    password: "Strong@123"
                });

            const loginResponse =
                await request(app)
                    .post("/api/v1/auth/login")
                    .send({
                        emailId: "john@test.com",
                        password: "Strong@123"
                    });

            const cookies =
                loginResponse.headers["set-cookie"];

            const response =
                await request(app)
                    .post("/api/v1/auth/logout")
                    .set("Cookie", cookies);

            expect(response.statusCode)
                .toBe(200);

            expect(response.body.message)
                .toBe(
                    "Logout Successful"
                );
        });

        test("should fail without token", async () => {

            const response =
                await request(app)
                    .post("/api/v1/auth/logout");

            expect(response.statusCode)
                .toBe(401);
        });

    });

});