const { SCHEMA_OPTION, ignoreModel } = require("../utils/constaints");

const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        username: String,
        password: String,
        email: String,
        phone: String,
        name: String,
        role: {
            type: String,
            default: "ADMIN",
            enum: ["ADMIN"],
        },
        is_delete: { type: Boolean, default: false },
    },
    SCHEMA_OPTION
);

userSchema.static({
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

userSchema.method({});

const User = mongoose.model("USER", userSchema, "USER");

module.exports = User;
