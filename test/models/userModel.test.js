const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const User = require("../../src/models/userModel");

let mongoServer;

describe("user model integration tests", () => {

    beforeAll(async () => {

        mongoServer =
            await MongoMemoryServer.create();

        await mongoose.connect(
            mongoServer.getUri()
        );
    });

    afterAll(async () => {

        await mongoose.disconnect();

        await mongoServer.stop();
    });

    afterEach(async () => {

        await User.deleteMany({});
    });

    test("should create user successfully", async () => {

        const user = new User({
            firstName: "John",
            lastName: "Doe",
            emailId: "john@test.com",
            password: "Strong@123",
            role: "attendee"
        });

        const savedUser =
            await user.save();

        expect(savedUser._id)
            .toBeDefined();

        expect(savedUser.emailId)
            .toBe("john@test.com");
    });

    test("should fail invalid email", async () => {

        const user = new User({
            firstName: "John",
            emailId: "invalid",
            password: "Strong@123"
        });

        await expect(
            user.save()
        ).rejects.toThrow(
            "Email is not valid"
        );
    });

    test("should fail weak password", async () => {

        const user = new User({
            firstName: "John",
            emailId: "john@test.com",
            password: "weak"
        });

        await expect(
            user.save()
        ).rejects.toThrow(
            "Enter a Strong Password"
        );
    });

    test("should fail invalid role", async () => {

        const user = new User({
            firstName: "John",
            emailId: "john@test.com",
            password: "Strong@123",
            role: "superadmin"
        });

        await expect(
            user.save()
        ).rejects.toThrow();
    });

});