const User = require('../models/user');
const mongoose = require('mongoose');
const log = require("../../global/console");
const db = require('../../config/config').get(process.env.NODE_ENV);
const mailer = require('./mailer');
const { hash } = require('bcrypt');
const bcrypt = require('bcrypt');
const salt = 10;







// register user \\

exports.registerUser = (newUser) => {
    return new Promise((resolve, reject) => {

        log.msg("Api request: register");

        // check that the passwords are equals
        if (newUser.Password != newUser.Password2) {
            log.normal("Failed to add a new user, Reason: password not match");
            return resolve({ success: false, type: 1, message: "password not match" });
        }

        // send request to DB to check if this email already exist
        User.findOne({ "Email": newUser.Email }, async (err, user) => {
            // in case of this email founded in DB
            if (user) {
                log.normal("Failed to add a new user, Reason: mail already exits");
                return resolve({ success: false, type: 2, message: "email exits" });
            }



            //send email
            let emailStatus = await mailer.sendEmail({
                ApproveEmail: true,
                Name: newUser.Name,
                Email: newUser.Email
            })

            //in case that the mail was sent successfully
            if (emailStatus) {
                // add user to DB
                newUser.save().then(() => {
                    log.info("User added successfully to DB");
                    log.info("user need approve email");

                    // return the user id that registered now
                    return resolve({
                        success: true,
                        user: {
                            _id: newUser._id
                        }
                    });
                }).catch((err) => {
                    log.error("Failed to save a new user to DB, Error: " + err.message);
                    return reject({ success: false, type: 3, message: "Failed to save a new user to DB, Error: " + err.message });
                });
            }
            else {
                log.error("not valid email");
                return resolve({ success: false, type: 4, message: "not valid email" });
            }


        }).catch((err) => {
            log.error("Failed to check email exist, Error: " + err.message);
            return reject({ success: false, type: 5, message: "Failed to check email exist, Error: " + err.message });
        });
    }).catch((err) => {
        log.error("Failed in register request, Error: " + err.message);
        return reject({ success: false, type: 6, message: "Failed in register request, Error: " + err.message });
    });
}

// ************ \\






// login user \\

exports.loginUser = (userLogin) => {

    return new Promise((resolve, reject) => {
        log.msg("Api request: login");

        // check that the email are exist in DB
        User.findOne({ "Email": userLogin.Email }, (err, user) => {

            if (!user) {
                log.normal("Failed to login, Reason: email not found");
                return resolve({ success: false, type: 1, message: "Email or password are wrong" });
            }

            // check that the password are correct
            user.comparepassword(userLogin.Password, (err, isMatch) => {
                if (err) {
                    log.error("Failed to check if passowrd is correct, Error: " + err.message);
                    return reject({ success: false, type: 2, message: "Failed to check if passowrd is correct, Error: " + err.message });
                }

                if (!isMatch) {
                    log.normal("Failed to login, Reason: password dont correct");
                    return resolve({ success: false, type: 3, message: "Email or password are inncorrect, try again" });
                }

                // check if user approve mail and made varification
                if (user.verificationEmail == 1) {

                    // create a token to user
                    user.generateToken((err, user) => {
                        if (err) {
                            log.error("Failed to generate token, Error: " + err.message);
                            return resolve({ success: false, type: 4, message: "Failed to generate token, Error: " + err.message });
                        }

                        log.info("succefully login user");

                        // return the token to user
                        return resolve({
                            success: true,
                            user: {
                                Name: user.Name,
                                Token: user.Token
                            }
                        });
                    });
                }
                else {
                    log.info("user need approve email");
                    return resolve({
                        success: false,
                        type: 5,
                        message: "user need approve email"
                    });
                }
            });
        }).catch((err) => {
            log.error("Failed to check email exist, Error: " + err.message);
            return reject({ success: false, type: 6, message: "Failed to check email exist, Error: " + err.message });
        });
    }).catch((err) => {
        log.error("Failed in login request, Error: " + err.message);
        return reject({ success: false, type: 7, message: "Failed in login request, Error: " + err.message });
    });
}

// ************ \\






// logout user \\

exports.logoutUser = (userData) => {

    return new Promise((resolve, reject) => {
        log.msg("Api request: logout");


        // try to find user by token
        let token = userData.param;
        User.findByToken(token, (err, user) => {
            if (err) return resolve({
                success: false,
                type: 1,
                message: "error in find user by token " + err.message
            });

            if (!user) {
                log.info("cant find user by token");

                return resolve({
                    success: false, type: 2, message: "cant find user by token"
                });
            }

            // delete token in case user founded by token 
            user.deleteToken(token, (err, userAfterDelete) => {

                if (err) {
                    log.normal("Failed to delete token");
                    return resolve({ success: false, type: 3, message: "Failed to delete token in DB" });
                }

                log.info("logout succesed");
                return resolve({ success: true, message: "logout successfuly" });
            });
        })
    }).catch((err) => {
        log.error("Failed in logout request, Error: " + err.message);
        return reject({ success: false, type: 4, message: "Failed in logout request, Error: " + err.message });
    });
};

