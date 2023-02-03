const { Register, Exam } = require("../models");
const IdValidate = require("../validations/id.validate");

module.exports = {
    homePage: (req, res, next) => {
        res.render('index');
    },
    registrationPage: (req, res, next) => {
        res.render('registration');
    },
    registrationHandle: async (req, res, next) => {
        try {
            const { registrations, ...body } = res.locals.body;

            for (const key of Object.keys(registrations)) {
                await Exam.register(registrations[key], key);
            }

            const data = await Register.create({ ...body, ...registrations });

            res.redirect(`/registration/${ data._id }`);
        } catch (e) {
            res.locals.errors = [e.message];
            res.render("registration");
        }
    },
    registrationPageSuccess: async (req, res, next) => {
        const { id } = req.params;

        if (!id || IdValidate(id)) return next(new Error("Id Không đúng"));

        const data = await Register.findOne({ _id: id }).populate(["Word", "Excel", "PowerPoint"]);

        if (!data) return next(new Error("Không tồn tại...!"));

        data.idCardNumber = data.idCardNumber.slice(-4).padStart(data.idCardNumber.length, '*');
        data.phone = data.phone.slice(-4).padStart(data.phone.length, '*');

        res.locals.data = data;

        res.render("registration_success");
    },
    downloadPage: (req, res, next) => {
        res.render("download");

    },
    lessonsPage: (req, res, next) => {
        res.render("lessons")
    }
}