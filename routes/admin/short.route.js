const { Router } = require("express");
const { index } = require("../../controllers/admin/short.controller");

const router = Router();

router.get("/", index);

module.exports = router;
