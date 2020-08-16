const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const passport = require('passport');
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);



const connectDB = require("./config/db");

//Load Config
dotenv.config({ path: "./config/config.env" });

// Passport Config
require('./config/passport')(passport);

connectDB();
const app = express();

//cors setup
const cors = require('cors');
app.use(cors());

//Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

//Logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }


// Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}))  

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


//routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/products", require('./routes/products'));





const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
  );