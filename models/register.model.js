const { SCHEMA_OPTION, ignoreModel, filter2Query } = require("../utils/constaints");

const mongoose = require("mongoose");
const { Schema } = mongoose;

const registerSchema = new Schema({
    fullname: String,
    idCardNumber: String,
    birthday: Date,
    phone: String,
    gender: String,
    email: String,
    reason: { type: String, default: "" },
    Word: { type: Schema.Types.ObjectId, ref: "EXAM", default: null },
    Excel: { type: Schema.Types.ObjectId, ref: "EXAM", default: null },
    PowerPoint: { type: Schema.Types.ObjectId, ref: "EXAM", default: null },
    bankingImage: String,
    is_approved: { type: Boolean, default: false },
    is_delete: { type: Boolean, default: false },
    request: { type: String, enum: ["REQUEST", "NO_REQUEST"], default: "REQUEST" }
}, SCHEMA_OPTION);

registerSchema.static({
    getList: async function (type, page = 1, size = 10, filters) {
        if (!["history", "need_approved", "approved"].includes(type)) return [];

        const date = new Date();

        let filterObj = {};

        if (filters) {
            filterObj = filter2Query(filters, {
                exam_date: {
                    mapping: ["Word.date", "Excel.date", "PowerPoint.date"],
                    type: "date"
                }
            });
        }


        const $match = type == "need_approved" ? {
                request: "REQUEST",
                $or: [
                    { "Word.date": { $gt: date } },
                    { "PowerPoint.date": { $gt: date } },
                    { "Excel.date": { $gt: date } }
                ],
                ...filterObj
            } :
            type == "approved" ? {
                is_approved: true,
                request: "NO_REQUEST",
                $or: [
                    { "Word.date": { $gt: date } },
                    { "PowerPoint.date": { $gt: date } },
                    { "Excel.date": { $gt: date } }
                ],
                ...filterObj
            } : filters ? filterObj : {};

        const data = await this.aggregate([
            {
                $lookup: {
                    from: "EXAM",
                    localField: "Word",
                    foreignField: "_id",
                    as: "Word",
                    pipeline: [{ $project: { date: 1, _id: 1, time: 1 } }]
                },
            },
            {
                $lookup: {
                    from: "EXAM",
                    localField: "Excel",
                    foreignField: "_id",
                    as: "Excel",
                    pipeline: [{ $project: { date: 1, _id: 1, time: 1 } }]
                }
            },
            {
                $lookup: {
                    from: "EXAM",
                    localField: "PowerPoint",
                    foreignField: "_id",
                    as: "PowerPoint",
                    pipeline: [{ $project: { date: 1, _id: 1, time: 1 } }]
                }
            },
            {
                $set: {
                    "Word": { $first: "$Word" },
                }
            },
            {
                $set: {
                    "Excel": { $first: "$Excel" },
                }
            },
            {
                $set: {
                    "PowerPoint": { $first: "$PowerPoint" },
                }
            },
            {
                $match
            },
        ]).exec();

        const last_page = Math.ceil(data.length / size);

        return { data: page > last_page ? [] : data.splice((page - 1) * size, size), last_page };
    }
});

registerSchema.method({});

const Register = mongoose.model("REGISTER", registerSchema, "REGISTER");

module.exports = Register;
