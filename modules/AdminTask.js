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
        throw new Error("Current Date Expired");
    }
}

module.exports.AdminTask = {
    check_time: async ({ time }) => {
        checkValidTime(time);

        const data = await Times.findOne({ time });
        if (data) {
            throw new Error("times is existed");
        }
        return { success: true, message: "not existed" };
    },
    create_time: async ({ time }) => {
        checkValidTime(time);

        const data = await Times.create({ time });
        return { success: true, message: "create success", data };
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

        return { success: true, message: "update success", data };
    },
    remove_time: async ({ id }) => {

        await Times.updateOne({ _id: id }, { $set: { is_delete: true } })

        return { success: true, message: "Remove success" };
    },
    list_time: async () => {
        const data = await Times.find({}, { _id: 1, time: 1, is_delete: 1 }).sort({
            is_delete: 1,
            time: 1,
        });
        return { success: true, data };
    },

    iig: async () => {
        const data = await IIG.getSchedules();

        return { success: true, data };
    },

    check_exam: async ({ date, time }) => {
        date = date.split("/").reverse().join("-")
        checkValidDate(date);
        const exam = await Exam.findOne({ date: new Date(date), time });
        if (exam)
            return { success: false, message: "Exam is existed!" };
        return { success: true, message: "not existed" }
    },
    create_exam: async () => {

    }
};