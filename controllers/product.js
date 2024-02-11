/** @format */

const Product = require("../models/product");
const User = require("../models/user");

exports.productById = async (req, res, next, id) => {
	try {
		const product = await Product.findById(id)
			.populate("ratings.ratedBy", "_id name email")
			.populate("comments.postedBy", "_id name email")
			.populate(
				"subcategory",
				"_id SubcategoryName SubcategorySlug subCategoryStatus"
			)
			.populate(
				"category",
				"_id categoryName categorySlug thumbnail categoryName_Arabic"
			)
			.populate("parentName", "_id parentName thumbnail")
			.populate("gender", "_id genderName thumbnail")
			.populate("addedByEmployee", "_id name role")
			.populate("updatedByEmployee", "_id name role")
			.populate(
				"relatedProducts",
				"_id productName productName_Arabic productSKU slug slug_Arabic price priceAfterDiscount quantity images activeProduct category subcategory productAttributes thumbnailImage"
			)
			.exec();

		if (!product) {
			return res.status(400).json({
				error: "Product not found",
			});
		}

		req.product = product;
		next();
	} catch (err) {
		res.status(400).json({ error: "Product not found" });
	}
};

exports.read = (req, res) => {
	return res.json(req.product);
};

exports.create = async (req, res) => {
	try {
		const newProduct = await new Product(req.body).save();
		// console.log(req.body, "create a product");
		res.json(newProduct);
	} catch (err) {
		console.log(err, "Error while creating a Product");
		res.status(400).send("Product error during creation");
	}
};

exports.listProductsNoFilter = async (req, res) => {
	let order = req.query.order ? req.query.order : "desc";
	let sortBy = req.query.sortBy ? req.query.sortBy : "viewsCount";
	let limit = req.query.limit ? parseInt(req.query.limit) : 200;

	try {
		const products = await Product.find()
			.populate(
				"category",
				"_id categoryName categorySlug thumbnail categoryName_Arabic"
			)
			.populate("parentName", "_id parentName thumbnail")
			.populate(
				"subcategory",
				"_id SubcategoryName SubcategorySlug thumbnail SubcategoryName_Arabic"
			)
			.populate("gender", "_id genderName thumbnail")
			.populate("addedByEmployee", "_id name role")
			.populate("updatedByEmployee", "_id name role")
			.populate(
				"relatedProducts",
				"_id productName productName_Arabic productSKU slug slug_Arabic price priceAfterDiscount quantity images activeProduct category subcategory productAttributes thumbnailImage"
			)
			.sort([[sortBy, order]])
			.limit(limit);

		res.json(products);
	} catch (error) {
		console.log(error);
		res.status(400).json({ error: error.message });
	}
};

exports.update = (req, res) => {
	console.log(req.body);
	const product = req.product;
	product.productName = req.body.product.productName;
	product.productName_Arabic = req.body.product.productName_Arabic;
	product.slug = req.body.product.slug;
	product.slug_Arabic = req.body.product.slug_Arabic;
	product.description = req.body.product.description;
	product.description_Arabic = req.body.product.description_Arabic;
	product.price = req.body.product.price;
	product.priceAfterDiscount = req.body.product.priceAfterDiscount;
	product.MSRPPriceBasic = req.body.product.MSRPPriceBasic;
	product.price_unit = req.body.product.price_unit;
	product.parentName = req.body.product.parentName;
	product.quantity = req.body.product.quantity;
	product.category = req.body.product.category;
	product.subcategory = req.body.product.subcategory;
	product.thumbnailImage = req.body.product.thumbnailImage;
	product.shipping = req.body.product.shipping;
	product.activeProduct = req.body.product.activeProduct;
	product.featuredProduct = req.body.product.featuredProduct;
	product.productSKU = req.body.product.productSKU;
	product.loyaltyPoints = req.body.product.loyaltyPoints;
	product.relatedProducts = req.body.product.relatedProducts;
	product.productAttributes = req.body.product.productAttributes;
	product.clearance = req.body.product.clearance;
	product.updatedByEmployee = req.body.product.updatedByEmployee;
	product.chosenSeason = req.body.product.chosenSeason;
	product.viewsCount = req.body.product.viewsCount;
	product.WholeSalePriceBasic = req.body.product.WholeSalePriceBasic;
	product.DropShippingPriceBasic = req.body.product.DropShippingPriceBasic;
	product.activeBackorder = req.body.product.activeBackorder;
	product.gender = req.body.product.gender;
	product.sizeChart = req.body.product.sizeChart;
	product.policy = req.body.product.policy;
	product.policy_Arabic = req.body.product.policy_Arabic;
	product.DNA = req.body.product.DNA;
	product.DNA_Arabic = req.body.product.DNA_Arabic;
	product.Specs = req.body.product.Specs;
	product.Specs_Arabic = req.body.product.Specs_Arabic;
	product.fitCare = req.body.product.fitCare;
	product.fitCare_Arabic = req.body.product.fitCare_Arabic;
	product.productUPC = req.body.product.productUPC;

	product.save((err, data) => {
		if (err) {
			console.log(err);

			return res.status(400).json({
				error: err,
			});
		}
		res.json(data);
	});
};

