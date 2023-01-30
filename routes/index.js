const { Router } = require("express");
const {
    homePage,
    registrationPage,
    registrationHandle,
    registrationPageSuccess
} = require("../controllers/index.controller");
const authRoute = require("./auth.route");
const adminRoute = require("./admin/");
const apiRoute = require("../api");
const { upload } = require("../configs/upload");
const { registrationValidate } = require("../validations/registration.validate");
const router = Router();

router.use(authRoute);
router.use("/api", apiRoute);
router.use("/admin", adminRoute);

/* GET home page. */
router.get("/", homePage);

router.get("/registration", registrationPage);

router.post("/registration", upload("banking").single("bankingImage"), registrationValidate, registrationHandle);

router.get("/registration/:id", registrationPageSuccess);

module.exports = router;