// ************ \\






// get user by token \\

exports.getUserByToken = (userData) => {

    return new Promise((resolve, reject) => {
        log.msg("Api request: get user by token");


        // try to find user by token
        User.findOne({ Token: userData.param }, "Name Token", (err, user) => {
            // in case of error in the action
            if (err) return resolve({
                success: false,
                type: 1,
                message: "error in find user by token " + err.message
            });

            // if not founded user by token
            if (!user) {
                log.info("not found user by token")
                return resolve({
                    success: false,
                    type: 2,
                    message: "not found user by token"
                });
            }

            log.info("success to find user by token");

            // return user with the token
            return resolve({ success: true, user: user });

        }).catch((err) => {
            log.error("Failed to find user by token, Error: " + err.message);
            return reject({ success: false, type: 3, message: "Failed to find user by token, Error: " + err.message });
        });
    }).catch((err) => {
        log.error("Failed in find user by token request, Error: " + err.message);
        return reject({ success: false, type: 4, message: "Failed in find user by token request, Error: " + err.message });
    });
};

// ************ \\






// varification email \\

exports.verificationEmail = (userMail) => {

    return new Promise((resolve, reject) => {

        log.msg("Api request: verification email");

        const filterEmail = { Email: userMail.param };

        const updateVerification = { verificationEmail: 1 };

        // try to find user by email and make avrification
        User.findOneAndUpdate(filterEmail, updateVerification, (err, user) => {
            if (err) return resolve({
                success: false,
                type: 1,
                message: "error in find user by email and varification" + err.message
            });

            // in case user not found by email
            if (!user) return resolve({
                success: false,
                type: 2,
                message: "not found user by email"
            });

            // create a token to user
            user.generateToken((err, user) => {
                if (err) {
                    log.error("Failed to generate token, Error: " + err.message);
                    return resolve({ success: false, type: 3, message: "Failed to generate token, Error: " + err.message });
                }

                log.info("succefully created token and varification email");

                //return the token to user
                return resolve({
                    success: true,
                    user: {
                        Name: user.Name,
                        Token: user.Token
                    }
                });
            });
        }).catch((err) => {
            log.error("Failed to find user by email, Error: " + err.message);
            return reject({ success: false, type: 4, message: "Failed to find user by email, Error: " + err.message });
        });
    }).catch((err) => {
        log.error("Failed in verification email request, Error: " + err.message);
        return reject({ success: false, type: 5, message: "Failed in verification email request, Error: " + err.message });
    });
}

// ************ \\






// in case user forgot password . send email to reset password \\

exports.forgetPassword = (userMailReset) => {

    return new Promise((resolve, reject) => {
        log.msg("Api request: reset password by email");


        // try to find user by email
        User.findOne({ Email: userMailReset.param }, async (err, user) => {
            if (err) return resolve({
                success: false,
                type: 1,
                message: "error in find user by email " + err.message
            });


            // in case user not found by email
            if (!user) {
                log.info("not found user by email")
                return resolve({
                    success: false,
                    type: 2,
                    message: "not found user by email"
                });
            }

            // send email
            let emailStatus = await mailer.sendEmail({
                ResetPassword: true,
                Name: user.Name,
                Email: user.Email,
                _id: user.id
            })

            //in case that the mail was sent successfully
            if (emailStatus) {
                log.info("success to send email to reset password");
                return resolve({ success: true, message: "success to send email to reset password" });
            }

        }).catch((err) => {
            log.error("Failed to find user by email, Error: " + err.message);
            return reject({ success: false, type: 3, message: "Failed to find user by email, Error: " + err.message });
        })
    }).catch((err) => {
        log.error("Failed in reset password request, Error: " + err.message);
        return reject({ success: false, type: 4, message: "Failed in reset password request, Error: " + err.message });
    });
}

// ************ \\







// reset and save the new password \\

