const express = require("express");
const router = express.Router();

//when going to homepage it will run req and res functions
router.get("/", (req, res) => {
    if(req.session.loggedin){
        res.render("index" , {
            login: true,
            nombre: req.session.nombre
        });
    } else{
        res.render("index" , {
            login: false,
            nombre: "Account"
        });
    }
});

router.get("/account", (req, res) => {
    if(req.session.loggedin){
        res.render("account" , {
            login: true,
            nombre: req.session.nombre
            
        });
    } else{
        res.render("account" , {
            login: false,
            nombre: "Account"
        });
    }
});
router.get("/logout", (req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/')
    })
})
router.get("/cart", (req, res) => {
    if(req.session.loggedin){
        res.render("cart" , {
            login: true,
            nombre: req.session.nombre
        });
    } else{
        res.render("cart" , {
            login: false,
            nombre: "Account"
        });
    } 
});
router.get("/product-details", (req, res) => {
    if(req.session.loggedin){
        res.render("product-details" , {
            login: true,
            nombre: req.session.nombre
        });
    } else{
        res.render("product-details" , {
            login: false,
            nombre: "Account"
        });
    }
});
router.get("/products", (req, res) => {
    if(req.session.loggedin){
        res.render("products" , {
            login: true,
            nombre: req.session.nombre
        });
    } else{
        res.render("products" , {
            login: false,
            nombre: "Account"
        });
    }
});


module.exports = router;