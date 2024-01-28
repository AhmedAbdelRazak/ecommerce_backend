/** @format */

const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
	{
		productsNoVariable: Array,
		chosenProductQtyWithVariables: Array,
		exhchangedProductsNoVariable: Array,
		exchangedProductQtyWithVariables: Array,
		customerDetails: {},
		totalOrderQty: Number,
		status: String,
		onHoldStatus: String,
		totalAmount: Number,
		totalAmountAfterDiscount: Number,
		orderTakerDiscount: Number,
		employeeData: {},
		totalOrderedQty: Number,
		chosenShippingOption: {},
		aramexResponse: {},
		orderSource: String,
		oldProducts: {
			type: Array,
			default: [],
		},
		newProducts: {
			type: Array,
			default: [],
		},
		appliedCoupon: {
			type: Object,
			default: {},
		},
		returnStatus: String,
		shipDate: Date,
		returnDate: Date,
		orderCreationDate: Date,
		trackingNumber: String,
		invoiceNumber: {
			type: String,
			default: "Not Added",
		},
		OTNumber: {
			type: String,
			default: "Not Added",
		},
		sendSMS: Boolean,
		freeShipping: Boolean,
		shippingFees: Number,
		appliedShippingFees: Number,
		totalAmountAfterExchange: Number,
		returnedItems: {
			type: Array,
			default: [],
		},
		returnAmount: Number,
		refundMethod: String,
		paymentStatus: String,
		exchangeTrackingNumber: String,
		refundNumber: String,
		reasonForReturn: String,
		paymobData: {},

		forAI: {},
	},
	{ timestamps: true },
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = { Order };
