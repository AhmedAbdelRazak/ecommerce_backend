/** @format */

const express = require("express");
const router = express.Router();
const {
	requireSignin,
	isAuth,
	isAdmin,
	isOperations,
} = require("../controllers/auth");
const { userById } = require("../controllers/user");

const {
	create,
	listProductsNoFilter,
	productById,
	update,
	like,
	unlike,
	comment,
	uncomment,
	viewsByUser,
	viewsCounter,
	read,
	productStar,
	listBySearch,
	listSearch,
	remove,
} = require("../controllers/product");

router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, create);
router.put(
	"/product/:productId/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	update,
);

router.post("/products/by/search", listBySearch);
router.get("/products/search", listSearch);

router.get("/products", listProductsNoFilter);
router.get("/product/:productId", read);

router.delete(
	"/product/:productId/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	remove,
);

// like unlike
router.put("/post/like", requireSignin, like);
router.put("/post/unlike", requireSignin, unlike);

// comment uncomment
router.put("/post/comment", requireSignin, comment);
router.put("/post/uncomment", requireSignin, uncomment);

//views
router.put("/views", viewsByUser);

//viewsCounter
router.put("/viewscounter", viewsCounter);

// rating
router.put("/product/star/:productId/:userId", requireSignin, productStar);

//operations
router.post(
	"/product/create/operations/:userId",
	requireSignin,
	isAuth,
	isOperations,
	create,
);
router.put(
	"/product/operations/:productId/:userId",
	requireSignin,
	isAuth,
	isOperations,
	update,
);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
