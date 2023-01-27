module.exports = {
    index: (req, res, next) => {
        res.render("admin/index")
    },
    settingsPage: (req, res, next) => {
        res.render("admin/settings")
    }
}