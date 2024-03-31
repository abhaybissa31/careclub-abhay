 const eventData=require('../models/event');
const trendData=require('../models/hashtag');
const userData = require('../models/userData');

const getTrendFile=async(req,res)=>{
    let events=await eventData.find();
    let trend = await trendData.find();
    var temp = []
    for (let index = 1; index < trend[0].hashtags.length; index++) {
        const element = trend[0].hashtags[index];
        temp.push(element); 
    }

    temp.sort((a, b) => b.count - a.count);
    let result1=await userData.findOne({_id:req.session.user._id});
    let result2=await eventData.find({e_city:result1.u_city});
    // eventcreated start here 
    let Number_of_event_created = await eventData.find({e_org_id:result1._id});
    let no_event = Number_of_event_created.length;
    // eventcreated end here 

    //joined event start here 
    let joinedEvents = result2.filter(event => event.e_joinies.includes(result1._id));
    let no_joined_event = joinedEvents.length;
    //joined event end here

    req.flash("sucess","events fetched") 
    res.render("Trending",{
        msg:req.flash(),
        trending_element:temp,
        profile: result1,
        no_event:no_event,
        no_join_event:no_joined_event,
    });
   
}

const showTrendingHashtag=async(req,res,next)=>{
    console.log("function------------runing")
    let events=await eventData.find();
    let result=await trendData.find();
    var hashtag=result;
    // console.log(events,result)
    
    console.log("___________")
    events.forEach(async (element) => {
    console.log(hashtag)
        let a =element.e_hashtags
        for(let j=0;j<a.length;j++){
            for(let i=0;i<hashtag.length;i++){
   
                if(hashtag[i].tag == a[j]){
                    hashtag[i].count+=1;
                }
               
            }
        }
        var b=[]
a.forEach(element => {
    b[element]=false
});

for(let j=0;j<a.length;j++){

    for(let i=0;i<hashtag.length;i++){
        
        if(hashtag[i].tag == a[j]){
           b[a[j]]=true; 
        }       
    }
}

Object.keys(b).forEach(async(element) => {
if(b[element] == false){
     hashtag.push({
        tag:element,
        count:1
     })
    
}

});

let data=await trendData.find();
console.log("-------------------------------------------------")
console.log(data)
await trendData.replaceOne({_id:data[0]._id},{hashtags:hashtag}).then((result) =>{
  console.log("data updated")

}).catch(function (err) {
console.log(err)
req.flash("error",err);
// res.send(err);


})

        
});

next();
   
    }
    const testadd=async(req,res)=>{
        let tag=new trendData(
            {

                hashtags:[{tag:"ind",count:0}]
            }
        )
    tag.save().then((result)=>{
            
       console.log("trends calculated successfully")
        
    }).catch((err)=>{
        console.log(err);
        req.flash("error","Can Not Get Trending Events")
        res.render("event",{msg:req.flash(),events:null})    
    })   
}
const test1=(req,res)=>{
res.send("okay ")
}
const mid=(req,res,next)=>{
    console.log(("middleware on duty"))
    next()    
}
module.exports = {
    getTrendFile,
    showTrendingHashtag,
    testadd,
    test1,
    mid
};
