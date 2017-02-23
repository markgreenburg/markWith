/**
 * Configs for localhost testing ONLY
 */
const sessionSecret = '771112af-4670-430c-9173-09fdd6801743';

const cookieOptions = {
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    httpOnly: true,
    signed: true
};

const mongoConfig = {
    db: 'mongodb://localhost/markwith'
};

const testUser = {
    _id: "58af57e20556e59b6e4fe176",
    fName: "Test",
    lName: "User",
    email: "test@user.com"
};

module.exports = {
    sessionSecret: sessionSecret,
    cookieOptions: cookieOptions,
    mongoConfig: mongoConfig,
    testUser: testUser
};
