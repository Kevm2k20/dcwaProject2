
var mysql = require('promise-mysql');


var pool


mysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'geography'
})
    .then((result) => {
        pool = result
    })
    .catch((error) => {
        console.log(error)
    });


var getCountries = function () {

    return new Promise((resolve, reject) => {
        pool.query('select * from country')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


var getCountry = function (co_code) {

    return new Promise((resolve, reject) => {

        var myQuery = {
            sql: 'select * from country where co_code = ?',
            values: [co_code]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


var deleteCountry = function (co_code) {

    return new Promise((resolve, reject) => {

        var myQuery = {
            sql: 'delete from country where co_code = ?',
            values: [co_code]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


var updateCountry = function (co_code, co_name, co_details) {

    return new Promise((resolve, reject) => {

        var myQuery = {
            sql: 'update country set co_name=?, co_details=? where co_code=?',
            values: [co_name, co_details, co_code]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


var addCountry = function (co_code, co_name, co_details) {

    return new Promise((resolve, reject) => {

        var myQuery = {
            sql: 'insert into country values (?, ?, ?)',
            values: [co_code, co_name, co_details]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


var isCountryCodeUsed = function (co_code) {

    return new Promise((resolve, reject) => {
        pool.query('select count(*) as total from country where co_code = ?',
            [co_code], function (error, result, fields) {

                if (!error) {

                    return resolve(result[0].total > 0);
                } else {

                    return reject(new Error('ERROR'));
                }
            });
    })
}


var getCities = function () {

    return new Promise((resolve, reject) => {
        pool.query('select * from city')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


var getAllCityDetails = function (cty_code) {

    return new Promise((resolve, reject) => {

        var myQuery = {

            sql: 'SELECT * FROM city LEFT JOIN country ON city.co_code = country.co_code WHERE cty_code = ?',
            values: [cty_code]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


module.exports = { getCountries, getCountry, deleteCountry, updateCountry, addCountry, isCountryCodeUsed, getCities, getAllCityDetails }