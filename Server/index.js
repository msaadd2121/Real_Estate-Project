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

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/api", User);
app.use("/api", Listing);

app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server Startd at Port :${process.env.PORT}`);
});
