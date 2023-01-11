const { Router } = require("express");
const { index, create } = require("../../controllers/admin/exam.controller");

const router = Router();

router.get("/", index);

router.get("/create", create);

module.exports = router;
