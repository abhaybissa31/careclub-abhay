const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    sender_id:{
        type:String
    },
    receiver_id:{
        type:String
    },
    msg:{
        type:String,
        required:True
    }
},{timestamps:true})

const chatSchemaModel=mongoose.model('chatSchemaModel',chatSchema)
module.exports=chatSchemaModel;