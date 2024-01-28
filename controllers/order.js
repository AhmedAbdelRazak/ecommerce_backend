/** @format */

const fetch = require("node-fetch");
const { Order } = require("../models/order");
const _ = require("lodash");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const orderStatusSMS = require("twilio")(
	process.env.TWILIO_ACCOUNT_SID,
	process.env.TWILIO_AUTH_TOKEN,
);

const ahmed2 = "ahmedabdelrazzak1001010@gmail.com";
const BusinessName = "GQ Shop";
const BusinessWebsite = "https://GQ-Shop.infinite-apps.com/";
const fromEmail = "noreply@infinite-apps.com";
const defaultEmail = "ahmed.abdelrazak@infinite-apps.com";
const phoneNumber2 = "60654676";
const phoneNumber3 = "65533836";
const shopAddress = "123 main street, LA, CA";
const shopLogo =
	"https://res.cloudinary.com/infiniteapps/image/upload/v1640714861/KuwaitDemo/1640714860747.jpg";

exports.orderById = (req, res, next, id) => {
	Order.findById(id).exec((err, order) => {
		if (err || !order) {
			return res.status(400).json({
				error: console.log("Error Getting OrderbyId"),
			});
		}
		req.order = order;
		next();
	});
};

exports.create = (req, res) => {
	// console.log("CREATE ORDER: ", req.body);
	const order = new Order(req.body.order);
	order.save((error, data) => {
		if (error) {
			return res.status(400).json({
				error: "Error Creating AN Order",
			});
		}

		const smsData = {
			phone: `${order.customerDetails.phone}`,
			text: ` Hi ${order.customerDetails.fullName} - \n Your order was successfully taken. Thank you for choosing GQ Shop for Fashion`,
		};

		if (order.sendSMS === true) {
			orderStatusSMS.messages
				.create({
					// locale: "ar",
					body: smsData.text,
					from: "+19094884148",
					to: `+2${smsData.phone}`,
				})
				.then((message) =>
					console.log(`Your message was successfully sent to ${smsData.phone}`),
				)
				.catch((err) => console.log(err));
		}

		res.json(data);

		if (order.customerDetails.email.includes("@")) {
			const FormSubmittionEmail = {
				to: order.customerDetails.email,
				from: fromEmail,
				subject: `${BusinessName} - Order Confirmation`,
				html: `
				  <html>
				  <head>
					<title></title>
	
				  </head>
				  <body style=margin-left:20px;margin-right:20px;margin-top:50px;background:#f2f2f2;border-radius:20px;padding:50px;>
				   <div >
					  Hi ,
					  <br />
					  <br />
						<div>Thank you for choosing <a href=${BusinessWebsite}> ${BusinessName}</a>.</div>
						<h4> Here is a summary of your order: </h4>
						<h5>Address: ${order.customerDetails.address}</h5>
						<h5>Phone: ${order.customerDetails.phone}</h5>
						<h5>Products Qty: ${order.totalOrderedQty}</h5>
						<h5>Total Amount: ${order.totalAmountAfterDiscount} L.E.</h5>
						<br />
						<br />
						 For urgent issues please check our <a href=${BusinessWebsite}> Contacting Details Here</a>.
						 <br />
						 <br />
						 Kind and Best Regards,  <br />
									 ${BusinessName} support team <br />
									 Contact Email: ${defaultEmail} <br />
									 Phone#: ${phoneNumber3} <br />
									 Landline#: ${phoneNumber2} <br />
									 Address:  ${shopAddress}  <br />
									 <br />
									 &nbsp;&nbsp; <img src=${shopLogo} alt=${BusinessName} style="height:100px;width:200px;object-fit:cover;border-radius:15px"  />
									 <br />
									 <p>
									 <strong>${BusinessName}</strong>
									  </p>
									  </div>
				</body>
			  </html>
					`,
			};
			sgMail.send(FormSubmittionEmail);
		}
	});
};

exports.createGuest = (req, res) => {
	// console.log("CREATE ORDER: ", req.body);
	req.body.order.user = req.profile;
	const order = new Order(req.body.order);
	order.save((error, data) => {
		if (error) {
			return res.status(400).json({
				error: "Error Creating AN Order",
			});
		}

		res.json(data);
	});
};

