const router = require("express").Router();

router.use("/users", require("./user.route"));
router.use("/thoughts", require("./thought.route"));

module.exports = router;