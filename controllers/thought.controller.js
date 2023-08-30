const userModel = require("../models").User;
const thoughtModel = require("../models").Thought;

module.exports = {

    async create(req, res) {
        try {

            const userResult = await userModel.findOne({ username: req.body.username }, { _id: 1 });

            if (!userResult) {
                return res.status(404).json({ message: 'No user found with that username' });
            }

            const model = new thoughtModel({
                username: req.body.username,
                thoughtText: req.body.thoughtText,
            })

            const result = await model.save();

            await userModel.updateOne({ username: req.body.username }, { $push: { thoughts: result._id } })

            res.json(result);

        } catch (e) {
            res.status(500).json(e);
        }
    },

    async getAllThoughts(req, res) {
        try {

            const result = await thoughtModel.find({});
            res.json(result);

        } catch (e) {
            res.status(500).json(e);
        }
    },

    async getOneThought(req, res) {
        try {

            const result = await thoughtModel
                .findOne({ _id: req.params.thoughtId })
                .populate('reactions');
            if (!result) {
                return res.status(404).json({ message: 'No thought found with that id' });
            }

            res.json(result);

        } catch (e) {
            res.status(500).json(e);
        }
    },

    async updateOneThought(req, res) {
        try {
            const thought = await thoughtModel.findOne({ _id: req.params.thoughtId });

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that id' });
            }

            const result = await thoughtModel.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: { thoughtText: req.body.thoughtText } }, { new: true });

            res.json(result);
        }
        catch (e) {
            res.status(500).json(e);
        }
    },

    async deleteOneThought(req, res) {
        try {

            const thought = await thoughtModel.findOne({ _id: req.params.thoughtId });

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that id' });
            }

            // deleting thought
            const a = thoughtModel.deleteOne({ _id: req.params.thoughtId });
            // removing thought from associated user
            const b = userModel.updateOne({ username: thought.username }, { $pull: { thoughts: req.params.thoughtId } });

            await a;
            await b;

            res.json({ "message": "Thought and user association deleted!" });

        } catch (e) {
            res.status(500).json(e);
        }
    },

    async createReaction(req, res) {
        try {

            const _thought = thoughtModel.findOne({ _id: req.params.thoughtId });
            const _user = userModel.findOne({ username: req.body.username });

            const thought = await _thought;
            const user = await _user;

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that id' });
            }

            if (!user) {
                return res.status(404).json({ message: 'No user found with that id' });
            }

            const reaction = {
                reactionBody: req.body.reactionBody,
                username: req.body.username,
            };

            const result = await thoughtModel.findOneAndUpdate({ _id: req.params.thoughtId },
                {
                    $push: {
                        reactions: reaction,
                    }
                },
                {
                    new: true,
                    runValidators: true,
                }
            )

            res.json(result);

        } catch (e) {
            res.status(500).json(e);
        }
    },

    async deleteReaction(req, res) {
        try {

            const _thought = thoughtModel.findOne({ _id: req.params.thoughtId });

            const thought = await _thought;

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that id' });
            }

            const result = await thoughtModel.findOneAndUpdate({ _id: req.params.thoughtId },
                {
                    $pull: {
                        reactions: { reactionId: req.params.reactionId },
                    }
                },
                {
                    new: true
                }
            )

            res.json(result);

        } catch (e) {
            res.status(500).json(e);
        }
    },

}