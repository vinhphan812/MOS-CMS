const { Times, Exam, Register, Banking, Short } = require("../models");
const IIG = require("./IIG");

const {
    approveRegister,
    denyRegister,
    sendDownloadLink,
} = require("../services/mail.service");
const { hashShortLink } = require("../utils/short_hash");

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

function success(args) {
    return { success: true, ...args };
}

function fail(args) {
    return { success: false, ...args };
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
        const data = await Times.updateOne(
            { _id: id },
            { $set: { is_delete } }
        );
        return success({ message: "update status success", data });
    },
    remove_time: async ({ id }) => {
        await Times.updateOne({ _id: id }, { $set: { is_delete: true } });

        return success({ message: "Remove success" });
    },
    list_time: async () => {
        const data = await Times.find(
            {},
            { _id: 1, time: 1, is_delete: 1 }
        ).sort({
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
            return Exam.checkExam({ date, time });
        } catch ({ message, data }) {
            return fail({ message, data });
        }
    },
    create_exam: async ({ time, date, slot }) => {
        const data = await Exam.createExam({ time, date, slot });

        return data;
    },
    approved: async ({ _id, is_approved, reason }) => {
        if (!_id || typeof is_approved != "boolean")
            return fail({ message: "_id, is_approved is not required" });

        const data = await Register.findOne({ _id }).populate([
            "Word",
            "Excel",
            "PowerPoint",
        ]);

        if (!data) return fail({ message: "Not Found Register" });

        if (!is_approved) {
            const subjects = ["Word", "Excel", "PowerPoint"];

            for (const key of subjects) {
                if (data[key]) {
                    await Exam.updateOne(
                        { _id: data[key]._id },
                        { $inc: { remaining: 1 } }
                    );
                }
            }
        }

        if (is_approved) {
            approveRegister(data.email, {
                name: data.fullname,
                exams: [
                    { ...data.Word, alias: "Word" },
                    { ...data.Excel, alias: "Excel" },
                    { ...data.PowerPoint, alias: "PowerPoint" },
                ],
            });
        } else {
            denyRegister(data.email, { name: data.fullname, reason });
        }

        await Register.updateOne(
            { _id },
            { $set: { request: "NO_REQUEST", is_approved, reason } }
        );

        return success({ message: "Thành công" });
    },
    send_download: async ({ email, _id, type }) => {
        if (!email) return fail({ message: "email is not required" });
        const sendType = /WORD/i.test(type)
            ? "Word"
            : /EXCEL/i.test(type)
                ? "Excel"
                : /PPT|POWERPOINT/i.test(type)
                    ? "PowerPoint"
                    : "";
        if (sendType == "") {
            return fail({ message: "type not correct" });
        }

        const res = await sendDownloadLink(email, { title: sendType });

        if (res && _id) {
            await Banking.updateOne(
                { _id },
                { $set: { sendType: type, status: true, email } }
            );
        }
        return success({ message: "Thành công" });
    },
    short_create_or_update: async ({ _id, ...body }) => {
        let isCreate = !_id;

        if (!body.realURL) {
            return fail({ message: "Không biết" })
        }

        if (_id) {
            const current = await Short.findOne({ _id });

            if (!current)
                return fail({ message: "Không tồn tại" });
        }
        if (body.expired) {
            const expired = new Date(body.expired);
            const date = new Date();

            if (!expired || expired <= date) {
                delete body.expired;
            } else {
                body.isExpired = true;
                body.expired = expired;
            }
        }

        body.isAccessTime = body.accessTimes > 0;


        if (isCreate) {
            const data = await Short.create(body);
            _id = data._id;
        }

        const hash = hashShortLink(_id + "|" + body.url);

        body.hash = hash;

        await Short.updateOne({ _id }, { $set: body });
        return success({ message: "Thành công", data: "https://moskhanhly.com/s/" + hash });
    }
};
