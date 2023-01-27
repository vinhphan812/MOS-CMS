const moment = require("moment");

function newDate(dateString) {
    console.log(typeof dateString)
    dateString = dateString.split("/").reverse().join("-") + " 00:00:00";
    return moment(dateString).toDate();
}

function checkValidDate(date) {
    if (new Date() > new Date(date)) {
        const error = new Error("Current Date Expired");
        error.data = { ex: ["date"] };

        throw error;
    }
}

module.exports = { newDate, checkValidDate };