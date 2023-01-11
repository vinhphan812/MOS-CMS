const { Router } = require("express");
const { loginPage, loginHandle, logoutHandle } = require("../controllers/auth.controller");

const router = Router();

router.get("/login", loginPage);
router.post("/login", loginHandle);
router.get("/logout", logoutHandle);

module.exports = router;
