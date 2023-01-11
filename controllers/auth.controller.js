const { User } = require("../models");
const md5 = require("md5");
module.exports = {
	loginPage: (req, res, next) => {
		res.render("login");
	},
	loginHandle: async (req, res, next) => {
		const { user, pass } = req.body;
		const errors = [];

		const currentUser = await User.findOne({
			$or: [{ username: user }, { email: user }, { phone: user }],
			password: md5(pass),
			is_delete: false,
		});
		if (!currentUser) {
			errors.push("Tài khoản, mật khẩu bạn vừa nhập chưa đúng");
			res.locals.user = user;
			res.locals.pass = pass;
			res.render("login", { errors });
		}

		res.cookie("userId", currentUser.id, { signed: true });
		res.redirect("/admin");
	},
	logoutHandle: (req, res, next) => {
		res.clearCookie("userId").redirect("/");
	},
};
