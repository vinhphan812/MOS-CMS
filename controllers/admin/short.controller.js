module.exports = {
    index: (req, res, next) => {
        res.locals.seo.title = "Short Link"
        res.render("admin/short");
    }
}