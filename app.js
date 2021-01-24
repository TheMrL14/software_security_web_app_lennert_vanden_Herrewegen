//Modules
const express = require("express");
const cors = require("cors");
const path = require("path");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const Auth = require("./connection/Auth");

//IN DEVELOPMENT : Get ENV vars
const dotenv = require("dotenv");
dotenv.config();

//ROUTES
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const reviewsRouter = require("./routes/review");
const apiRouter = require("./routes/apikey");

// start app

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(helmet());

const corsOptions = {
  //origin: "http://localhost:9000",
  origin: "https://www.lennertvh.xyz",
  methods: "GET,HEAD,POST,OPTIONS,DELETE",
  allowedHeaders: "",
  exposedHeaders: ["Content-Type", "application/json"],
};

// SET CORS HEADERS
app.use(cors(corsOptions));

//Authentication

app.use("/users", Auth.checkJwt, usersRouter);

//configure routes
app.use("/", indexRouter);
app.use("/api", apiRouter);
app.use("/users", Auth.checkJwt, usersRouter);
app.use("/reviews", reviewsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

module.exports = app;
