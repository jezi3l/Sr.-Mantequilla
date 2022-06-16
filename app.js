//importing tools
const express = require("express");
const path = require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');



//configuring .env file location
dotenv.config({path: './.env'})

//starting express and creating database connection
const app = express();
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
//host, user and password depend on xampp
});

//setting hbs as default html view engine
app.set('view engine', 'hbs');

//__dirname is a variabla from nodejs for access to current directory
//setting publicderectory path
const publicDirectory = path.join(__dirname, './public')
//make express use public directory
app.use(express.static(publicDirectory));

//Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
//Parse JSON bodies (as sent by API clients)
app.use(express.json());
//7- variables de session
const session = require('express-session');
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

db.connect((error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("MYSQL Connected...")
    }
})

//Define routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
//tell express what port to listen from
app.listen(5000, () => {
    console.log("server started on Port 5000");
});