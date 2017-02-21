/**
 * Configs
 */

const sessionSecret = '771112af-4670-430c-9173-09fdd6801743';
const cookieOptions = {
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    httpOnly: true,
    signed: true
};


module.exports = {
    sessionSecret: sessionSecret,
    cookieOptions: cookieOptions
};
