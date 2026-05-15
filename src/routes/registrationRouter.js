const express = require("express");
const registrationRouter = express.Router();

const { userAuth } = require("../middlewares/appAuth");

const { registerForEvent,
    getUserRegistrations,
    deleteEventRegistration,
    cancelEventRegistration
} = require("../controllers/registrationController");

registrationRouter.use(userAuth);

registrationRouter.post('/:eventId/register', registerForEvent);
registrationRouter.get('/myRegistrations', getUserRegistrations);
registrationRouter.delete('/myRegistrations/:registrationId', deleteEventRegistration);
registrationRouter.patch('/myRegistrations/:registrationId/cancel', cancelEventRegistration);

module.exports = registrationRouter;