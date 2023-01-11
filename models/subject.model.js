const { SCHEMA_OPTION, ignoreModel } = require("../utils/constaints");

const mongoose = require("mongoose");
const { Schema } = mongoose;

const subjectSchema = new Schema(
    {
        name: String,
        icon: { type: String, default: "" },
        fee: { type: Number, default: 0 },
        is_delete: { type: Boolean, default: false },
    },
    SCHEMA_OPTION
);

subjectSchema.method({});

const Subject = mongoose.model("SUBJECT", subjectSchema, "SUBJECT");

module.exports = Subject;
