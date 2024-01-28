/** @format */

const Parent = require("../models/parent");

exports.parentById = async (req, res, next, id) => {
    try {
        const parent = await Parent.findById(id).exec();
        if (!parent) {
            return res.status(400).json({
                error: "parent was not found",
            });
        }
        req.parent = parent;
        next();
    } catch (err) {
        res.status(400).json({ error: "parent not found" });
    }
};


exports.create = async (req, res) => {
    const parent = new Parent(req.body);

    try {
        const data = await parent.save();
        res.json({ data });
    } catch (err) {
        res.status(400).json({ error: "Cannot Create parent" });
    }
};


exports.read = (req, res) => {
	return res.json(req.parent);
};

exports.update = async (req, res) => {
    console.log(req.body);
    const parent = req.parent;
    parent.parentName = req.body.parentName;
    parent.parentName_Arabic = req.body.parentName_Arabic;
    parent.parentNameSlug = req.body.parentNameSlug;
    parent.parentNameSlug_Arabic = req.body.parentNameSlug_Arabic;
    parent.parentName_Arabic = req.body.parentName_Arabic;
    parent.parentNameStatus = req.body.parentNameStatus;
    parent.thumbnail = req.body.thumbnail;

    try {
        const data = await parent.save();
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.list = async (req, res) => {
    try {
        const data = await Parent.find().exec();
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.remove = (req, res) => {
	const parent = req.parent;

	parent.remove((err, data) => {
		if (err) {
			return res.status(400).json({
				err: "error while removing",
			});
		}
		res.json({ message: "parent deleted" });
	});
};
