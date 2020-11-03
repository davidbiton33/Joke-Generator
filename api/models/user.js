var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const confiq = require('../../config/config').get(process.env.NODE_ENV);
const salt = 10;



const userSchema = mongoose.Schema({
    Name: String,
    Email: String,
    Phone: String,
    Password: String,
    Password2: String,
    verificationEmail: {
        type: Number,
        default: 0
    },
    GroupId: {
        type: [String], default: ["5f7eec879eb56e45a8d05e52"]
    },
    Token: String,
    CartID: String
});

// to signup a user
userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('Password')) {
        bcrypt.genSalt(salt, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.Password, salt, function (err, hash) {
                if (err) return next(err);
                user.Password = hash;
                user.Password2 = hash;
                next();
            })

        })
    }
    else {
        next();
    }
});

//to login
userSchema.methods.comparepassword = function (Password, cb) {
    bcrypt.compare(Password, this.Password, function (err, isMatch) {
        if (err) return cb(next);
        cb(null, isMatch);
    });
}

// generate token

userSchema.methods.generateToken = function (cb) {
    var user = this;
    var Token = jwt.sign(user._id.toHexString(), confiq.SECRET);

    user.Token = Token;
    user.save(function (err, user) {
        if (err) return cb(err);
        cb(null, user);
    })
}

// find by token
userSchema.statics.findByToken = function (Token, cb) {
    var user = this;

    jwt.verify(Token, confiq.SECRET, function (err, decode) {
        user.findOne({ "_id": decode, "Token": Token }, function (err, user) {
            if (err) return cb(err);
            cb(null, user);
        })
    })
};

//delete token

userSchema.methods.deleteToken = function (Token, cb) {
    var user = this;

    user.updateOne({ $unset: { Token: 1 } }, function (err, user) {
        if (err) return cb(err);
        cb(null, user);
    })
}


module.exports = mongoose.model('User', userSchema);