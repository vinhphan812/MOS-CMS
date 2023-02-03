const { Router } = require("express");

const { index, downloadExcel} = require("../../controllers/admin/registration.controller");

const router = Router();

router.get("/", index);
router.get("/downloadExcel", downloadExcel)

module.exports = router;