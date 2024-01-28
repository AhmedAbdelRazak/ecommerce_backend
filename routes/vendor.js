/** @format */

const express = require("express");
const router = express.Router();
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

const {
	create,
	vendorById,
	read,
	update,
	list,
	remove,
} = require("../controllers/vendor");

router.get("/vendor/:vendorId", read);

router.post("/vendor/create/:userId", requireSignin, isAuth, isAdmin, create);

router.put("/vendor/:vendorId/:userId", requireSignin, isAuth, isAdmin, update);

router.delete(
	"/vendor/:vendorId/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	remove,
);

router.get("/vendors", list);

router.param("userId", userById);
router.param("vendorId", vendorById);

module.exports = router;
