const { Router } = require("express");
const { getUser } = require("../controllers/user");
const router = Router();

router.get('/:username', getUser)

module.exports = router;
