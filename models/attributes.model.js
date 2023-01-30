const { SCHEMA_OPTION, ignoreModel } = require("../utils/constaints");

const mongoose = require("mongoose");
const { Schema } = mongoose;

const attributeSchema = new Schema(
    {
        key: String,
        value: String,
    },
    SCHEMA_OPTION
);

attributeSchema.static({});

attributeSchema.method({});

const Attributes = mongoose.model("ATTRIBUTES", attributeSchema, "ATTRIBUTES");

module.exports = Attributes;
