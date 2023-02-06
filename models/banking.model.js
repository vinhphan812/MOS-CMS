const { SCHEMA_OPTION, ignoreModel } = require("../utils/constaints");

const mongoose = require("mongoose");
const { Schema } = mongoose;

const bankingSchema = new Schema(
    {
        amount: { type: Number, default: 0 },
        description: { type: String, default: "" },
        date: Date,
        status: { type: Boolean, default: false },
        email: { type: String, default: "" },
        sendType: { type: String, default: "" }
    },
    SCHEMA_OPTION
);

bankingSchema.static({});

bankingSchema.method({});

const BANKING = mongoose.model("BANKING", bankingSchema, "BANKING");

module.exports = BANKING;
