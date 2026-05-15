const express = require("express");
const registrationRouter = express.Router();

const { userAuth } = require("../middlewares/appAuth");

const { registerForEvent, getUserRegistrations } = require("../controllers/registrationController");

registrationRouter.use(userAuth);

registrationRouter.post('/:eventId', registerForEvent);
registrationRouter.get('/myRegistrations', getUserRegistrations);

module.exports = registrationRouter;