exports.listRelated = async (req, res) => {
	let limit = req.query.limit ? parseInt(req.query.limit) : 6;

	try {
		const products = await Product.find({
			_id: { $ne: req.product },
			category: req.product.category,
		})
			.select("-photo -photo2 -photo3 -photo4 -photo5")
			.limit(limit)
			.populate("category", "_id name")
			.populate("parentName", "_id parentName thumbnail")
			.populate(
				"subcategory",
				"_id SubcategoryName SubcategorySlug subCategoryStatus"
			)
			.exec();

		res.json(products);
	} catch (err) {
		res.status(400).json({ error: "Products not found" });
	}
};

exports.listCategories = async (req, res) => {
	try {
		const categories = await Product.distinct("category").exec();
		res.json(categories);
	} catch (err) {
		res.status(400).json({ error: "Categories not found" });
	}
};

exports.list = (req, res) => {
	let order = req.query.order ? req.query.order : "desc";
	let sortBy = req.query.sortBy ? req.query.sortBy : "viewsCount";
	let limit = req.query.limit ? parseInt(req.query.limit) : 200;

	Product.find()
		.populate(
			"category",
			"_id categoryName categorySlug thumbnail categoryName_Arabic"
		)
		.populate("parentName", "_id parentName thumbnail")
		.populate("comments", "text created")
		.populate("comments.postedBy", "_id name email")
		.populate(
			"subcategory",
			"_id SubcategoryName SubcategorySlug subCategoryStatus"
		)
		.populate("addedByEmployee", "_id name role")
		.populate("updatedByEmployee", "_id name role")
		.populate(
			"relatedProducts",
			"_id productName productName_Arabic productSKU slug slug_Arabic price priceAfterDiscount quantity images activeProduct category subcategory productAttributes thumbnailImage"
		)
		.sort([[sortBy, order]])
		.limit(limit)
		.exec((err, products) => {
			if (err) {
				return res.status(400).json({
					err: "products not found",
				});
			}
			res.json(products);
		});
};

exports.listBySearch = (req, res) => {
	let order = req.body.order ? req.body.order : "desc";
	let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
	let findArgs = {};

	// console.log(order, sortBy, limit, skip, req.body.filters);
	// console.log("findArgs", findArgs);

	for (let key in req.body.filters) {
		if (req.body.filters[key].length > 0) {
			if (key === "price") {
				// gte -  greater than price [0-10]
				// lte - less than
				findArgs[key] = {
					$gte: req.body.filters[key][0],
					$lte: req.body.filters[key][1],
				};
			} else {
				findArgs[key] = req.body.filters[key];
			}
		}
	}

	Product.find(findArgs)
		.populate(
			"category",
			"_id categoryName categorySlug thumbnail categoryName_Arabic"
		)
		.populate("parentName", "_id parentName thumbnail")
		.populate(
			"subcategory",
			"_id SubcategoryName SubcategorySlug subCategoryStatus"
		)
		.populate(
			"relatedProducts",
			"_id productName productName_Arabic productSKU slug slug_Arabic price priceAfterDiscount quantity images activeProduct category subcategory productAttributes thumbnailImage"
		)
		.sort([[sortBy, order]])
		.exec((err, data) => {
			if (err) {
				return res.status(400).json({
					error: "Products not found",
				});
			}
			res.json({
				size: data.length,
				data,
			});
		});
};

