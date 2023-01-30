const { Register } = require("../../models");
module.exports = {
    index: async (req, res, next) => {
        res.locals.data = await Register.find({});

        res.render("admin/registrations")
    }
}