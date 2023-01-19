const { Times, Exam } = require("../../models");
module.exports = {
    index: (req, res, next) => {
        res.json({ success: true, message: "ADMIN" });
    },

    timeList: async (req, res, next) => {
        const data = await Times.find({});

        res.json(data);
    },

    examList: async (req, res, next) => {
        const { type } = req.query;

        let data = [];

        if (type == "active") {
            data = await Exam.find({
                date: {
                    $gte: new Date()
                }
            }).populate("time", { _id: 1, time: 1 });
        } else
            data = await Exam.find({}).populate("time", { _id: 1, time: 1 });

        res.json(data);
    },

    doing: async (req, res, next) => {
        const { doingTask, args } = res.locals;

        try {
            const data = await doingTask(args);
            res.json(data)
        } catch (e) {
            console.log(e)
            res.json({ success: false, message: e.message })
        }
    },
}