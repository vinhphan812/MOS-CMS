const { Router } = require("express");

const { index } = require("../../controllers/admin/fixed_time.controller")

const router = Router();

router.get("/", index);

module.exports = router;