/** @format */

const express = require("express");
const router = express.Router();

const {
	requireSignin,
	isAuth,
	isAdmin,
	isOrderTaker,
} = require("../controllers/auth");
const { userById, addOrderToUserHistory } = require("../controllers/user");
const {
	create,
	listOrders,
	getStatusValues,
	orderById,
	update,
	read,
	remove,
	updateOrderInvoice,
	listOrdersProcessing,
	listOrdersShippedDelivered,
	listOrdersDates,
	OrdersLength,
	listOrdersFilters,
	listOrdersProcessingDates,
	orderByInvoice,
	updateRevert,
	listOrdersExchange,
	listOrdersReturns,
	orderByUserHist,
	getAceOrders,
	orderByPhoneNumber,
	CreateShippingTN,
	getShippingLabel,
	getTrackingDetails,
	listOrdersWeek,
	listOrders30Days,
	aggregateAll,
	aggregateByMonth,
} = require("../controllers/order");
const {
	decreaseQuantity,
	decreaseQtyVariables,
	increaseQtyVariables,
	exchangeProductUpate,
	exchangeRevert,
	decreaseQtyVariablesForEditing,
} = require("../controllers/product");

router.post(
	"/order/create/:userId",
	requireSignin,
	isAuth,
	decreaseQuantity,
	decreaseQtyVariables,
	create,
);

router.post(
	"/order/create-by-customer/:userId",
	decreaseQuantity,
	decreaseQtyVariables,
	addOrderToUserHistory,
	create,
);

router.post("/order/create/guest-user/:userId", decreaseQuantity, create);
router.post(
	"/order/get-limited/orders/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	listOrdersFilters,
);

router.get("/order/list/:userId", requireSignin, isAuth, isAdmin, listOrders);
router.get(
	"/order/list/dates/:day1/:day2/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	listOrdersDates,
);

router.get(
	"/order/list/order-processing/:day1/:day2/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	listOrdersProcessingDates,
);

router.get(
	"/order/length/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	OrdersLength,
);

router.get("/order/length-by-customer", OrdersLength);

router.get(
	"/order/status-values/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	getStatusValues,
);

router.get("/order/:orderId/:userId", requireSignin, isAuth, isAdmin, read);

router.get(
	"/order/byinvoice/:invoice/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	orderByInvoice,
);

router.get(
	"/order/byphone/:phoneNumber/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	orderByPhoneNumber,
);

router.put(
	"/update/order/:orderId/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	increaseQtyVariables,
	update,
);

router.put(
	"/update/order/nodecrease/:orderId/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	update,
);

router.put(
	"/update-edit/order-edit/:orderId/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	decreaseQtyVariablesForEditing,
	update,
);

router.get(
	"/order/list/order-processing/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	listOrdersProcessing,
);

router.get(
	"/order/list/order-processing/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	listOrdersProcessing,
);

router.get(
	"/order/list/order-exchange/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	listOrdersExchange,
);

router.get(
	"/order/list/order-return/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	listOrdersReturns,
);

router.get(
	"/order/list/order-processed/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	listOrdersShippedDelivered,
);

router.post(
	"/order/create/order-taker/:userId",
	requireSignin,
	isAuth,
	decreaseQuantity,
	decreaseQtyVariables,
	create,
);
router.put(
	"/update/order/order-taker/:orderId/:userId",
	requireSignin,
	isAuth,
	isOrderTaker,
	update,
);

router.get(
	"/order/order-taker/:orderId/:userId",
	requireSignin,
	isAuth,
	isOrderTaker,
	read,
);
router.get(
	"/order/list/order-taker/:userId",
	requireSignin,
	isAuth,
	isOrderTaker,
	listOrders,
);

router.delete(
	"/order/:orderId/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	remove,
);

router.put(
	"/order/:orderId/invoice/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	updateOrderInvoice,
);

router.put(
	"/order/:orderId/invoice/stock/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	decreaseQtyVariables,
	updateOrderInvoice,
);

router.put(
	"/update/order-exchange/:orderId/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	exchangeProductUpate,
	update,
);

router.put(
	"/update/order-exchange-return/:orderId/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	exchangeProductUpate,
	increaseQtyVariables,
	update,
);

router.put(
	"/revert/order-exchange-revert/:orderId/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	exchangeRevert,
	updateRevert,
);

router.get(
	"/user/hist/:userPhone/:userId",
	requireSignin,
	isAuth,
	orderByUserHist,
);

router.get(
	"/ace/orderslist/dates/:day1/:day2/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	getAceOrders,
);

router.get(
	"/orders/orderslist/weekly/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	listOrdersWeek,
);

router.get(
	"/orders/orderslist/30days/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	listOrders30Days,
);

router.get(
	"/orders/orderslist/aggregateall/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	aggregateAll,
);

router.get(
	"/orders/orderslist/aggregate-by-month/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	aggregateByMonth,
);

router.post(
	"/aramex/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	CreateShippingTN,
);

router.post(
	"/aramex/printlabel/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	getShippingLabel,
);

router.post(
	"/aramex/trackingDetails/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	getTrackingDetails,
);

router.param("userId", userById);
router.param("orderId", orderById);

module.exports = router;
