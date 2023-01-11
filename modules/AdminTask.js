const { Times } = require("../models")
const IIG = require("./IIG");

function checkValidTime(time) {
    if (!time) {
        throw new Error("time is not required");
    }
    if (!/\d{2}:\d{2}/g.test(time)) {
        throw new Error("time invalid");
    }
}

module.exports.AdminTask = {
    check_time: async ({ time }) => {

        checkValidTime(time);

        const data = await Times.findOne({ time });
        if (data) {
            throw new Error("times is existed")
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

        const data = await Times.updateOne({ _id: id }, {
            $set: {
                time
            }
        });

        return { success: true, message: "update success", data };
    },
    list_time: async () => {
        const data = await Times.find({}, { _id: 1, time: 1 }).sort({ time: 1 });
        return { success: true, data }
    },
    iig: async () => {
        const data = await IIG.getSchedules();

        return { success: true, data };
    }
}