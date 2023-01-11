const { SCHEMA_OPTION, ignoreModel } = require("../utils/constaints");

const mongoose = require("mongoose");
const { Schema } = mongoose;

const TimesSchema = new Schema(
    {
        time: { type: String, default: "" },
        is_delete: { type: Boolean, default: false },
    },
    SCHEMA_OPTION
);

TimesSchema.method({});

const Times = mongoose.model("TIMES", TimesSchema, "TIMES");

module.exports = Times;
