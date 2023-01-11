const IIG = require("../../modules/IIG");

module.exports = {
	index: (req, res, next) => {
		res.render("admin/exams/");
	},
	create: async (req, res, next) => {
		const dates = await IIG.getSchedules();

		res.locals.recommand = dates;
		res.render("admin/exams/create");
	},
};