exports.listOrders = (req, res) => {
	Order.find()
		.sort("-orderCreationDate")
		.exec((err, orders) => {
			if (err) {
				return res.status(400).json({
					error: "Error Listing all Orders",
				});
			}
			res.json(orders);
		});
};

exports.listOrdersFilters = (req, res) => {
	let order = req.query.order ? req.query.order : "desc";
	let sortBy = req.query.sortBy ? req.query.sortBy : "viewsCount";
	let limit = req.body.limit ? parseInt(req.body.limit) : 10;

	console.log(req.body);

	Order.find()
		.sort("-orderCreationDate")
		.limit(limit)
		.exec((err, orders) => {
			if (err) {
				return res.status(400).json({
					error: "Error Listing all Orders",
				});
			}
			res.json(orders);
		});
};

exports.listOrdersProcessing = (req, res) => {
	Order.find({
		status: {
			$in: [
				"In Processing",
				"On Hold",
				"Ready To Ship",
				"Exchange - In Processing",
				"Exchange - Ready To Ship",
				"Return Request",
				"In Return",
				"Return Request (Partial)",
				"In Return (Partial)",
				"Exchange - In Processing | In Return (Partial)",
				"In Transit | Rejected",
			],
		},
	})
		.sort("-orderCreationDate")
		.exec((err, orders) => {
			if (err) {
				return res.status(400).json({
					error: "Error Listing all Orders",
				});
			}
			res.json(orders);
		});
};

exports.listOrdersShippedDelivered = (req, res) => {
	Order.find({
		status: {
			$in: [
				"Shipped",
				"Delivered",
				"Exchange - Shipped",
				"Exchange - Delivered",
			],
		},
	})
		.sort("-orderCreationDate")
		.exec((err, orders) => {
			if (err) {
				return res.status(400).json({
					error: "Error Listing all Orders",
				});
			}
			res.json(orders);
		});
};

exports.listOrdersReturns = (req, res) => {
	Order.find({
		status: {
			$in: [
				"Return Request",
				"In Return",
				"Returned and Refunded",
				"Returned and Not Refunded",
				"Returned and Rejected",
				"Return Request (Partial)",
				"In Return (Partial)",
				"Returned and Refunded (Partial)",
				"Returned and Not Refunded (Partial)",
				"Returned and Rejected (Partial)",
				"Exchange - In Processing | In Return (Partial)",
				"Exchange And Return Processed And Stocked",
			],
		},
	})
		.sort("-orderCreationDate")
		.exec((err, orders) => {
			if (err) {
				return res.status(400).json({
					error: "Error Listing all Orders",
				});
			}
			res.json(orders);
		});
};

exports.listOrdersExchange = (req, res) => {
	Order.find({
		status: {
			$in: [
				"Exchange - In Processing",
				"Exchange - Ready To Ship",
				"Exchange - Shipped",
				"Exchange - Delivered",
				"Exchanged - Stocked",
				"Exchange - In Processing | In Return (Partial)",
				"Exchange And Return Processed And Stocked",
			],
		},
	})
		.sort("-orderCreationDate")
		.exec((err, orders) => {
			if (err) {
				return res.status(400).json({
					error: "Error Listing all Orders",
				});
			}
			res.json(orders);
		});
};

exports.getStatusValues = (req, res) => {
	res.json(Order.schema.path("status").enumValues);
};

exports.updateOrderInvoice = (req, res) => {
	console.log(req.body, "Req.Body From Order Invoice");
	Order.update(
		{ _id: req.body.orderId },
		{
			$set: { invoiceNumber: req.body.invoiceNumber, status: "In Processing" },
		},
		(err, order) => {
			if (err) {
				return res.status(400).json({
					error: errorHandler(err),
				});
			}

			res.json(order);
		},
	);
};

exports.read = (req, res) => {
	return res.json(req.order);
};

