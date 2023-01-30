const nodemailer = require("nodemailer");

class Mailer {
	transporter = null;

	constructor() {
		this.transporter = nodemailer.createTransport({
			service: "Gmail",
			auth: {
				user: "vinhphan812@gmail.com",
				pass: "uyaixmfdkqwfklfo",
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
