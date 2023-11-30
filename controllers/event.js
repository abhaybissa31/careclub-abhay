const userData = require('../models/userData');
const { getStorage, ref, uploadBytesResumable,getDownloadURL } = require("firebase/storage");
const { default: mongoose } = require("mongoose");

const getEventFile=(req,res)=>{
res.render("event",{msg:req.flash()});
}


const getAllEvent=async(req,res,eventData)=>{
    let result1=await userData.findOne({_id:req.session.user._id}) 
    
    if(result1.u_phone == null && result1.u_city == null){
        req.flash("UserDetails","number and city not found!  ")//abhishek
        return res.render("event",{msg:req.flash(),events:null})// abhishek 
    }
    else{
       
    let result2=await eventData.find({e_city:result1.u_city});
    req.flash("check","success ")
    

    // eventcreated start here 
    let Number_of_event_created = await eventData.find({e_org_id:result1._id});
    let no_event = Number_of_event_created.length;
    // eventcreated end here 

    //joined event start here 
    let joinedEvents = result2.filter(event => event.e_joinies.includes(result1._id));
    let no_joined_event = joinedEvents.length;
    //joined event end here
   console.log();

    res.render("event", {
        msg: req.flash(),
        events: result2,
        profile: result1,
        cmt: result2[0]?.e_comments || [], // Use optional chaining to handle potential undefined value
        cmtpp: result2[0]?.e_comments[0]?.event_profile_image || null, // Use optional chaining to handle potential undefined value
        no_event:no_event,
        no_join_event:no_joined_event,
        event_joines_info:[]
    });
    }
}


const createEvent=(eventData,storage)=>async(req,res)=>{
    var today = new Date();
    const {e_name,e_desc,e_location,e_city,e_date,e_time,e_timezone,e_hashtags}=req.body;
    var d=new Date(e_date)
    if(!e_name || !e_desc || !e_location || !e_city  || !e_date || !e_time || !e_timezone || !e_hashtags){
    req.flash("error","please fill all details")
    return res.render("event",{msg:req.flash()})
}
else{
 var valid =true;
 if(e_time >12 || e_time <=0){
    valid=false
    req.flash("error","Time should be in 12 hour format");
    res.render("event",{msg:req.flash()});
 }
 if(d<today){
    valid=false

    req.flash("error","Date Should Be in Future")
    res.render("event",{msg:req.flash()});

 }
 if(valid){
     const storageRef = ref(storage, `events/${+Math.floor((Math.random() * 1000) + 1)+"-"+req.file.originalname}`);
     const metaData={
         contentType:req.file.mimetype,
        };
        uploadBytesResumable(storageRef, req.file.buffer,metaData).then((snapshot) => {
      })
      const snapshot=await uploadBytesResumable(storageRef, req.file.buffer,metaData)
      const downloadurl=await getDownloadURL(snapshot.ref);

    var response=[];
    
    let tmp=req.body.e_hashtags
      toString(tmp);
      let hastags=[]
       hastags=tmp.split(',');
       
       let newEvent= new eventData({
           e_name:req.body.e_name,
           e_date:req.body.e_date,
           e_desc:req.body.e_desc,
           e_location:req.body.e_location,
           e_city:req.body.e_city,
           e_image:downloadurl,
           e_time:req.body.e_time,
           e_timezone:req.body.e_timezone,
           e_org_id:req.session.user._id,
           e_org_name:req.session.user.u_name,
           e_org_image:req.session.user.Image_URL,
           e_org_contact:req.session.user.u_phone,
           e_hashtags:hastags
        });
       
        newEvent.save().then((result)=>{
            console.log("_______________________");
            console.log(result)
            return res.redirect('/profile');
            
        }).catch((err)=>{
            
            console.log(err);
            req.flash("error","Error in creating event")
                return res.render("event",{msg:req.flash()});  
            });
        }
    }
    };
 
    const joinEvents=async(req,res,eventData)=>{
        let result1=await eventData.findOne({_id:req.params.id})
        
        // let result=await eventData.updateOne({_id:req.params.id},{$push: { e_joinies: req.session.user._id }})
var flag=false;
let check=result1.e_joinies; 
check.forEach(element => {
    if (element.equals(req.session.user._id)) {
        flag=true;
    }
    
});
if(!flag){
let result=await eventData.updateOne({_id:req.params.id},{$push: { e_joinies: req.session.user._id }})
if(result.modifiedCount == 1){
    res.redirect('/profile');
}else{
    req.flash("error","An Error Occured")
    res.redirect('/events')

}//you can even check if result is true or not
}
else{
    req.flash("error","you have  already joined")
    res.redirect('/events')
}
}
const getJoinedEventsFile=async (req,res,eventData)=>{

let result=await eventData.find({e_joinies:req.session.user._id})
if(result.length > 0){

 res.render("profile_care",{msg:req.flash(),joinedEvents:result,hello:"hello"});
}
else{
req.flash("error","You Have Not Joined Any Event")
res.render("profile_care",{msg:req.flash(),joinedEvents:null})
}
}
const organisedEvents=async(req,res,eventData)=>{
let result=await eventData.find({e_org_id:req.session.user._id})

if(result.length >0){
    res.render("profile_care",{msg:req.flash(),orgEvents:result});
}else{
    req.flash("error","You Have Not Created Any Event")
    res.render("profile_care",{msg:req.flash(),orgEvents:null})
}//you can even check if result is true or not

}



