const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Registration =
    require("../../src/models/registerationModel");

let mongoServer;

describe("registration model integration tests", () => {

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

        await Registration.deleteMany({});
    });

    test("should create registration successfully", async () => {

        const registration =
            new Registration({

                eventId:
                    new mongoose.Types.ObjectId(),

                userId:
                    new mongoose.Types.ObjectId()
            });

        const savedRegistration =
            await registration.save();

        expect(savedRegistration._id)
            .toBeDefined();

        expect(
            savedRegistration.registrationStatus
        ).toBe("registered");
    });

    test("should fail missing eventId", async () => {

        const registration =
            new Registration({

                userId:
                    new mongoose.Types.ObjectId()
            });

        await expect(
            registration.save()
        ).rejects.toThrow();
    });

    test("should fail missing userId", async () => {

        const registration =
            new Registration({

                eventId:
                    new mongoose.Types.ObjectId()
            });

        await expect(
            registration.save()
        ).rejects.toThrow();
    });

    test("should fail invalid registration status", async () => {

        const registration =
            new Registration({

                eventId:
                    new mongoose.Types.ObjectId(),

                userId:
                    new mongoose.Types.ObjectId(),

                registrationStatus:
                    "invalid"
            });

        await expect(
            registration.save()
        ).rejects.toThrow();
    });

});