exports.listSearch = (req, res) => {
	// create query object to hold search value and category value
	const query = {};
	// assign search value to query.name
	console.log(req.query.search, "search");
	if (req.query.search) {
		query.productName = { $regex: req.query.search, $options: "i" };
		console.log(query.name, "query name");
		// assigne category value to query.category
		if (req.query.category && req.query.category != "All") {
			query.category = req.query.category;
		}
		// find the product based on query object with 2 properties
		// search and category
		console.log(query, "all the query");
		Product.find(query, (err, products) => {
			if (err) {
				return res.status(400).json({
					error: errorHandler(err),
				});
			}
			res.json(products);
		}).select("-photo -photo2 -photo3 -photo4 -photo5");
	}
};

exports.like = async (req, res) => {
	try {
		const result = await Product.findByIdAndUpdate(
			req.body.productId,
			{ $push: { likes: req.body.userId } },
			{ new: true }
		).exec();

		res.json(result);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

exports.unlike = async (req, res) => {
	try {
		const result = await Product.findByIdAndUpdate(
			req.body.productId,
			{ $pull: { likes: req.body.userId } },
			{ new: true }
		).exec();

		res.json(result);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

exports.viewsCounter = async (req, res) => {
	let counter = req.body.counter;

	try {
		const result = await Product.findByIdAndUpdate(
			req.body.productId,
			{ viewsCount: counter },
			{ new: true } // Add this if you want to return the updated document
		).exec();

		res.json(result);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

exports.viewsByUser = async (req, res) => {
	var currentdate = new Date();
	var datetime =
		currentdate.getDate() +
		"/" +
		(currentdate.getMonth() + 1) +
		"/" +
		currentdate.getFullYear() +
		" " +
		currentdate.getHours() +
		":" +
		currentdate.getMinutes() +
		":" +
		currentdate.getSeconds();

	try {
		const result = await Product.findByIdAndUpdate(
			req.body.productId,
			{ $push: { views: datetime } },
			{ new: true } // Add this if you want to return the updated document
		).exec();

		res.json(result);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

exports.comment = async (req, res) => {
	let comment = req.body.comment;
	comment.postedBy = req.body.userId;
	// console.log(req.body, "comments");

	try {
		const result = await Product.findByIdAndUpdate(
			req.body.productId,
			{ $push: { comments: comment } },
			{ new: true }
		)
			.populate("comments.postedBy", "_id name email")
			// .populate("postedBy", "_id name email")
			.exec();

		res.json(result);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

exports.uncomment = async (req, res) => {
	let comment = req.body.comment;

	try {
		const result = await Product.findByIdAndUpdate(
			req.body.productId,
			{ $pull: { comments: { _id: comment._id } } },
			{ new: true }
		)
			.populate("comments.postedBy", "_id name email")
			// .populate("postedBy", "_id name email")
			.exec();

		res.json(result);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

exports.productStar = async (req, res) => {
	try {
		const product = await Product.findById(req.params.productId).exec();
		const user = await User.findById(req.body.userId).exec();
		const { star } = req.body;

		// Check if currently logged in user has already added a rating to this product
		let existingRatingObject = product.ratings.find(
			(ele) => ele.ratedBy.toString() === user._id.toString()
		);

		// If user hasn't left a rating yet, push it
		if (existingRatingObject === undefined) {
			let ratingAdded = await Product.findByIdAndUpdate(
				product._id,
				{
					$push: { ratings: { star, ratedBy: user._id } },
				},
				{ new: true }
			).exec();

			res.json(ratingAdded);
		} else {
			// If user has already left a rating, update it
			const ratingUpdated = await Product.updateOne(
				{
					_id: product._id,
					"ratings._id": existingRatingObject._id,
				},
				{
					$set: { "ratings.$.star": star },
				},
				{ new: true }
			).exec();

			res.json(ratingUpdated);
		}
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

exports.decreaseQuantity = (req, res, next) => {
	let bulkOps = req.body.order.productsNoVariable.map((item) => {
		return {
			updateOne: {
				filter: { _id: item._id },
				update: { $inc: { quantity: -item.orderedQuantity } },
			},
		};
	});

	Product.bulkWrite(bulkOps, {}, (error, products) => {
		if (error) {
			return res.status(400).json({
				error: "Could not update product",
			});
		}
		next();
	});
};

exports.decreaseQtyVariables = (req, res, next) => {
	let habalYala = req.body.order.chosenProductQtyWithVariables.map((ii) => {
		return ii.map((iii) => iii);
	});

	let bulkOps = habalYala.map((items) => {
		return items.map((item) => {
			return {
				updateOne: {
					filter: {
						_id: item.productId,
					},

					update: {
						$inc: {
							"productAttributes.$[elemX].quantity":
								item.quantity <= 0
									? 0
									: item.quantity < item.OrderedQty
										? 0
										: -item.OrderedQty,
						},
					},

					arrayFilters: [
						{
							"elemX.SubSKU": item.SubSKU,
						},
					],
				},
			};
		});
	});

	if (
		req.body.order.onHoldStatus !== "On Hold" ||
		req.body.onholdStatus === "Not On Hold"
	) {
		if (bulkOps.length > 1) {
			bulkOps.map((item, i) => {
				Product.bulkWrite(bulkOps[i], {}, (error, products) => {
					if (error) {
						console.log(error);
						return res.status(400).json({
							error: "Could not update product variable",
						});
					}
				});
			});
			next();
		} else {
			Product.bulkWrite(bulkOps[0], {}, (error, products) => {
				if (error) {
					console.log(error);
					return res.status(400).json({
						error: "Could not update product variable",
					});
				}
				next();
			});
		}
	} else {
		next();
	}
};

exports.decreaseQtyVariablesForEditing = (req, res, next) => {
	console.log(
		req.body.order.oldProducts.map((i) => i.SubSKU),
		"req.body.order.oldProducts"
	);
	console.log(
		req.body.order.newProducts.map((i) => i.SubSKU),
		"req.body.order.newProducts"
	);

	let bulkOps = req.body.order.newProducts.map((item) => {
		return {
			updateOne: {
				filter: {
					_id: item.productId,
				},

				update: {
					$inc: {
						"productAttributes.$[elemX].quantity":
							item.quantity <= 0
								? 0
								: item.quantity < item.OrderedQty
									? 0
									: -item.OrderedQty,
					},
				},

				arrayFilters: [
					{
						"elemX.SubSKU": item.SubSKU,
					},
				],
			},
		};
	});

	let bulkOps2 = req.body.order.oldProducts.map((item) => {
		return {
			updateOne: {
				filter: {
					_id: item.productId,
				},

				update: {
					$inc: {
						"productAttributes.$[elemX].quantity": item.OrderedQty,
					},
				},

				arrayFilters: [
					{
						"elemX.SubSKU": item.SubSKU,
					},
				],
			},
		};
	});

	console.log(bulkOps, "bulkOps");

	if (bulkOps.length > 1) {
		bulkOps.map((item, i) => {
			Product.bulkWrite(bulkOps[i], {}, (error, products) => {
				if (error) {
					console.log(error);
					return res.status(400).json({
						error: "Could not update product variable",
					});
				}
			});
		});
	} else {
		Product.bulkWrite(bulkOps, {}, (error, products) => {
			if (error) {
				console.log(error);
				return res.status(400).json({
					error: "Could not update product variable",
				});
			}
		});
	}

	if (bulkOps2.length > 1) {
		bulkOps2.map((item, i) => {
			Product.bulkWrite(bulkOps2[i], {}, (error, products) => {
				if (error) {
					console.log(error);
					return res.status(400).json({
						error: "Could not update product variable",
					});
				}
			});
		});
		next();
	} else {
		Product.bulkWrite(bulkOps2, {}, (error, products) => {
			if (error) {
				console.log(error);
				return res.status(400).json({
					error: "Could not update product variable",
				});
			}
			next();
		});
	}
};

exports.remove = (req, res) => {
	const product = req.product;

	product.remove((err, data) => {
		if (err) {
			console.log(err, "err");
			return res.status(400).json({
				err: "error while removing product",
			});
		}
		res.json({ message: "product deleted" });
	});
};

exports.increaseQtyVariables = (req, res, next) => {
	console.log(req.body.order.status, "from product yaba");

	// For Cancelled Or Fully Returned or rejected
	let habalYala = req.body.order.chosenProductQtyWithVariables.map((ii) => {
		return ii.map((iii) => iii);
	});

	// For Exchanged Stocked
	let habalYala2 = req.body.order.exchangedProductQtyWithVariables.map((ii) => {
		return ii.exchangedProduct;
	});

	// For Partially Returned Orders
	let habalYala3 = req.body.order.returnedItems.map((ii) => {
		return ii;
	});

	let bulkOps = habalYala.map((items) => {
		return items.map((item) => {
			return {
				updateOne: {
					filter: {
						_id: item.productId,
					},

					update: {
						$inc: {
							"productAttributes.$[elemX].quantity": item.OrderedQty,
						},
					},

					arrayFilters: [
						{
							"elemX.SubSKU": item.SubSKU,
						},
					],
				},
			};
		});
	});

	//For Exchanged Stock
	let bulkOps2 = habalYala2.map((item) => {
		return {
			updateOne: {
				filter: {
					_id: item.productId,
				},

				update: {
					$inc: {
						"productAttributes.$[elemX].quantity": item.OrderedQty,
					},
				},

				arrayFilters: [
					{
						"elemX.SubSKU": item.SubSKU,
					},
				],
			},
		};
	});

	//For Partial Returns
	let bulkOps3 = habalYala3.map((item) => {
		return {
			updateOne: {
				filter: {
					_id: item.productId,
				},

				update: {
					$inc: {
						"productAttributes.$[elemX].quantity": item.OrderedQty,
					},
				},

				arrayFilters: [
					{
						"elemX.SubSKU": item.SubSKU,
					},
				],
			},
		};
	});

	if (
		req.body.order.status === "Cancelled" ||
		req.body.order.status === "Returned and Not Refunded" ||
		req.body.order.status === "Rejected Order | Received"
	) {
		if (bulkOps.length > 1) {
			bulkOps.map((item, i) => {
				Product.bulkWrite(bulkOps[i], {}, (error, products) => {
					if (error) {
						console.log(error);
						return res.status(400).json({
							error: "Could not update product variable",
						});
					}
				});
			});
			next();
		} else {
			Product.bulkWrite(bulkOps[0], {}, (error, products) => {
				if (error) {
					console.log(error);
					return res.status(400).json({
						error: "Could not update product variable",
					});
				}
				next();
			});
		}
	} else if (req.body.order.status === "Exchanged - Stocked") {
		Product.bulkWrite(bulkOps2, {}, (error, products) => {
			if (error) {
				return res.status(400).json({
					error: "Could not update product",
				});
			}
			next();
		});
	} else if (
		req.body.order.status === "Exchange And Return Processed And Stocked"
	) {
		Product.bulkWrite(bulkOps3, {}, (error, products) => {
			if (error) {
				return res.status(400).json({
					error: "Could not update product",
				});
			}
		});

		Product.bulkWrite(bulkOps2, {}, (error, products) => {
			if (error) {
				return res.status(400).json({
					error: "Could not update product",
				});
			}
			next();
		});
	} else if (req.body.order.status === "Returned and Not Refunded (Partial)") {
		Product.bulkWrite(bulkOps3, {}, (error, products) => {
			if (error) {
				return res.status(400).json({
					error: "Could not update product",
				});
			}
			next();
		});
	} else {
		next();
	}
};

exports.exchangeProductUpate = (req, res, next) => {
	let habalYala = req.body.order.exchangedProductQtyWithVariables.map((ii) => {
		return ii;
	});

	let bulkOps = habalYala.map((item) => {
		return {
			updateOne: {
				filter: {
					_id: item.productId,
				},

				update: {
					$inc: {
						"productAttributes.$[elemX].quantity":
							item.quantity <= 0
								? 0
								: item.quantity <= item.OrderedQty
									? 0
									: -item.OrderedQty,
					},
				},

				arrayFilters: [
					{
						"elemX.SubSKU": item.SubSKU,
					},
				],
			},
		};
	});

	Product.bulkWrite(bulkOps, {}, (error, products) => {
		if (error) {
			return res.status(400).json({
				error: "Could not update product",
			});
		}
		next();
	});
};

exports.exchangeRevert = (req, res, next) => {
	let habalYala = req.body.order.exchangedProductQtyWithVariables.map((ii) => {
		return ii;
	});

	let bulkOps2 = habalYala.map((item) => {
		return {
			updateOne: {
				filter: {
					_id: item.productId,
				},

				update: {
					$inc: {
						"productAttributes.$[elemX].quantity": item.OrderedQty,
					},
				},

				arrayFilters: [
					{
						"elemX.SubSKU": item.SubSKU,
					},
				],
			},
		};
	});

	Product.bulkWrite(bulkOps2, {}, (error, products) => {
		if (error) {
			return res.status(400).json({
				error: "Could not update product",
			});
		}
		next();
	});
};

exports.getProductsList = async (req, res) => {
	const { page, records, filters } = req.params;
	const pageSize = parseInt(records);
	let skip = (parseInt(page) - 1) * pageSize;

	let query = { activeProduct: true };
	let sort = {};

	// Adjust the query based on the filter
	if (filters === "newarrival") {
		sort = { createdAt: -1 };
	} else if (filters === "featured") {
		query.featuredProduct = true;
	} else if (filters === "mostliked") {
		sort = { "likes.length": -1 };
	} else if (
		filters === "birthday" ||
		filters === "accessories" ||
		filters === "fashion"
	) {
		query.$or = [
			{ "category.categoryName": { $regex: filters, $options: "i" } },
			{ "subcategory.SubcategoryName": { $regex: filters, $options: "i" } },
			{ "parent.parentName": { $regex: filters, $options: "i" } },
		];
	}

	try {
		const products = await Product.find(query)
			.populate("category")
			.populate("subcategory")
			.populate("gender")
			.populate("belongsTo")
			.populate("addedByEmployee")
			.populate("updatedByEmployee")
			.sort(sort);

		// Function to get distinct colors for newarrival
		const getDistinctColors = (productAttributes) => {
			const unique = [];
			const map = new Map();
			for (const item of productAttributes) {
				if (!map.has(item.color)) {
					map.set(item.color, true); // set any value to Map
					unique.push(item);
				}
			}
			return unique;
		};

		// Expand products based on attributes
		let expandedProducts = [];
		products.forEach((product) => {
			if (product.addVariables && product.productAttributes.length > 0) {
				let attributesToExpand = product.productAttributes;

				// If newarrival, only use distinct colors
				if (filters === "newarrival" || filters === undefined) {
					attributesToExpand = getDistinctColors(product.productAttributes);
				}

				attributesToExpand.forEach((attribute) => {
					expandedProducts.push({
						...product.toObject(),
						productAttributes: attribute,
					});
				});
			} else {
				expandedProducts.push(product);
			}
		});

		// Apply pagination after expansion
		const paginatedProducts = expandedProducts.slice(skip, skip + pageSize);

		res.json({
			success: true,
			data: paginatedProducts,
			message: "Products fetched successfully",
			total: expandedProducts.length, // Total number of products after expansion
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "An error occurred while fetching products",
			error: error.message,
		});
	}
};
