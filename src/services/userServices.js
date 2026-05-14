
const getUserProfileService = (user) => {
    return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        role: user.role
    };
};

const updateUserService = async (user, updateData) => {
    Object.keys(updateData).forEach((key) => {
        user[key] = updateData[key];
    });

    await user.save();

    return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        role: user.role
    };
};

module.exports = {
    getUserProfileService,
    updateUserService
}