const http = require("http");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./src/config/dbConnection");
const path = require("path");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**admin route */
const adminRoutes = require("./src/routes/admin");
app.use(adminRoutes);

/*App route */
const userRoute = require("./src/routes/app");
app.use(userRoute);

/** database connection  */
connectDB();

/**UPLOAD FILE */
app.use(express.static(path.join(__dirname, "./Api/src/public/")));
app.use(
  "/Images",
  express.static(path.join(__dirname, "./src/public/adminImages"))
);
app.use(
  "/public/languagesFiles",
  express.static(path.join(__dirname, "./src/public/languagesFiles"))
);

/**create server */
const server = http.createServer(app);
server.listen(process.env.PORT, () => {
  // server.timeout = 600000;
  console.log(" Server listning port number", +process.env.PORT);
});
