const { SCHEMA_OPTION, ignoreModel } = require("../utils/constaints");

const mongoose = require("mongoose");
const { Schema } = mongoose;

const examSchema = new Schema(
	{
		subject: { type: Schema.Types.ObjectId, ref: "SUBJECT" },
		date: Date,
		time: { type: Schema.Types.ObjectId, ref: "TIMES" },
		slot: { type: Number, default: 0 },
		remaining: { type: Number, default: 0 },
	},
	SCHEMA_OPTION
);

examSchema.method({});

const Exam = mongoose.model("EXAM", examSchema, "EXAM");

module.exports = Exam;
