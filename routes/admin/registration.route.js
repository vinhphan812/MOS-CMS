const { Router } = require("express");

const { index } = require("../../controllers/admin/registration.controller");

const router = Router();

router.get("/", index);

module.exports = router;