const { Times, Exam } = require("../models");
const moment = require("moment");
const IIG = require("./IIG");

function checkValidTime(time) {
    if (!time) {
        throw new Error("time is not required");
    }
    if (!/\d{2}:\d{2}/g.test(time)) {
        throw new Error("time invalid");
    }
}

function checkValidDate(date) {
    if (new Date() > new Date(date)) {
        const error = new Error("Current Date Expired");
        error.data = { ex: ["date"] };

        throw error;
    }
}

function newDate(dateString) {
    dateString = dateString.split("/").reverse().join("-") + " 00:00:00";
    console.log(dateString);
    return moment(dateString).toDate();
}

function success(args) {
    return { success: true, ...args }
}

function fail(args) {
    return { success: false, ...args }
}

module.exports.AdminTask = {
    check_time: async ({ time }) => {
        checkValidTime(time);

        const data = await Times.findOne({ time });
        if (data) {
            throw new Error("times is existed");
        }
        return success({ message: "not existed" });
    },
    create_time: async ({ time }) => {
        checkValidTime(time);

        const data = await Times.create({ time });
        return success({ message: "create success", data });
    },
    update_time: async ({ id, time }) => {
        checkValidTime(time);

        const data = await Times.updateOne(
            { _id: id },
            {
                $set: {
                    time,
                },
            }
        );

        return success({ message: "update success", data });
    },
    update_status_time: async ({ id, is_delete }) => {
        const data = await Times.updateOne({ _id: id }, { $set: { is_delete } });
        return success({ message: "update status success", data });
    },
    remove_time: async ({ id }) => {

        await Times.updateOne({ _id: id }, { $set: { is_delete: true } })

        return success({ message: "Remove success" });
    },
    list_time: async () => {
        const data = await Times.find({}, { _id: 1, time: 1, is_delete: 1 }).sort({
            is_delete: 1,
            time: 1,
        });
        return success({ data });
    },

    iig: async () => {
        const data = await IIG.getSchedules();

        return success({ data });
    },

    check_exam: async ({ date, time }) => {
        try {
            console.log(date);
            date = newDate(date)
            console.log(date);

            checkValidDate(date);

            const exam = await Exam.findOne({ date: date, time });

            if (exam) return { success: false, message: "EXAM EXISTED", data: { ex: ["date", "time"] } }

            return success({ message: "not existed" })
        } catch ({ message, data }) {
            return fail({ message, data });
        }
    },
    create_exam: async ({ time, date, slot }) => {
        date = newDate(date);
        slot = +slot;

        if (slot == NaN) return { success: false, message: "QUANTITY INVALID", data: { ex: ["slot"] } };

        const existed = await Exam.findOne({ date: date, time });

        if (existed) return { success: false, message: "EXAM EXISTED", data: { ex: ["date", "time"] } }

        const data = await Exam.create({ date: date, time, slot, remaining: slot });

        return success({ data, message: "Created" });
    }
};