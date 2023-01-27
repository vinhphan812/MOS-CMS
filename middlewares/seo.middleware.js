const { APP_NAME, GOOGLE_SEO_VERIFICATION } = process.env;
const User = require("../models/user.model");
const { MENU_BY_ROLE } = require("../utils/role.enum.js");
const moment = require("moment");
const { ROLE } = require("../utils/role.enum");

module.exports = {
    seoConfigMiddleware: async (req, res, next) => {
        // check user
        const { userId } = req.signedCookies;

        if (userId) {
            const user = await User.get(userId);

            res.locals.menu = user.role == ROLE.ADMIN ? Object.values(MENU_BY_ROLE).flat() : MENU_BY_ROLE[user.role];
            res.locals.user = user;
            res.locals.userId = userId;
        } else {
            res.locals.menu = MENU_BY_ROLE[ROLE.REGISTER];
        }

        // role display UI
        res.locals.listNotDisplaySignNav = ["/login", "/register"];
        res.locals.errors = [];

        res.locals.isHosting = req.hostname != "localhost";
        res.locals.isOrder = req.originalUrl == "/order";
        res.locals.moment = moment;

        // init seo config object saving to locals response storage
        res.locals.seo = {
            googleSiteVerification: GOOGLE_SEO_VERIFICATION || "",
            title: "",
            description: "",
            keywords: [],
            url: "https://" + req.hostname + req.url,
            image: "",
        };

        // saving path for check
        res.locals.path = req.url;
        // saving APP_NAME
        res.locals.APP_NAME = APP_NAME;

        next();
    },
};
