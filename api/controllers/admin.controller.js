const { Times, Exam, Register } = require("../../models");
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

        let data = await Exam.getList(type);

        res.json(data);
    },

    registrationList: async (req, res, next) => {
        const { type, page, size, filter } = req.query;

        console.log(filter);

        const data = await Register.getList(type, page, isNaN(+size) ? 99999 : size, filter);

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