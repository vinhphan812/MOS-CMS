const { SCHEMA_OPTION, ignoreModel } = require("../utils/constaints");

const mongoose = require("mongoose");
const { Schema } = mongoose;

const registerSchema = new Schema(
    {
        username: String,
        password: String,
        email: String,
        phone: String,
        first_name: String,
        gender: { type: String, enum: ["male", "female"], default: "male" },
        address: String,
        last_name: String,
        avatar: { type: String, default: "" },
        role: {
            type: String,
            default: "ADMIN",
            enum: ["ADMIN"],
        },
        is_delete: { type: Boolean, default: false },
    },
    SCHEMA_OPTION
);

registerSchema.static({
    get: async function (_id) {
        return await this.findOne(
            { _id },
            ignoreModel(["password"])
        );
    },
    updateUser: async function (_id, $set) {
        await this.updateOne({ _id }, { $set });
        return this.get(_id);
    },
});

registerSchema.method({});

const Register = mongoose.model("REGISTER", registerSchema, "REGISTER");

module.exports = Register;
