const userModel = require("../models").User;
const thoughtModel = require("../models").Thought;

module.exports = {

    async create(req, res) {

        try {

            const model = new userModel({
                username: req.body.username,
                email: req.body.email,
            })

            const result = await model.save();
            res.json(result);

        } catch (e) {
            res.status(500).json(e);
        }
    },

    async getAllUsers(req, res) {

        try {

            const result = await userModel.find({});
            res.json(result);

        } catch (e) {
            res.status(500).json(e);
        }
    },

    async updateOneUser(req, res) {
        try {
            const user = await userModel.findOne({ _id: req.params.userId });

            if (!user) {
                return res.status(404).json({ message: 'No user found with that id' });
            }

            const result = await userModel.findOneAndUpdate({ _id: req.params.userId }, { $set: { username: req.body.username } }, { new: true });

            res.json(result);
        }
        catch (e) {
            res.status(500).json(e);
        }
    },

    async getOneUser(req, res) {

        try {

            const result = await userModel
                .findOne({ _id: req.params.userId })
                .populate('friends')
                .populate('thoughts');
            if (!result) {
                return res.status(404).json({ message: 'No user found with that id' });
            }

            res.json(result);

        } catch (e) {
            res.status(500).json(e);
        }
    },

    async deleteOneUser(req, res) {
        try {

            const result = await userModel.findOne({ _id: req.params.userId });

            if (!result) {
                return res.status(404).json({ message: 'No user found with that id' });
            }

            // deleting user
            const a = userModel.deleteOne({ _id: req.params.userId });
            // removing associated thoughts
            const b = thoughtModel.deleteMany({ username: result.username });

            await a;
            await b;

            res.json({ "message": "User and associate thoughts deleted!" });

        } catch (e) {
            res.status(500).json(e);
        }
    },

    async addFriend(req, res) {
        try {

            const _user = userModel.findOne({ _id: req.params.userId });
            const _friend = userModel.findOne({ _id: req.params.friendId });

            const user = await _user;
            const friend = await _friend;

            if (!user) {
                return res.status(404).json({ message: 'No user found with that id' });
            }

            if (!friend) {
                return res.status(404).json({ message: 'No friend found with that id' });
            }

            if (user.friends.includes(friend._id)) {
                return res.status(404).json({ message: 'Both users are already friends' });
            }

            const _result = userModel.findOneAndUpdate({ _id: req.params.userId }, { $push: { friends: req.params.friendId } }, { new: true })
            const _result1 = userModel.updateOne({ _id: req.params.friendId }, { $push: { friends: req.params.userId } })

            const result = await _result;
            await _result1;

            res.json(result);

        } catch (e) {
            res.status(500).json(e);
        }
    },

    async removeFriend(req, res) {
        try {

            const _user = userModel.findOne({ _id: req.params.userId });
            const _friend = userModel.findOne({ _id: req.params.friendId });

            const user = await _user;
            const friend = await _friend;

            if (!user) {
                return res.status(404).json({ message: 'No user found with that id' });
            }

            if (!friend) {
                return res.status(404).json({ message: 'No friend found with that id' });
            }

            if (!user.friends.includes(friend._id)) {
                return res.status(404).json({ message: 'Both users are not friends' });
            }

            const _result = userModel.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true })
            const _result1 = userModel.updateOne({ _id: req.params.friendId }, { $pull: { friends: req.params.userId } })

            const result = await _result;
            await _result1;

            res.json(result);

        } catch (e) {
            res.status(500).json(e);
        }
    }
}