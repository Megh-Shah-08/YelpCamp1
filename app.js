const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const port = 3001;
const connectToMongo = require("./db");
const methodOverride = require("method-override");
const campgroundRoutes = require('./routes/campgrounds.js')
const reviewRoutes = require('./routes/reviews.js');
const userRoutes = require('./routes/user.js');
const catchAsync = require('./utils/catchAsync.js');
const ExpressError = require("./utils/ExpressError");
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require("./model/user.js");
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require("connect-mongo");

// if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
// }
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static('public'))
app.engine("ejs", ejsMate);
connectToMongo();

const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URI, // Updated from `url` to `mongoUrl`
  touchAfter: 24 * 60 * 60, // Prevents session refresh within 24 hours
  crypto: {
    secret: process.env.SECRET || "a_secure_long_random_secret", // Secure secret
  },
});

store.on("error", function (e) {
  console.error("Session Store Error:", e);
});

const sessionConfig = {
  store: store,
  name: "sample", // Custom session cookie name
  secret: process.env.SECRET || "a_secure_long_random_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, // Prevents client-side script access
    secure: process.env.NODE_ENV === "production", // Only use secure cookies in production
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7-day expiry
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
};

app.use(mongoSanitize());
app.use(session(sessionConfig))
app.use(flash());
app.use(helmet());


const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com", // Bootstrap scripts
  "https://kit.fontawesome.com", // FontAwesome
  "https://cdnjs.cloudflare.com", // General CDN
  "https://cdn.jsdelivr.net", // General CDN
  "https://unpkg.com", // MapLibre scripts
  "https://cdn.maptiler.com", // MapTiler scripts
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com", // FontAwesome styles
  "https://stackpath.bootstrapcdn.com", // Bootstrap styles
  "https://fonts.googleapis.com", // Google Fonts
  "https://use.fontawesome.com", // FontAwesome styles
  "https://cdn.jsdelivr.net", // General CDN styles
  "https://unpkg.com", // MapLibre styles
  "https://cdn.maptiler.com", // MapTiler styles
];
const connectSrcUrls = [
  "'self'", // Internal connections
  "https://api.maptiler.com", // MapTiler API
  "https://res.cloudinary.com/", // Cloudinary
  "https://images.unsplash.com", // Unsplash API
];
const fontSrcUrls = [
  "'self'", // Local fonts
  "https://fonts.gstatic.com", // Google Fonts
];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Default: only self
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls], // Allowed script sources
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls], // Allowed inline and external styles
      styleSrcElem: ["'self'", "'unsafe-inline'", ...styleSrcUrls], // Element-specific styles
      connectSrc: ["'self'", ...connectSrcUrls], // Allowed API and CDN connections
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://api.maptiler.com/resources/logo.svg",
        "https://res.cloudinary.com/", // Cloudinary images
        "https://images.unsplash.com", // Unsplash images
      ],
      fontSrc: ["'self'", ...fontSrcUrls], // Allowed font sources
      workerSrc: ["'self'", "blob:"], // Worker sources
      childSrc: ["blob:"], // Child frame sources
      objectSrc: ["'none'"], // Disallow <object>, <embed>, <applet>
    },
  })
);





app.use(passport.initialize());
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

//HOME ROUTE
app.get("/", (req, res) => {
  res.render("home");
});

app.all(
  "*",
  catchAsync((req, res, next) => {
    next(new ExpressError("Page not found!", 404));
  })
);

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(port, () => {
  console.log(`App Listening at ${port}!`);
});