exports.update = (req, res, next) => {
	// console.log(req.order, "req.order");
	// console.log(req.body.order, "req.body.order");

	const order = req.order;
	order.productsNoVariable = req.body.order.productsNoVariable;
	order.chosenProductQtyWithVariables =
		req.body.order.chosenProductQtyWithVariables;
	order.customerDetails = req.body.order.customerDetails;
	order.totalOrderQty = req.body.order.totalOrderQty;
	order.status = req.body.order.status;
	order.newProducts = [];
	order.oldProducts = [];
	order.onHoldStatus = req.body.order.onHoldStatus;
	order.totalAmount = req.body.order.totalAmount;
	order.totalAmountAfterDiscount = req.body.order.totalAmountAfterDiscount;
	order.orderTakerDiscount = req.body.order.orderTakerDiscount;
	order.employeeData = req.body.order.employeeData;
	order.totalOrderedQty = req.body.order.totalOrderedQty;
	order.chosenShippingOption = req.body.order.chosenShippingOption;
	order.orderSource = req.body.order.orderSource;
	order.returnStatus = req.body.order.returnStatus;
	order.trackingNumber = req.body.order.trackingNumber;
	order.invoiceNumber = req.body.order.invoiceNumber;
	order.shipDate = req.body.order.shipDate;
	order.returnDate = req.body.order.returnDate;
	order.returnedItems = req.body.order.returnedItems;
	order.orderCreationDate = req.body.order.orderCreationDate;
	order.returnAmount = req.body.order.returnAmount;
	order.refundMethod = req.body.order.refundMethod;
	order.refundNumber = req.body.order.refundNumber;
	order.exchangeTrackingNumber = req.body.order.exchangeTrackingNumber;
	order.totalAmountAfterExchange = req.body.order.totalAmountAfterExchange;
	order.reasonForReturn = req.body.order.reasonForReturn;
	order.aramexResponse = req.body.order.aramexResponse;
	order.paymobData = req.body.order.paymobData;
	order.exhchangedProductsNoVariable =
		req.body.order.exhchangedProductsNoVariable;
	order.exchangedProductQtyWithVariables =
		req.body.order.exchangedProductQtyWithVariables;

	order.save((err, data) => {
		if (err) {
			console.log(err, "error Updating");
			return res.status(400).json({
				error: err,
			});
		}
		res.json(data);
	});
};

exports.remove = (req, res) => {
	const order = req.order;

	order.remove((err, data) => {
		if (err) {
			console.log(err, "err");
			return res.status(400).json({
				err: "error while removing order",
			});
		}
		res.json({ message: "order deleted" });
	});
};

// queries

//Today's Orders

exports.listOrdersDates = (req, res) => {
	var day1Modified = new Date(req.params.day1).setHours(0, 0, 0, 0);
	var day2Modified = new Date(req.params.day2).setHours(0, 0, 0, 0);
	console.log(req.params.day1, "req.params.day1");
	console.log(req.params.day2, "day2Modified");

	if (day1Modified === day2Modified) {
		Order.find({
			orderCreationDate: {
				$gte: day2Modified,
			},
		})
			.sort("-orderCreationDate")
			.exec((err, orders) => {
				if (err) {
					return res.status(400).json({
						error: "Error Listing all Orders",
					});
				}
				res.json(orders);
			});
	} else {
		Order.find({
			orderCreationDate: {
				$gte: day2Modified,
				$lte: day1Modified,
			},
		})
			.sort("-orderCreationDate")
			.exec((err, orders) => {
				if (err) {
					return res.status(400).json({
						error: "Error Listing all Orders",
					});
				}
				res.json(orders);
			});
	}
};

exports.listOrdersProcessingDates = (req, res) => {
	var day1Modified = new Date(req.params.day1).setHours(0, 0, 0, 0);
	var day2Modified = new Date(req.params.day2).setHours(0, 0, 0, 0);

	Order.find({
		orderCreationDate: {
			$gte: day2Modified,
			$lte: day1Modified,
		},
		status: {
			$in: [
				"In Processing",
				"On Hold",
				"Ready To Ship",
				"Exchange - In Processing",
				"Exchange - Ready To Ship",
				"Return Request",
				"In Return",
				"In Transit | Rejected",
			],
		},
	})
		.sort("-orderCreationDate")
		.exec((err, orders) => {
			if (err) {
				return res.status(400).json({
					error: "Error Listing all Orders",
				});
			}
			res.json(orders);
		});
};

exports.OrdersLength = (req, res) => {
	Order.countDocuments().exec((err, orders) => {
		if (err) {
			return res.status(400).json({
				error: "Error Listing all Orders",
			});
		}
		res.json(orders);
	});
};

