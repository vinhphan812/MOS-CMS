const { User } = require("../models/");

const { PERMISSIONS, ROLE, MENU_BY_ROLE } = require("../utils/role.enum");

module.exports = {
	decentralization: (perms) => {
		return async (req, res, next) => {
			// if (req.method == "GET") return next();

			const userId = req.signedCookies.userId;

			// default role is a CUSTOMER
			let userPerms = ROLE.CUSTOMER;

			if (userId)
				userPerms = (
					await User.findOne({
						_id: userId,
					})
				).role;
			else return res.redirect("/sign_in");

			if (PERMISSIONS[userPerms] < PERMISSIONS[perms || ROLE.CUSTOMER])
				return res.status(403).render("errors/404");

			res.locals.role = userPerms;

			next();
		};
	},
	decentralizationAPI: (perms) => {
		return async (req, res, next) => {
			// if (req.method == "GET") return next();

			const userId = req.signedCookies.userId;

			// default role is a CUSTOMER
			let userPerms = ROLE.CUSTOMER;

			if (userId)
				userPerms = (
					await User.findOne({
						_id: userId,
					})
				).role;
			else
				return res.json({
					success: false,
					message: "FAIL_AUTHORIZED",
				});

			if (PERMISSIONS[userPerms] < PERMISSIONS[perms || ROLE.CUSTOMER])
				return res.json({
					success: false,
					message: "PERMISSION_DENIED",
				});

			res.locals.role = userPerms;

			next();
		};
	},
};
