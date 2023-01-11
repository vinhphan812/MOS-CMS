const { Router } = require("express");
const { homePage, registerPage } = require("../controllers/index.controller");
const authRoute = require("./auth.route");
const adminRoute = require("./admin/");
const apiRoute = require("../api");
const router = Router();

router.use(authRoute);
router.use("/api", apiRoute);
router.use("/admin", adminRoute);

/* GET home page. */
router.get("/", homePage);

router.get("/register", registerPage);

module.exports = router;
