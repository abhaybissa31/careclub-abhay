const mongoose=require('mongoose');

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    user_profile_image:{type:String,required:false},
    user_name:{type:String,required:true},
    event_profile_image:{type:String,required:false},
    
});

const Sc=mongoose.Schema({
    e_name:{type:String,required:true},
    e_desc:{type:String,default:null},
    e_location:{type:String,required:true},
    e_city:{type:String,required:true},
    
    //written by abhishek start
    e_likes:[{type:mongoose.Schema.ObjectId,default:0,ref:'userData'}],
    e_comments:[commentSchema],
    e_likes_count:{type:Number,default:0},
    e_comments_count:{type:Number,default:0} , 
    //written by abhishek end 
    
    e_date:{type:Date ,required:true},
    e_image:{type:String,required:true},
    e_time:{type:Number,required:true},
    e_timezone:{type:String,required:true},
    e_org_id:{type:mongoose.Schema.ObjectId,required:true} ,
    e_org_name:{type:String,required:true} ,

    e_org_image:{type:String,required:false} ,  //abhishek  e_org_image:{type:String,required:true}
    e_org_contact:{type:Number,required:false}, // abhishek e_org_contact:{type:Number,required:true}
    
    e_hashtags:{type:Object,required:true},
    e_joinies:[{type:mongoose.Schema.ObjectId,default:null,ref:'userData'}]
})
const Model=mongoose.model('event',Sc)
module.exports=Model