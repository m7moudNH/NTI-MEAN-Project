const express = require("express");
const ProductsControllers = require("../controllers/product-controllers");
const upload = require("../middlewares/multer-middleware");
const authenticationMiddleware = require("../middlewares/authentication-middleware");
const authorizationMiddleware = require("../middlewares/authorization-middleware");

const router = express.Router();

router
	.route("/")
	.get(ProductsControllers.getAllProducts)
	.post(
		authenticationMiddleware,
		authorizationMiddleware("admin"),
		upload.single("imageUrl"),
		ProductsControllers.createProduct,
	);

router
	.route("/:id")
	.get(ProductsControllers.getProductById)
	.patch(
		authenticationMiddleware,
		authorizationMiddleware("admin"),
		upload.single("imageUrl"),
		ProductsControllers.updateProductById,
	)
	.delete(
		authenticationMiddleware,
		authorizationMiddleware("admin"),
		ProductsControllers.deleteProductById,
	);

module.exports = router;
