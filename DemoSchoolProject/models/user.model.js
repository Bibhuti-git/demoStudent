const mongoose = require ('mongoose');

const schoolData = new mongoose.Schema({
    fName:{
        required: true,
        type: String
    },
    lName:{
        required: true,
        type: String
    },
    email:{
        required: true,
        type: String
    },
    role:{
        required: true,
        type: String
    },
    password:{
        required: true,
        type: String
    }

})

 module.exports= mongoose.model('data', schoolData)