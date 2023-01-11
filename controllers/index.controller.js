module.exports = {
    homePage: (req, res, next) => {
        res.render('index', { title: 'Express' });
    },
    registerPage: (req, res, next) => {
        res.render('register')
    }
}