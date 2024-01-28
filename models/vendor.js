/** @format */

const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
	{
		vendorName: {
			type: String,
			trim: true,
			lowercase: true,
			default: "",
		},
		vendorPhone: {
			type: Number,
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
	},
	{ timestamps: true },
);

module.exports = mongoose.model("Vendor", vendorSchema);
