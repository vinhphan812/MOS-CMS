const { decentralizationAPI } = require("../../../middlewares/decentralization.middleware");
const { ROLE } = require("../../../utils/role.enum");
const { index, doing, timeList, examList, registrationList, bankingList, shortList } = require("../../controllers/admin.controller");
const { basicCheck } = require("../../validations/admin.validation");
const router = require("express").Router();

router.use(decentralizationAPI(ROLE.ADMIN));

router.get("/times", timeList);
router.get("/exams", examList);
router.get("/registrations", registrationList);
router.get("/banking", bankingList);
router.get("/short", shortList);

router.post("/do", basicCheck, doing)


module.exports = router;