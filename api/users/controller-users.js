var express = require('express');
var router = express.Router();
const User = require('../models/user');
const db = require('../../config/config').get(process.env.NODE_ENV);
const log = require("../../global/console");


const {
    registerUser,
    loginUser,
    logoutUser,
    getUserByToken,
    verificationEmail,
    forgetPassword,
    resetPassword,
    sendEmailAgain
} = require('./actions-users');







/* register user */

router.post('/register', async (req, res) => {
    res.send(await registerUser(new User(req.body)));
});

/* ********************************* */






/* login user */

router.post('/login', async (req, res) => {
    res.send(await loginUser(User(req.body)));
});

/* ********************************* */






/* logout user */

router.post('/logout', async (req, res) => {
    res.send(await logoutUser(req.body));
});

/* ********************************* */






/* get user name by token */

router.post('/get-user-by-token', async (req, res) => {
    res.send(await getUserByToken(req.body));
})

/* ********************************* */






/* verification email when user register */

router.post('/verification-email', async (req, res) => {
    res.send(await verificationEmail(req.body));
})

/* ********************************* */






/* send email in case that user forget password */

router.post('/forget-password', async (req, res) => {
    res.send(await forgetPassword(req.body));
})

/* ********************************* */






/* rest password to user */

router.post('/reset-password', async (req, res) => {
    res.send(await resetPassword(req.body));
})

/* ********************************* */






/* send email again in case that mail dont sended */

router.post('/send-email-again', async (req, res) => {
    res.send(await sendEmailAgain(req.body));
})

/* ********************************* */






module.exports = router;
