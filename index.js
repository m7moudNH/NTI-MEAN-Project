const express = require("express");
const dbConnect = require("./config/db-connect");
const productRouter = require("./routes/product-routes");
const userRouter = require("./routes/user-routes");
const authRouter = require("./routes/auth-routes");
const cartRouter = require("./routes/cart-routes");
const orderRouter = require("./routes/order-routes");

require("dotenv").config();
dbConnect();
const app = express();
app.use(express.json());

app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);

app.listen(process.env.PORT, () => {
	console.log(`server running on port ${process.env.PORT}`);
});
