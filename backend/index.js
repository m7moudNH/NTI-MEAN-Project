const express = require("express");
const cors = require("cors");
const dbConnect = require("./config/db-connect");
const productRouter = require("./routes/product-routes");
const userRouter = require("./routes/user-routes");
const authRouter = require("./routes/auth-routes");
const cartRouter = require("./routes/cart-routes");
const orderRouter = require("./routes/order-routes");

require("dotenv").config();
dbConnect();
const app = express();
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(express.json());

app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);

app.listen(process.env.PORT, () => {
	console.log(`server running on port ${process.env.PORT}`);
});
