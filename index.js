const express = require("express");
const dbConnect = require("./config/db-connect");
const productRouter = require("./routes/Product-Routes");

require("dotenv").config();
dbConnect();
const app = express();
app.use(express.json());

app.use("/api/v1/products", productRouter);

app.listen(process.env.PORT, () => {
	console.log(`server running on port ${process.env.PORT}`);
});
