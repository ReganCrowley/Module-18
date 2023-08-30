const router = require("express").Router();
const service = require("../controllers/user.controller");

router.route('/')
    .get(service.getAllUsers)
    .post(service.create);

router.route('/:userId')
    .get(service.getOneUser)
    .put(service.updateOneUser)
    .delete(service.deleteOneUser);

router.route('/:userId/friends/:friendId')
    .post(service.addFriend)
    .delete(service.removeFriend);

module.exports = router;