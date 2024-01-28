/** @format */

const Vendor = require("../models/vendor");

exports.vendorById = (req, res, next, id) => {
	Vendor.findById(id).exec((err, vendor) => {
		if (err || !vendor) {
			return res.status(400).json({
				error: "vendor was not found",
			});
		}
		req.vendor = vendor;
		next();
	});
};

exports.create = (req, res) => {
	const vendor = new Vendor(req.body);
	vendor.save((err, data) => {
		if (err) {
			console.log(err, "err");
			return res.status(400).json({
				error: "Cannot Create vendor",
			});
		}
		res.json({ data });
	});
};

exports.read = (req, res) => {
	return res.json(req.vendor);
};

exports.update = (req, res) => {
	const vendor = req.vendor;
	vendor.vendorName = req.body.vendorName;
	vendor.vendorAddress = req.body.vendorAddress;
	vendor.vendorPhone = req.body.vendorPhone;
	vendor.vendorCountry = req.body.vendorCountry;

	vendor.save((err, data) => {
		if (err) {
			return res.status(400).json({
				error: err,
			});
		}
		res.json(data);
	});
};

exports.list = (req, res) => {
	Vendor.find().exec((err, data) => {
		if (err) {
			return res.status(400).json({
				error: err,
			});
		}
		res.json(data);
	});
};

exports.remove = (req, res) => {
	const vendor = req.vendor;

	vendor.remove((err, data) => {
		if (err) {
			return res.status(400).json({
				err: "error while removing",
			});
		}
		res.json({ message: "Vendor deleted" });
	});
};
