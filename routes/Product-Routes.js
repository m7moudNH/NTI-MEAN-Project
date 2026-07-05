const express = require("express");
const ProductsControllers = require("../controllers/Products-Controllers");

const router = express.Router();

router
	.route("/")
	.get(ProductsControllers.getAllProducts)
	.post(ProductsControllers.createProduct);

router
	.route("/:id")
	.get(ProductsControllers.getProductById)
	.delete(ProductsControllers.deleteProductById)
	.patch(ProductsControllers.updateProductById);

module.exports = router;
