const { Router } = require("express");

const { index } = require("../../controllers/admin");

const {
	decentralization,
} = require("../../middlewares/decentralization.middleware");
const examRouter = require("./exam.route");
const fixedTimeRoute = require("./fixed_time.route")
const { ROLE } = require("../../utils/role.enum");

const router = Router();

router.use(decentralization(ROLE.ADMIN));

router.get("/", index);

router.use("/times", fixedTimeRoute);

router.use("/exams", examRouter);

module.exports = router;