exports.orderByInvoice = (req, res) => {
	console.log(req.params.invoice, "Invoice");
	console.log("Hi There");
	Order.find({
		invoiceNumber: {
			$in: [req.params.invoice],
		},
	}).exec((err, orders) => {
		if (err) {
			return res.status(400).json({
				error: "Error Listing all Orders",
			});
		}
		res.json(orders);
		console.log(orders);
	});
};

exports.orderByPhoneNumber = (req, res) => {
	console.log(req.params.phoneNumber, "req.params.phoneNumber");

	Order.find({
		"customerDetails.phone": req.params.phoneNumber,
	}).exec((err, orders) => {
		if (err) {
			return res.status(400).json({
				error: "Error Listing all Orders",
			});
		}
		res.json(orders);
		console.log(orders);
	});
};

exports.updateRevert = (req, res) => {
	// console.log(req.body);
	const order = req.order;
	order.productsNoVariable = req.body.order.productsNoVariable;
	order.chosenProductQtyWithVariables =
		req.body.order.chosenProductQtyWithVariables;
	order.customerDetails = req.body.order.customerDetails;
	order.totalOrderQty = req.body.order.totalOrderQty;
	order.status = "Delivered";
	order.totalAmount = req.body.order.totalAmount;
	order.totalAmountAfterDiscount = req.body.order.totalAmountAfterDiscount;
	order.orderTakerDiscount = req.body.order.orderTakerDiscount;
	order.employeeData = req.body.order.employeeData;
	order.totalOrderedQty = req.body.order.totalOrderedQty;
	order.chosenShippingOption = req.body.order.chosenShippingOption;
	order.orderSource = req.body.order.orderSource;
	order.returnStatus = "Not Returned";
	order.onHoldStatus = req.body.order.onHoldStatus;
	order.trackingNumber = req.body.order.trackingNumber;
	order.aramexResponse = req.body.order.aramexResponse;
	order.invoiceNumber = req.body.order.invoiceNumber;
	order.shipDate = req.body.order.shipDate;
	order.returnDate = "";
	order.returnedItems = req.body.order.returnedItems;
	order.orderCreationDate = req.body.order.orderCreationDate;
	order.paymobData = req.body.order.paymobData;
	order.returnAmount = "";
	order.refundMethod = "";
	order.refundNumber = "";
	order.returnedItems = [];
	order.exchangeTrackingNumber = "Not Added";
	order.totalAmountAfterExchange = "";
	order.reasonForReturn = "";
	order.exhchangedProductsNoVariable = [];
	order.exchangedProductQtyWithVariables = [];

	order.save((err, data) => {
		if (err) {
			return res.status(400).json({
				error: err,
			});
		}
		res.json(data);
	});
};

exports.getAceOrders = (req, res) => {
	Order.find({
		orderSource: {
			$eq: "ace",
		},
	}).exec((err, orders) => {
		if (err) {
			return res.status(400).json({
				error: "Error Listing all Orders",
			});
		}

		res.json(orders);
	});
};

exports.getAceOrders = (req, res) => {
	var day1Modified = new Date(req.params.day1).setHours(0, 0, 0, 0);
	var day2Modified = new Date(req.params.day2).setHours(0, 0, 0, 0);
	// console.log(day2Modified, "Day2");
	// console.log(day1Modified, "day1Modified");

	Order.find({
		orderSource: {
			$eq: "ace",
		},
		orderCreationDate: {
			$gte: day2Modified,
			$lte: day1Modified,
		},
	})
		.sort("-orderCreationDate")
		.exec((err, orders) => {
			if (err) {
				return res.status(400).json({
					error: "Error Listing all Orders",
				});
			}
			res.json(orders);
		});
};

exports.orderByUserHist = (req, res) => {
	Order.find({
		"customerDetails.phone": {
			$eq: req.params.userPhone,
		},
	}).exec((err, orders) => {
		if (err) {
			return res.status(400).json({
				error: "Error Listing all Orders",
			});
		}

		res.json(orders);
	});
};
exports.CreateShippingTN = async (req, res) => {
	// console.log(req.body, "Create Shipment Req.body");
	const AramexObject = JSON.stringify(req.body);

	console.log(AramexObject, "AramexObject");

	const response = await fetch(
		"https://ws.aramex.net/ShippingAPI.V2/Shipping/Service_1_0.svc/json/CreateShipments",
		{
			method: "post",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: AramexObject,
		},
	);
	const data = await response.json();

	// console.log(data.Shipments, "Data Returned");
	return res.json(data);
};

