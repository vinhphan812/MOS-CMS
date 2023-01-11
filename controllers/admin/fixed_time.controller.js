const { Times } = require("../../models");

module.exports = {
	index: async (req, res, next) => {
		const times = await Times.find({}).sort({ time: 1 });

		res.locals.times = times || [];

		res.render("admin/times/index", { times });
	},
};
