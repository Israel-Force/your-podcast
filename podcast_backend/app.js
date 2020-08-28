require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)
const passport = require('passport')
const flash = require('connect-flash')
const podcast = require("./api/routes/podcast");
const admin = require("./api/routes/admin");
const user = require("./api/routes/user");
const validator = require('express-validator')

//static files
app.use("/uploads", express.static("uploads"));

// confg morgan
app.use(morgan("dev"));

// express parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//commect to db
//process.env.MONGO_ATLAS
const dbString = "mongodb://localhost:27017/user";
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

const connection = mongoose.connect(dbString, dbOptions, function (error) {
  if (error) console.log(error);
  console.log("connection successful");
});

mongoose.Promise = global.Promise;


//confg cors
app.use(cors());


//confg bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Init express-validator
app.use(validator())


//confg session
const sessionStore = new MongoStore({ mongooseConnection: mongoose.connection, collection: 'sessions'})

app.use(session({
  secret: "mySecret",
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 2
  }
}))

//init flash
app.use(flash());

//Init passport
app.use(passport.initialize())
// app.use(passport.session())


//init passport-setup
require('./confg/passport-setup')(passport);


//handle routes
app.use("/podcast", podcast);
app.use("/admin", admin);
app.use("/user", user);

//error handling
app.use((req, res, next) => {
  const error = new Error("NOT FOUND");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message,
    },
  });
  next();
});

//listen to port
app.listen(process.env.PORT || 4000, () =>
  console.log(`we are now online on port 4000`)
);
