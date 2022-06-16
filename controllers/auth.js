const mysql = require("mysql");
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs");
const async = require("hbs/lib/async");


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
//host, user and password depend on xampp
});

exports.register = (req, res) => {
    console.log("registering\n",req.body);
    if (req.body.email !== '' && req.body.username !== '' && req.body.password !== '' && req.body.cPassword !== '') {
        const {username, email, password, cPassword} = req.body;
        db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
            if(error) {
                console.log(error);
            }
            if(results.length > 0) {
                return res.render('account', {
                    message: 'Ese correo ya ha sido registrado'
                });
            } else if(password !== cPassword) {
                return res.render('account', {
                    message: 'Las contraseñas no concuerdan'
                });
            }
            
            let hashedPassword = await bcrypt.hash(password, 8);
            //console.log(hashedPassword);

            db.query('INSERT INTO users SET ?', {name: username, email: email, password: hashedPassword}, (error, results) => {
                if(error) {
                    console.log(error);
                } else {
                    //saving user's name into the session
                    req.session.loggedin = true;
                    req.session.nombre = req.body.username
                    console.log("session name\n", req.session.nombre);
                    res.render('account', {
                        alert: true,
                        alertTitle: "Registrado",
                        alertMessage: "Registracion exitosa!",
                        alertIcon: "success",
                        showConfirmButton:false,
                        timer: 2500,
                        route: ''
                    })
                }
            })
        });
    } else {
        return res.render('account', {
            message: 'Por favor ingresa todos los datos para registrar'
        });
    }
   
}

exports.login = async(req, res) => {
    if (req.body.email != '' && req.body.password != '') {
        const {email, password} = req.body;
        let passwordHash = await bcrypt.hash(password, 8);
        if(email && password) {
            db.query('SELECT * FROM users WHERE email = ?', [email], async(error, results) => {
                if(error) {
                console.log(error);
                }  
                // console.log("loging conditional\n", results);
                if(results.length == 0 || !(await bcrypt.compare(password, results[0].password))) {
                    // return res.render('account', {
                    //     message: 'Usuario y/o clave incorrectas'
                    // });
                    res.render('account', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o clave incorrectas",
                        alertIcon: "error",
                        showConfirmButton: true,
                        timer: 2500,
                        route: 'account'
                    })
                } else{
                    req.session.loggedin = true;
                    req.session.nombre = results[0].name
                    db.query('SELECT * FROM carts WHERE email = ?', [email], async(error, results) => {
                        if(error) {
                        console.log(error);
                        }
                        req.session.cart = results;
                        console.log(req.session.cart);
                        db.query("SELECT COUNT(*) as anyVariableName from INFORMATION_SCHEMA.COLUMNS WHERE table_schema = ’login_srmatequilla’ and table_name = ’carts’", async(error, result) => {
                            if(error) {
                                console.log(error);
                                }
                                
                            console.log(result);
                        })
                    })
                    console.log("session name\n", req.session.nombre, req.session.loggedin);
                    res.render('account', {
                        alert: true,
                        alertTitle: "Has ingresado",
                        alertMessage: "Has ingresado exitosamente!",
                        alertIcon: "success",
                        showConfirmButton:false,
                        timer: 2500,
                        route: ''
                    })
                }
            });
        }
    } else {
        return res.render('account', {
            message: 'Por favor ingresa todos los datos para ingresar'
        });
    }
}
