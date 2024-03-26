const getDetailsFile=(req,res)=>{
// res.send("details");
console.log(req.session.user._id)
res.render("event",{msg:req.flash()});//abhishek
}
const addDetails=(userData)=>async(req,res)=>{
    const {u_city,u_phone,LIC_NO}=req.body;

    if(!u_city || !u_phone ){
        req.flash("error","Please Fill All Details")//abhishek
        res.render("event",{msg:req.flash()})//abhishek
    }else{
        console.log("your phone number and city is updated from addDetails end point")
        const city = u_city.toLowerCase();

        let result= await userData.updateOne({ _id: req.session.user._id }, { $set: { u_city:city,u_phone:req.body.u_phone,LIC_NO:req.body.LIC_NO} })
       
        if(result.modifiedCount == 1){
            req.flash("success","profile is updated")
            console.log("--------------------------1")
      
    res.render('event',{msg:req.flash()}) //Abhishek res.render("AllEvents",{msg:req.flash()})
            
        }else{
            req.flash("error","An Error Occured") 
           res.render("event",{msg:req.flash(),events:null})
        }

        
    }
    };
module.exports = {
    getDetailsFile,
    addDetails
  };