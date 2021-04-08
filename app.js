const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const codeRunnerRouter = require("./routes/compile");
const templatesRouter = require("./routes/templates");
const shareLinkRouter = require("./routes/codelink");
const savedCodesRouter = require("./routes/savedCodes");

const app = express();

const client = mongoose.connect(process.env.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

client
  .then((db) => {
    console.log("Connected to the database");
    console.log(process.env.jwtSecret);
  })
  .catch((err) => console.log(err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use(passport.initialize());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/compile", codeRunnerRouter);
app.use("/share", shareLinkRouter);
app.use("/savedCodes", savedCodesRouter);
app.use("/users/templates", templatesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
