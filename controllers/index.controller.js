module.exports = {
    homePage: (req, res, next) => {
        res.render('index', { title: 'Express' });
    },
    registrationPage: (req, res, next) => {
        res.render('registration')
    }
}