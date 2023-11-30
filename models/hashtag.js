const mongoose=require('mongoose');
const Sc=mongoose.Schema({
    hashtags: [{tag:String, count:Number}]
})


const Model=mongoose.model('hashtags',Sc)
module.exports=Model