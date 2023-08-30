const router = require("express").Router();
const service = require("../controllers/thought.controller");

router.route('/')
    .get(service.getAllThoughts)
    .post(service.create);

router.route('/:thoughtId')
    .get(service.getOneThought)
    .put(service.updateOneThought)
    .delete(service.deleteOneThought);

router.route('/:thoughtId/reactions')
    .post(service.createReaction)

router.route('/:thoughtId/reactions/:reactionId')
    .delete(service.deleteReaction)

module.exports = router;