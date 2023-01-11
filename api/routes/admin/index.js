const { decentralizationAPI } = require("../../../middlewares/decentralization.middleware");
const { ROLE } = require("../../../utils/role.enum");
const { index, doing } = require("../../controllers/admin.controller");
const { basicCheck } = require("../../validations/admin.validation");
const router = require("express").Router();

router.use(decentralizationAPI(ROLE.ADMIN));

// router.post("/", index);

router.post("/do", basicCheck, doing)


module.exports = router;