//written by abhishek start//

const likeEvent = async (req, res,eventData) => {
    const eventId = "654fb29d358138ac96e75e75";
    const userId = "654fae7f088ad3633a700f17";
    
    try {
        let result = await eventData.findById({_id:eventId});
        

        // Check if the user has already liked the event
        const userLiked = result.e_likes.includes(userId);

        if (userLiked) {
            // If the user already liked the event, remove the like
            const userIndex = result.e_likes.indexOf(userId);
            result.e_likes.splice(userIndex, 1);
            result.e_likes_count -= 1;
            await result.save();
            res.json({result});
            return console.log("User already liked this post !!");
        } else {
            // If the user has not liked the event, add the like
            result.e_likes.push(userId);
            result.e_likes_count += 1;
            await result.save();
            res.json({result});
            return console.log("User liked the post !!");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const commentEvent = async (req, res, eventData) => {
    const eventId = req.params.id;
    const userId = req.params.usrid;

    let result1=await userData.findOne({_id:userId});
    let result2 =await eventData.findOne({_id:eventId});
   
    const commentData = {
        text: req.body.commenttext,
        user_profile_image: result1.Image_URL===null? "null":result1.Image_URL,
        user_name: result1.u_name,
        event_profile_image:result2.e_image
    };
    
    try {
        const event = await eventData.findById({ _id: eventId });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Add the new comment to the event
        event.e_comments.push(commentData);

        // Update comments count
        event.e_comments_count = event.e_comments.length;

        // Save the event
        await event.save();
        req.flash("Comment","number and city not found!  ")//abhishek
        res.render("comment",{eventId:eventId});
        
    } catch (error) {
        req.flash("error","comment not found ! ")
        res.render("event",{msg:req.flash()});
    }
};
const getComment = async (req, res, eventData) => {
    try {
        const userId = req.session.user._id;
        
        // Use findOne directly to find the user
        const user = await userData.findOne({ _id: userId });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const events = await eventData.find({ e_city: user.u_city });

        const eventId = req.params.eventId;
        const event = await eventData.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        req.flash("Comment", "Number and city not found!"); // Abhishek
        
          // eventcreated start here 
        let Number_of_event_created = await eventData.find({e_org_id:user._id});
        let no_event = Number_of_event_created.length;
          // eventcreated end here 
        
          //joined event start here 
          console.log(user.id)
        let joinedEvents = events.filter(event => event.e_joinies.includes(user._id));
        let no_joined_event = joinedEvents.length;
          //joined event end here
        
        // Send the event data as a JSON response
        res.render("event", { 
        msg: req.flash(), 
        events: events,
        profile: user, 
        commentdata: event, 
        no_event:no_event,
        no_join_event:no_joined_event,
        event_joines_info:[]
    });

    } catch (error) {
        req.flash("error", "Invalid request");
        return res.render("event", { msg: req.flash() });
    }
}




    const joinedUsers=async(req,res,eventData)=>{
        try{
        let result1=await userData.findOne({_id:req.session.user._id}) 
        let result2=await eventData.find({e_city:result1.u_city});
        
        
    
        // eventcreated start here 
        let Number_of_event_created = await eventData.find({e_org_id:result1._id});
        let no_event = Number_of_event_created.length;
        // eventcreated end here 
    
        //joined event start here 
        let joinedEvents = result2.filter(event => event.e_joinies.includes(result1._id));
        let no_joined_event = joinedEvents.length;
        //joined event end here
        
       let event=await eventData.findOne({_id:req.params.id})
       let users =await userData.find({_id:{ $in : event.e_joinies }})
       console.log(users)
       if(users){
       
        req.flash("eventinfofound", "Invalid request");
        res.render("event", {
            msg: req.flash(),
            events: result2,
            profile: result1,
            cmt: result2[0]?.e_comments || [], // Use optional chaining to handle potential undefined value
            cmtpp: result2[0]?.e_comments[0]?.event_profile_image || null, // Use optional chaining to handle potential undefined value
            no_event:no_event,
            no_join_event:no_joined_event,
            event_joines_info:users,
        });
    }

    }     catch (error) {
        req.flash("error", "Invalid request");
        return res.render("event", { msg: req.flash() });
    }
      
        }
        

//written by abhishek end here//


module.exports={
    getEventFile,
    createEvent,
    getAllEvent,
    joinEvents,
    getJoinedEventsFile,
    organisedEvents,
    likeEvent,//add by abhishek
    commentEvent, // add by abhishek
    getComment, // add by abhishek
    joinedUsers
}
