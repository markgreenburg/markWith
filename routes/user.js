const router = require('express').Router();

// Register Account
router.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html');
});

//Log In
router.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

module.exports = router;