const mongoose = require("mongoose");

const { db_url, db_user, db_pass, db_name } = process.env;

module.exports = {
	initDatabase: () => {
		// connect database from .env
		mongoose.set("strictQuery", true);

		mongoose.connection.on('connected', function() {
			console.log("connection established successfully");
		});

		if (db_url)
			mongoose.connect(
				db_url,
				{
					user: db_user,
					pass: db_pass,
					dbName: db_name,
				},
				(err) => {
					console.log(err);
				}
			);

	},
};
