const { Exam } = require("../../../models");
const router = require("express").Router();

router.get("/exams", async (req, res, next) => {
    try {
        const data = await Exam.getList("active", { remaining: { $gt: 0 } });

        res.json({ data });
    } catch (e) {
        res.json([]);
    }
});

router.post("/check", async (req, res, next) => {
    try {
        let { Word, Excel, PowerPoint } = req.body;
        console.log(req.body)

        if (!Word && !Excel && !PowerPoint) {
            return res.json({ success: false, message: "Word, Excel, PowerPoint is not required" });
        }

        if (Word) {
            Word = await Exam.get(Word);
            Word.check();
        }
        if (Excel) {
            Excel = await Exam.get(Excel);
            Excel.check();
        }
        if (PowerPoint) {
            PowerPoint = await Exam.get(PowerPoint);
            PowerPoint.check();
        }

        if (Word && Excel) {
            Word.checkConflict(Excel);
        }

        if (Word && PowerPoint) {
            Word.checkConflict(PowerPoint);
        }

        if (Excel && PowerPoint) {
            Excel.checkConflict(PowerPoint);
        }

        res.json({ success: true, Word, Excel, PowerPoint });

    } catch ({ message, data }) {
        res.json({ success: false, message, data });
    }
})

module.exports = router;