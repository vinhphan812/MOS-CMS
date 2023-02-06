const { Router } = require("express");

const { index, settingsPage, bankingPage } = require("../../controllers/admin");

const {
    decentralization,
} = require("../../middlewares/decentralization.middleware");
const examRouter = require("./exam.route");
const fixedTimeRoute = require("./fixed_time.route");
const registrationRoute = require("./registration.route");
const { ROLE } = require("../../utils/role.enum");

const router = Router();

router.use(decentralization(ROLE.ADMIN));

router.get("/", index);

router.get("/settings", settingsPage);

router.use("/times", fixedTimeRoute);

router.use("/exams", examRouter);

router.get("/banking", bankingPage)

router.use("/registrations", registrationRoute);

module.exports = router;
