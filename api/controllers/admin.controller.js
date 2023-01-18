const { Times } = require("../../models");
module.exports = {
    index: (req, res, next) => {
        res.json({ success: true, message: "ADMIN" });
    },

    timeList: async (req, res, next) => {
        const data = await Times.find({});

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