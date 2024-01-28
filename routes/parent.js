/** @format */

const express = require("express");
const router = express.Router();
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

const {
	create,
	parentById,
	read,
	update,
	list,
	remove,
} = require("../controllers/parent");

router.get("/parent/:parentId", read);

router.post("/parent/create/:userId", requireSignin, isAuth, isAdmin, create);

router.put("/parent/:parentId/:userId", requireSignin, isAuth, isAdmin, update);

router.delete(
	"/parent/:parentId/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	remove,
);

router.get("/parents", list);

router.param("userId", userById);
router.param("parentId", parentById);

module.exports = router;
