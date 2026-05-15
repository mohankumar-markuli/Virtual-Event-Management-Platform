const express = require("express");
const registrationRouter = express.Router();

const { userAuth } = require("../middlewares/appAuth");

const { registerForEvent } = require("../controllers/registrationController");

registrationRouter.use(userAuth);

registrationRouter.post('/:eventId', registerForEvent);

module.exports = registrationRouter;