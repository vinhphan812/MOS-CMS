const { AdminTask } = require("../../modules/AdminTask");

module.exports = {
    basicCheck: (req, res, next) => {
        const { method, ...args } = req.body;
        const errors = [];

        if (!method) {
            return res.json({ success: false, message: "method is not required" });
        }

        const doingTask = AdminTask[method];

        if (!doingTask) {
            return res.json({ success: false, message: "method dont existed" });
        }

        res.locals.doingTask = doingTask;
        res.locals.args = args;

        next();
    }
}