/** @format */

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const vendorSchema = new mongoose.Schema(
	{
		vendorName: {
			type: String,
			trim: true,
			lowercase: true,
			default: "",
		},
		vendorPhone: {
			type: String,
			trim: true,
			lowercase: true,
			default: "",
		},
		vendorCountry: {
			type: String,
			trim: true,
			lowercase: true,
			default: "",
		},
		vendorAddress: {
			type: String,
			trim: true,
			lowercase: true,
			default: "",
		},

		thumbnail: {
			type: Array,
		},
		banner: {
			type: Array,
		},

		belongsTo: { type: ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);
