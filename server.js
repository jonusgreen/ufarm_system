// DEPENDENCIES
const express = require("express");
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const Registration = require('./models/Reg');
const expressSession = require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
});
const env = require('dotenv');
const port = process.env.PORT || 4000;

// DATABASE CONNECTION
mongoose.connect("mongodb+srv://jonusashaba:blGnGdsyGvIbsw0f@cluster0.kj6tzlh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

// EXPRESS APP CONFIGURATION
const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/uploads', express.static(path.join(__dirname, '/public/uploads')));
app.use(expressSession);
app.use(express.static('/public/images/'));

// PASSPORT CONFIGURATION
app.use(passport.initialize());
app.use(passport.session());
passport.use(Registration.createStrategy());
passport.serializeUser(Registration.serializeUser());
passport.deserializeUser(Registration.deserializeUser());

// ROUTES
const aoRoutes = require('./routes/aoRoutes');
const ufRoutes = require('./routes/ufRoutes');
const foRoutes = require('./routes/foRoutes');
const authRoutes = require('./routes/authRoutes');
const produceRoutes = require('./routes/produceRoutes');

app.use('/', ufRoutes);
app.use('/', aoRoutes);
app.use('/', foRoutes);
app.use('/', authRoutes);
app.use('/', produceRoutes);

// 404 Route
app.get("*", (req, res) => {
    res.send("404! This is an invalid URL.");
});

// BOOTSTRAPPING SERVER
app.listen(port, () => console.log(`Server is running on port ${port}`));
