const { Router } = require("express");
const { index } = require("../../controllers/admin/exam.controller");

const router = Router();

router.get("/", index);

module.exports = router;
