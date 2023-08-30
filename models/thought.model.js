const mongoose = require("mongoose");
const dateFormat = require("dateformat");

const reactionSchema = mongoose.Schema({

    reactionId: {
        type: mongoose.Schema.ObjectId,
        auto: true,
    },

    reactionBody: {
        type: String,
        required: true,
        maxLength: 280,
    },

    username: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
        get: getDateInReadableFormat,
    },
}, {
    toJSON: { virtuals: true, getters: true },
    id: false,
    _id: false,
});

const thoughtSchema = mongoose.Schema({

    thoughtText: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 280,
    },

    createdAt: {
        type: Date,
        default: Date.now,
        get: getDateInReadableFormat,
    },

    username: {
        type: String,
        required: true,
    },

    reactions: [reactionSchema],

}, {
    toJSON: { virtuals: true, getters: true },
    id: false,
});

function getDateInReadableFormat(date) {
    return dateFormat(date, "mmm dS, yyyy 'at' h:MM TT");
}

//todo not working
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
})


module.exports = mongoose.model('Thought', thoughtSchema, 'thoughts');