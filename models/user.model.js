const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const emailValidationRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const validateEmail = function (email) {
    return emailValidationRegex.test(email)
};

const schema = Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [emailValidationRegex, 'Please fill a valid email address']
    },

    thoughts:
        [{
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }],

    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

}, {
    toJSON: { virtuals: true },
    id: false,
});

schema.virtual('friendCount').get(function () {
    return this.friends.length;
})

module.exports = mongoose.model('User', schema, 'users');