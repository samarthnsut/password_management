const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/passwordManagement_db');

var db = mongoose.connection;

db.on('error',console.error.bind("error in connecting to db"));

db.once('open',function(){
    console.log("database connection successful");
})

