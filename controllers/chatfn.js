const chatModel=require('../models/chat');
const express = require("express");
const bodyParser = require("body-parser");
const userData = require('../models/userData');
const app = express();
app.use(bodyParser.json());

const getChat= async (req,res)=>{
    // const messages = chatModel.find({ sender_id: req.session.user._id }, 'msg');
    
    // createdUser.forEach(createdUser => {
    //     console.log(createdUser);
    // });
    if (req.session && req.session.user && req.session.user._id) {
        let messages = await chatModel.find({ sender_id: req.session.user._id });
        console.log(messages)
        // messages.forEach(message => {
        //     console.log(message.msg,'reciver id-', message.receiver_id);
        // });
        // console.log('createduser sendind')
        // ---------------------------------below code for auto suggestions ----------------------------
        const createdUser = await userData.find({}, { u_name: 1, u_email: 1, _id: 1 });
       const temp = createdUser.map((item)=> item.u_name);
       console.log(temp)
        // console.log(typeof(createdUserUname))
        res.render('chat',{createdUser:createdUser,createdUname:temp,user:req.session.user._id});
    } else {
        // user not logged in action guys
        res.write(`<html><script>alert('Please login in order to continue'); location.href='/login'</script></html>`)
    }
   
}

const getRecentMessages = async(req,res)=>{

}

const postMessages = async(req,res)=>{
    const message = req.body.message;
    const sender_id = req.session.user._id;

    let receiver_name = req.body.recid;
    console.log(req.body.recid);
    let receiver_id = await userData.findOne({u_name:receiver_name});
    let recid=receiver_id._id;
    console.log('and id is',recid)
    // console.log('recid------------------------------------',receiver_id)
    // console.log('heheheheheheheheheheheheheh',msg);
  
    if (typeof(message)=='string') {
        chatModel.create({
            sender_id:sender_id,
            msg:message,
            receiver_id:recid
        }).then(()=>console.log('message saved success',recid))
    }
    // console.log('id is--------------------------------',receiver_id)
    // Handle the message as needed
    res.sendStatus(200); // Send a response in
}

const getChats2 = async(req,res,uname)=>{
    console.log(uname);
}

module.exports={
    getChat,
    postMessages,
    getChats2
}