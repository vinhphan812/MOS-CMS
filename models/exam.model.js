const { SCHEMA_OPTION, ignoreModel, THRESHOLD_BETWEEN_EXAMS } = require("../utils/constaints");

const mongoose = require("mongoose");
const { Schema } = mongoose;
const Times = require("./times.model");
const { newDate, checkValidDate } = require("../utils/date")


const examSchema = new Schema(
    {
        subject: { type: Schema.Types.ObjectId, ref: "SUBJECT" },
        date: Date,
        time: String,
        slot: { type: Number, default: 0 },
        remaining: { type: Number, default: 0 },
    },
    SCHEMA_OPTION
);

examSchema.static({
    checkExam: async function ({ date, time }) {
        date = newDate(date)

        checkValidDate(date);

        const existedTime = await Times.findOne({ _id: time });

        if (!existedTime)
            return { success: false, message: "TIME NOT EXISTED", data: { ex: ["time"] } };

        const exam = await this.findOne({ date: date, time: existedTime.time });

        if (exam) return { success: false, message: "EXAM EXISTED", data: { ex: ["date", "time"] } }

        return { success: true, message: "not existed" };
    },
    createExam: async function ({ time, date, slot }) {
        if (slot == NaN) return { success: false, message: "QUANTITY INVALID", data: { ex: ["slot"] } };

        console.log(date);

        const checker = await this.checkExam({ time, date });

        if (!checker.success)
            return checker;

        const existedTime = await Times.findOne({ _id: time });

        const data = await Exam.create({ date: newDate(date), time: existedTime.time, slot, remaining: slot });

        return { success: true, message: "Created", data };

    },
    getList: async function (type = "", q) {
        const query = type == "active" ? {
            date: {
                $gte: new Date()
            }
        } : {};

        return this.find({ ...query, ...(q ? q : {}) }, { created_at: 0, updated_at: 0 }).sort({ date: 1, time: 1 })
    },
    get: async function (_id) {
        const data = await this.findOne({ _id }, { created_at: 0, updated_at: 0 });
        if (!data) throw new Error(`Exam ${ _id } not exited`);
        return data;
    }
})

examSchema.method({
    check: function () {
        if (!this.remaining) throw new Error("Out of Slot");
        return true;
    },
    checkConflict: function (exam) {
        if (exam.date.getTime() != this.date.getTime()) return true;
        const current = new Date();

        const [examH, examM] = exam.time.split(":");
        const [thisH, thisM] = this.time.split(":");

        const minusDate = Math.abs(new Date(current.setHours(examH, examM, 0, 0)) - new Date(current.setHours(thisH, thisM, 0, 0)))

        console.log(minusDate)

        if (minusDate < THRESHOLD_BETWEEN_EXAMS) {
            const error = new Error("CONFLICT_TIME");
            error.data = [exam._id, this._id];
            throw error;
        }
        return true;
    }
});

const Exam = mongoose.model("EXAM", examSchema, "EXAM");

module.exports = Exam;
