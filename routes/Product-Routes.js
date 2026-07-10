const express = require("express");
const ProductsControllers = require("../controllers/product-controllers");
const upload = require("../middlewares/multer-middleware");

const router = express.Router();

router
	.route("/")
	.get(ProductsControllers.getAllProducts)
	.post(upload.single("imageUrl"), ProductsControllers.createProduct);

router
	.route("/:id")
	.get(ProductsControllers.getProductById)
	.patch(upload.single("imageUrl"), ProductsControllers.updateProductById)
	.delete(ProductsControllers.deleteProductById);

module.exports = router;