exports.resetPassword = (userDataToReset) => {

    return new Promise((resolve, reject) => {
        log.msg("Api request: reset password");

        const filterId = { _id: userDataToReset._id };


        // check if the passwords are equals and update the password in DB
        if (userDataToReset.Password == userDataToReset.Password2) {

            bcrypt.genSalt(salt, function (err, salt) {
                if (err) {
                    log.error("faile get salt, Error: " + err.message);
                    return resolve({
                        success: false,
                        type: 1,
                        message: "faile get salt, Error: " + err.message
                    })
                }

                // convert the password to hash String
                bcrypt.hash(userDataToReset.Password, salt, function (err, hash) {
                    if (err) {
                        log.error("failed to hash password " + err.message);
                        return resolve({
                            success: false,
                            type: 2,
                            message: "failed to hash password "
                        })
                    }

                    const updatePassword = {
                        Password: hash,
                        Password2: hash
                    };

                    User.findOneAndUpdate(filterId, updatePassword, (err, user) => {
                        if (err) {
                            log.error("filed to find one and update password " + err.message)
                            return resolve({
                                success: false,
                                type: 3,
                                message: "filed to find one and update password "
                            })
                        }

                        // in case user not found by id
                        if (!user) return resolve({
                            success: false,
                            type: 4,
                            message: "not found user by id "
                        });

                        // create a token to user
                        user.generateToken((err, user) => {
                            if (err) {
                                log.error("Failed to generate token, Error: " + err.message);
                                return resolve({ success: false, type: 5, message: "Failed to generate token" });
                            }

                            log.info("succefully created token and update password");
                            //return the token to user
                            return resolve({
                                success: true,
                                user: {
                                    Name: user.Name,
                                    Token: user.Token
                                }
                            });
                        });
                    }).catch((err) => {
                        log.error("Failed to find user by id, Error: " + err.message);
                        return reject({ success: false, type: 6, message: "Failed to find user by id, Error: " });
                    });
                })
            })
        }
        else {
            log.normal("Failed to reset password, Reason: passwords not match");
            return resolve({ success: false, type: 7, message: "passwords not match" });
        }
    }).catch((err) => {
        log.error("Failed in reset password request, Error: " + err.message);
        return reject({ success: false, type: 8, message: "Failed in reset password request, Error: " + err.message });
    });
}

// ************ \\






// send again emails in case of Try Again \\

exports.sendEmailAgain = (tryAgainUserData) => {

    return new Promise((resolve, reject) => {
        log.msg("Api request: try again to send mail");

        //try to find user by given id
        User.findOne({ _id: tryAgainUserData._id }, async (err, user) => {

            if (err) return resolve({
                success: false,
                type: 1,
                message: "error in find one user by id " + err.message
            });

            // in case user not found by id
            if (!user) {
                log.info("not found user by id")
                return resolve({
                    success: false,
                    type: 2,
                    message: "not found user by id"
                });
            }

            // send the try again email in case of fail register
            if (tryAgainUserData.Type == "approveEmail") {


                // check if emails are equals
                if (tryAgainUserData.Email == user.Email) {

                    // send email
                    let emailStatus = await mailer.sendEmail({
                        ApproveEmail: true,
                        Name: user.Name,
                        Email: user.Email,
                        _id: user.id
                    })


                    //in case that the mail was sent successfully
                    if (emailStatus) {
                        log.info("success to send again email to approve email");
                        return resolve({ success: true, user: user });
                    }
                }

                // in case that the user mail and the new mail not the same - update mail in DB and send mail
                else {
                    User.findOneAndUpdate({ _id: tryAgainUserData._id }, { Email: tryAgainUserData.Email }, { new: true }, async (err, doc) => {

                        if (err) return resolve({
                            success: false,
                            type: 3,
                            message: "Error in findOneAndUpdate, Error: " + err.message
                        });

                        // send email
                        let emailStatus = await mailer.sendEmail({
                            ApproveEmail: true,
                            Name: doc.Name,
                            Email: doc.Email,
                            _id: doc.id
                        })

                        //in case that the mail was sent successfully
                        if (emailStatus) {

                            log.info("success to find user by id and update email and send email");
                            return resolve({ success: true, user: doc });
                        }
                    })
                }
            }

            else {
                // check the type of email sending
                if (tryAgainUserData.Type == "forgetPassword") {


                    // send email
                    let emailStatus = await mailer.sendEmail({
                        ResetPassword: true,
                        Name: user.Name,
                        Email: user.Email,
                        _id: user.id
                    })

                    // in case that the mail was sent successfully
                    if (emailStatus) {
                        log.info("success to send again email to reset password");
                        return resolve({ success: true, user: user });
                    }
                }

                // in case of type of email to send are wrong
                else {
                    log.error("the type of mail are wrong");
                    return resolve({
                        success: false,
                        type: 4,
                        message: "type of mail not correct"
                    });
                }
            }

        }).catch((err) => {
            log.error("Failed to find user by id, Error: " + err.message);
            return reject({ success: false, type: 5, message: "Failed to find user by id" });
        });
    }).catch((err) => {
        log.error("Failed in send mail again request, Error: " + err.message);
        return reject({ success: false, type: 6, message: "Failed in send mail again request" });
    });
}

// ************ \\