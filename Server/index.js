const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
dotenv.config({ path: "./config/config.env" });
const { ConnectionDB } = require("./Connection");

ConnectionDB(process.env.DB_url).then(() => {
  console.log("MongoDb Connected");
});

const User = require("./routes/user");
const Listing = require("./routes/listing");
const errorMiddleware = require("./middleware/error");

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "real-estate-project-six-eosin.vercel.app",
    credentials: true,
  }),
);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Routes
app.use("/api", User);
app.use("/api", Listing);

// Error middleware
app.use(errorMiddleware);

const server = app.listen(process.env.PORT || 8000, () => {
  console.log(`Server Started at Port: ${process.env.PORT || 8000}`);
});
