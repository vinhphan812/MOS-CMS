const { Times } = require("../../models");

module.exports = {
    index: async (req, res, next) => {
        const times = await Times.find({}).sort({
            is_delete: 1,
            time: 1
        });

        res.locals.times = times || [];

        res.render("admin/times/index", { times });
    },
};
