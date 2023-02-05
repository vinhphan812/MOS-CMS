const nodemailer = require("nodemailer");

const { EMAIL_USER, EMAIL_PASS } = process.env

class Mailer {
    transporter = null;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS,
            },
        });
    }

    send(subject, html, to) {
        this.transporter.sendMail({
            to,
            subject,
            html,
        });
    }
}

module.exports = Mailer;
