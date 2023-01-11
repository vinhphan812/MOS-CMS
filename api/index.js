const { Router } = require("express");
const router = Router();
const adminRoute = require("./routes/admin");
const publicRoute = require("./routes/public");


router.use("/", publicRoute);
router.use("/admin", adminRoute);
router.get("/", (req, res, next) => {res.json({message: "API"})})

router.use((req, res, next) => {
    res.json({ success: false, message: "NOT FOUND" });
})

router.use(function(err, req, res, next) {
    // set locals, only providing error in development
    const message = err.stack;

    console.log();

    // render the error page
    res.status(err.status || 200).json({ success: false, status: 500, message, });
});

module.exports = router;