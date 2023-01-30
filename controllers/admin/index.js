const { Attributes } = require("../../models");
module.exports = {
    index: (req, res, next) => {
        res.render("admin/index")
    },
    settingsPage: (req, res, next) => {
        res.locals.data = Attributes.find({});

        res.render("admin/settings")
    }
}