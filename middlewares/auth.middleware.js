module.exports = (req, res, next) => {
    const { user } = res.locals;
    if(!user) return res.redirect("/login");

    next();
}