
var express = require('express');
var mySQLDAO = require('./mySQLDAO');
var mongoDAO = require('./mongoDAO');
var bodyParser = require('body-parser');
const { validationResult, check } = require('express-validator');


var app = express()


app.set('view engine', 'ejs')


app.use(bodyParser.urlencoded({
    extended: false
})); 


app.get('/', (req, res) => {
    
    res.send("<a href='/listCountries'>List Countries</a> </br> <a href='/listCities'>List Cities</a> </br> <a href='/listHeadsOfState'>List Heads of State</a>")
}) 


app.get('/listCountries', (req, res) => {
    
    mySQLDAO.getCountries()
        .then((result) => {
            res.render('listCountries', { countries: result })
        }) 
        .catch((error) => {
            res.send(error)
        }) 
}) 


app.get('/edit/:co_code', (req, res) => {
    
    mySQLDAO.getCountry(req.params.co_code)
        .then((result) => {
            res.render('updateCountries', { countries: result })
        }) 
        .catch((error) => {
            res.send(error)
        }) 
}) 


app.post('/edit', (req, res) => {
    
    var tempVar = req.body.co_name;
    
    if (tempVar.length <= 0) {
        
        res.send("<h1>Name Cannot Be Empty!</h1><br><a href='/'>Home</a>")
    } else {
        
        mySQLDAO.updateCountry(req.body.co_code, req.body.co_name, req.body.co_details)
            .then((result) => {
                res.redirect("/listCountries")
            }) 
            .catch((error) => {
                res.send(error)
            }) 
    } 
}) 


app.get('/addCountry', (req, res) =>{
    res.render("addCountry", {errors:undefined})
}) 


app.post('/addCountry', 
    
    [check('co_code').isLength({min:1, max: 3}).withMessage("Country Code must be 3 characters!"),
        
        check('co_name').isLength({min:3}).withMessage("Country Name must be at least 3 characters!"),
        
        check('co_code')
        .exists()
        .custom(async co_code => {
            
            const value = await mySQLDAO.isCountryCodeUsed(co_code);
            if (value) {
                
                throw new Error('ERROR: ' + co_code + ' already exists in the database!')
            } 
        }) 
     .withMessage('ERROR: Country already exists in the database!')
    ], 
    (req,res) => {
        
        var errors = validationResult(req)
        
        if(!errors.isEmpty()) {
            res.render("addCountry", {errors:errors.errors})
            
            console.log("ERROR: Adding new country was not successful!")
        } else { 
            mySQLDAO.addCountry(req.body.co_code, req.body.co_name, req.body.co_details)
            res.redirect("/listCountries")
        } 
}) 


app.get('/delete/:country', (req, res) => {
    
    mySQLDAO.deleteCountry(req.params.country)
        .then((result) => {
            
            if (result.affectedRows == 0) {
                res.send("<h4>Country: " + req.params.country + " doesn't exist!</h4></br><a href='/'>Home</a>")
            } else {
                
                res.send("<h4>Country: " + req.params.country + " deleted!</h4></br><a href='/'>Home</a>")
            } 
        }) 
        .catch((error) => {
            
            res.send("<h1>Error Message</h1> <br><br> <h2>" + req.params.country + " has cities, it cannot be deleted.</h2></br><a href='/'>Home</a>")
        }) 
}) 


app.get('/listCities', (req, res) => {
    
    mySQLDAO.getCities()
        .then((result) => {
            res.render('listCities', { cities: result })
        }) 
        .catch((error) => {
            res.send(error)
        }) 
}) 


app.get('/cityDetails/:cty_code', (req, res) => {
    
    mySQLDAO.getAllCityDetails(req.params.cty_code)
        .then((result) => {
            res.render('allCityDetails', { cities: result })
        }) 
        .catch((error) => {
            res.send(error)
        }) 
}) 


app.get('/listHeadsOfState', (req, res) => {
    
    mongoDAO.getHeadsOfState()
        .then((documents) => {
            res.render('listHeadsOfState', { headsOfState: documents })
        }) 
        .catch((error) => {
            res.send(error)
        }) 
}) 


app.get('/addHeadOfState', (req, res) => {
    res.render("addHeadOfState")
}) 


app.post('/addHeadOfState', (req, res) => {
    
    mongoDAO.addHeadOfState(req.body._id, req.body.headOfState)
        .then((result) => {
            res.redirect('/listHeadsOfState')
        }) 
        .catch((error) => {
            res.send(error)
        }) 
}) 


app.listen(3000, () => {
    console.log("Listening on Port 3000")
}) 
