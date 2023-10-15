const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();

// database
const connectDB = require("./db/connect");

const allowedOrigin = "http://localhost:3000";
const corsOptions = {
  origin: allowedOrigin,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // If needed for handling cookies
};

app.use(cors(corsOptions));

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
