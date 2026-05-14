const express = require("express");
const userRouter = express.Router();


const { userAuth } = require("../middlewares/userAuth");
const { viewUser, editUser } = require("../controllers/userController");
const { validateEditUserData } = require("../middlewares/validator");


userRouter.use(userAuth);

userRouter.get('/profile', viewUser);
userRouter.patch('/profile', validateEditUserData, editUser);

module.exports = userRouter; 