exports.getShippingLabel = async (req, res) => {
	// console.log(req.body, "Create Shipment Req.body");
	const AramexObject = JSON.stringify(req.body);

	console.log(AramexObject, "AramexObject");

	const response = await fetch(
		"https://ws.aramex.net/ShippingAPI.V2/Shipping/Service_1_0.svc/json/PrintLabel",
		{
			method: "post",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: AramexObject,
		},
	);
	const data = await response.json();

	// console.log(data, "Data Returned");
	return res.json(data);
};

exports.getTrackingDetails = async (req, res) => {
	// console.log(req.body, "Create Shipment Req.body");
	const AramexObject = JSON.stringify(req.body);

	const response = await fetch(
		"https://ws.aramex.net/ShippingAPI.V2/Tracking/Service_1_0.svc/json/TrackShipments",
		{
			method: "post",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: AramexObject,
		},
	);
	const data = await response.json();

	// console.log(data, "Data Returned");
	return res.json(data);
};

exports.listOrdersWeek = (req, res) => {
	let lastWeek = new Date();
	lastWeek.setDate(lastWeek.getDate() - 7);

	Order.find({
		orderCreationDate: {
			$gte: lastWeek,
		},
	})
		.sort("-orderCreationDate")
		.exec((err, orders) => {
			if (err) {
				return res.status(400).json({
					error: "Error Listing all Orders",
				});
			}
			res.json(orders);
		});
};

exports.listOrders30Days = (req, res) => {
	let last30Days = new Date();
	last30Days.setDate(last30Days.getDate() - 30);

	Order.find({
		orderCreationDate: {
			$gte: last30Days,
		},
	})
		.sort("-orderCreationDate")
		.exec((err, orders) => {
			if (err) {
				return res.status(400).json({
					error: "Error Listing all Orders",
				});
			}
			res.json(orders);
		});
};

exports.aggregateAll = (req, res) => {
	Order.find({
		status: {
			$in: [
				"In Processing",
				"On Hold",
				"Ready To Ship",
				"Shipped",
				"Delivered",
				"Exchange - In Processing",
				"Exchange - Ready To Ship",
				"Exchange - Shipped",
				"In Transit",
				"Exchange - Delivered",
				"Exchanged - Stocked",
				"Exchange - In Processing | In Return (Partial)",
				"Exchange And Return Processed And Stocked",
			],
		},
	}).exec((err, orders) => {
		if (err) {
			return res.status(400).json({
				error: "Error Listing all Orders",
			});
		}

		const todaysRevenue =
			orders && orders.map((i) => i.totalAmountAfterDiscount);
		const sumOfTodaysRevenue = todaysRevenue.reduce((a, b) => a + b, 0);

		res.json({ totalAmount: sumOfTodaysRevenue, ordersCount: orders.length });
	});
};

exports.aggregateByMonth = (req, res) => {
	Order.find().exec((err, orders) => {
		if (err) {
			return res.status(400).json({
				error: "Error Listing all Orders",
			});
		}

		let ordersModified = orders.map((ii) => {
			return {
				...ii,
				orderCreationDate: new Date(ii.orderCreationDate).toLocaleDateString(),
				statusModified:
					ii.status === "Cancelled" || ii.status.includes("Rejected")
						? "Cancelled"
						: "Good Order",
			};
		});

		var OrdersDates_TotalAmount = [];
		ordersModified &&
			ordersModified.reduce(function (res, value) {
				if (!res[value.orderCreationDate + value.statusModified]) {
					res[value.orderCreationDate + value.statusModified] = {
						orderCreationDate: value.orderCreationDate,
						status: value.statusModified,
						totalAmountAfterDiscount: 0,
						ordersCount: 0,
					};
					OrdersDates_TotalAmount.push(
						res[value.orderCreationDate + value.statusModified],
					);
				}
				res[
					value.orderCreationDate + value.statusModified
				].totalAmountAfterDiscount += Number(
					value._doc.totalAmountAfterDiscount,
				);

				res[value.orderCreationDate + value.statusModified].ordersCount += 1;

				return res;
			}, {});

		res.json(OrdersDates_TotalAmount);
	});
};
