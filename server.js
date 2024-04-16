
//DEPENDENCIES    ---------------/
const express = require("express"); //Always the first line of code
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config/db');
const passport = require('passport');
const env = require('dotenv')
const port = process.env.PORT || 4000

//Defining Express session------------/
const expressSession = require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,  
});

//Import the user model--------------/
const Registration = require('./models/Reg');


//Importing route files----------------/
const aoRoutes = require('./routes/aoRoutes');
const ufRoutes = require('./routes/ufRoutes');
const foRoutes = require('./routes/foRoutes');
const authRoutes = require('./routes/authRoutes');
const produceRoutes = require('./routes/produceRoutes'); 


//INSNTANTIATIONS---------------------/
const app = express();

// Setting up database connections
// mongoose.connect(config.database,{ useNewUrlParser: true });
// const db = mongoose.connection;


mongoose.connect("mongodb+srv://jonusashaba:blGnGdsyGvIbsw0f@cluster0.kj6tzlh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=> {console.log("connected to mongodb");
})
.catch((err)=>{
  console.log(err);
})

// // Check connection-------------------/
// db.once('open', function(){
//   console.log('Connected to MongoDB');
// });

// Check for db errors
// db.on('error', function(err){
//   console.error(err);
// });

//CONFIGURATIONS ------------------------/
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

//MIDDLEWARE  --------------------------/
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(expressSession);
app.use(express.static('/public/images/'))

/*....Passport configuration middleware...*/
app.use(passport.initialize());
app.use(passport.session());
passport.use(Registration.createStrategy());
passport.serializeUser(Registration.serializeUser());
passport.deserializeUser(Registration.deserializeUser())


//ROUTES---------------------------------/
app.use('/', ufRoutes);
app.use('/', aoRoutes);
app.use('/', foRoutes);
app.use('/', authRoutes);
app.use('/', produceRoutes);


// For invalid routes. always the last route in the server file(index.js)
app.get("*", (req, res) => {
	res.send("404! This is an invalid URL.");
});

// Bootstrapping Server always the last line of code in the server file(index.js).
app.listen(port, () => console.log(`We are listening on port ${port}`));