const IIG = require("../../modules/IIG");
const { Exam } = require("../../models");

module.exports = {
    index: async (req, res, next) => {
        const data = await Exam.find({});
        res.locals.exams = data || [];
        res.render("admin/exams/");
    },
    create: async (req, res, next) => {
        const dates = await IIG.getSchedules();

        res.locals.recommand = dates;
        res.render("admin/exams/create");
    },
};
