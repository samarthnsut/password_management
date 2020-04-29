const mongoose = require('mongoose')

const elementSchema= new mongoose.Schema({
    title :{
        type:String,
        required: true
    },
    pass : {
        type : String,
        required : true
    },
    account :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Account'
    }

},{
      timestamps: true
})
const Element=mongoose.model('Element',elementSchema);
module.exports= Element;