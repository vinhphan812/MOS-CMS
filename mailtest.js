const Mailer = require("./modules/mailer");
const pug = require("pug");
const path = require("path");

require("dotenv").config();


console.log(pug.renderFile("./modules/mail.pug"));
(async () => {
    const mailer = new Mailer();
    mailer.send(
        "Mailer",
        pug.renderFile("./modules/mail.pug", { content: "Test Mail", title: "Test", APP_NAME: process.env.APP_NAME }),
        "Vonguyenthuyanh0304@gmail.com"
    );
})();