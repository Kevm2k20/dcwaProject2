
const MongoClient = require('mongodb').MongoClient;


const url = 'mongodb'


const dbName = 'headsOfStateDB'


const collName = 'headsOfState'


var headsOfStateDB
var headsOfState


MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((client) => {
        headsOfStateDB = client.db(dbName)
        headsOfState = headsOfStateDB.collection(collName)
    }) 
    .catch((error) => {
        console.log(error)
    }) 
   

var getHeadsOfState = function() {
    return new Promise((resolve, reject) => {
        
        var cursor = headsOfState.find()
        
        cursor.toArray()
            .then((documents) => {
                resolve(documents)
            }) 
            .catch((error) => {
                reject(error)
            }) 
    }) 
} 


var addHeadOfState = function(_id, headOfState) {
    
    return new Promise((resolve, reject) => {
        
        headsOfState.insertOne({"_id":_id, "headOfState":headOfState})
            .then((result) => {
                resolve(result)
            }) 
            .catch((error) => {
                reject(error)
            }) 
    }) 
} 


module.exports = { getHeadsOfState, addHeadOfState }