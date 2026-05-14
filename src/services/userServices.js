
const getUserProfileService = (user) => {
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
}