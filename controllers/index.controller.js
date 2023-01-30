const { Register, Exam } = require("../models");

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
        res.render("registration_success");
    }
}