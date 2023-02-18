const { SCHEMA_OPTION, ignoreModel } = require("../utils/constaints");

const mongoose = require("mongoose");
const { Schema } = mongoose;

const shortSchema = new Schema(
    {
        hash: String,
        realURL: String,
        isExpired: { type: Boolean, default: false },
        expired: { type: Date, default: new Date() },
        isAccessTime: { type: Boolean, default: false },
        accessTimes: { type: Number, default: 0 },
        is_delete: { type: Boolean, default: false },
    },
    SCHEMA_OPTION
);

shortSchema.method({});

const Short = mongoose.model("SHORT", shortSchema, "SHORT");

module.exports = Short;
