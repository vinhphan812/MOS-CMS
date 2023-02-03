const Mailer = require("./modules/mailer");
const pug = require("pug");
const path = require("path");

const { registerSuccess } = require("./services/mail.service");

require("dotenv").config();


(async () => {
    const mailer = new Mailer();
    // mailer.send(
    //     "Mailer",
    //     pug.renderFile("./modules/mail.pug", { content: "Test Mail", title: "Test", APP_NAME: process.env.APP_NAME }),
    //     "Vonguyenthuyanh0304@gmail.com"
    // );

    registerSuccess("Vonguyenthuyanh0304@gmail.com", { name: "Võ Nguyễn Thúy Anh" });
})();