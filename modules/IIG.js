const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment");

axios.default.defaults.transformResponse = (data) => {
	return cheerio.load(data);
};

const HOST = "https://iigvietnam.com";

const params = { test_type: 251, location: 205 };

class IIG {
	static getSchedules() {
		return new Promise(async (resolve, reject) => {
			try {
				const path = "/lich-thi";
				const { data: $ } = await axios(
					HOST +
						path +
						"?" +
						new URLSearchParams(params).toString()
				);
				resolve(extract($));
			} catch (error) {
				reject(error);
			}
		});

		function extract($) {
			const currentDate = new Date();
			const $child = $("._list_location > tbody > tr:not(:eq(0))");
			const result = [];

			$child.each((i, e) => {
				const date = $("td:nth-child(3)", e).text();
				if (moment(date, "DD/MM/YYYY") > currentDate)
					result.push(date);
			});
			return result;
		}
	}
}

module.exports = IIG;
