const express = require("express");

require("dotenv").config();

const app = express();

// database
const connectDB = require("./db/connect");

// routers
const orderRouter = require("./routes/orderRoutes");
const vendorController = require("./routes/vendorRoutes");
const productController = require("./routes/productController");

app.use(express.json());

app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/vendors", vendorController);
app.use("/api/v1/products", productController);

const port = process.env.PORT || 3001;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}...`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
