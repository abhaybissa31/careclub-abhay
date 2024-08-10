const chatModel = require("../models/chat");
const express = require("express");
const bodyParser = require("body-parser");
const userData = require("../models/userData");
const mongoose = require("mongoose");
const app = express();
const blue = "\x1b[94m";
const reset = "\x1b[0m";
app.use(bodyParser.json());

const getInitialChats = async (req, res) => {
  // keep in mind that we already have logged in user's id
  console.log(blue + "getInitalChats has been triggered" + reset);

  // Ensure the user is logged in
  if (!req.session || !req.user || !req.user._id) {
    res.write(
      `<html><script>alert('Please login in order to continue'); location.href='/login'</script></html>`
    );
    console.log("---------req", req.user._id);
    return;
  }

  try {
    const userId = req.user._id;

    // Validate the session user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error(`Invalid ObjectId for session user: ${userId}`);
      res.status(400).send("Invalid user ID.");
      return;
    }

    // Retrieve all chat details where the current user is either sender or receiver
    let chatDetails = await chatModel.find({
      $or: [{ sender_id: userId }, { receiver_id: userId }],
    });
    // console.log(
    //   "---------------------chat details contains id, senderid, receiverid, msg, createdat, updatedate----------------------------------",
    //   chatDetails
    // );
    const uniqueUserIds = new Set();

    // Aggregate unique user IDs from the chat details
    chatDetails.forEach((chat, index) => {
      if (!chat.sender_id || !chat.receiver_id) {
        console.error(`Invalid chat object at index ${index}:`, chat);
        return;
      }

      uniqueUserIds.add(chat.sender_id.toString());
      uniqueUserIds.add(chat.receiver_id.toString());
    });

    let messagesWithSenderReceiver = [];

    for (const id of uniqueUserIds) {
      if (!mongoose.Types.ObjectId.isValid(id) || id === userId) {
        // Skip adding current user's details
        continue;
      }

      const userData1 = await userData.findById(id);

      if (!userData1) {
        console.error(`User data not found for user ID: ${id}`);
        continue;
      }

      // Find the last message between the logged-in user and the other user
      const lastMessage = await chatModel
        .findOne({
          $or: [
            { sender_id: userId, receiver_id: id },
            { sender_id: id, receiver_id: userId },
          ],
        })
        .sort({ createdAt: -1 });

      // Construct the message object with user details and the last message
      const messageObj = {
        user_id: id,
        user_name: userData1.u_name,
        user_Image_URL: userData1.Image_URL,
        last_message: lastMessage ? lastMessage.msg : null,
      };

      messagesWithSenderReceiver.push(messageObj);
    }

    // Optionally find all users for some user listing feature
    const createdUser = await userData.find(
      {},
      { u_name: 1, u_email: 1, _id: 1, Image_URL: 1 }
    );
    const createdUname = createdUser.map((item) => item.u_name);
    let createdId = createdUser.map((item) => item._id);
    const userIdString = userId.toString(); // Convert ObjectId to string
    let createdImg = createdUser.map((item) => item.Image_URL);
    // console.log('-----------------------------img----------------------',createdImg)
    let messagesWithSenderReceiver2 = messagesWithSenderReceiver;

    function filterChatData(messagesWithSenderReceiver, userId) {
      return messagesWithSenderReceiver.filter(
        (chat) => chat.user_id !== userId
      );
    }

    // Filtering messagesWithSenderReceiver to remove messages sent or received by the logged-in user

    messagesWithSenderReceiver = filterChatData(
      messagesWithSenderReceiver,
      userIdString
    );
    createdId = filterChatData(createdId, userIdString);

    // console.log(
    //   "------------------------------->>>>>>>>>>>>>>>>>>>created user var \n",
    //   createdUser
    // );
    // console.log(
    //   "------------------------------->>>>>>>>>>>>>>>>>>>created uname var \n",
    //   createdUname
    // );
    // console.log(
    //   "------------------------------->>>>>>>>>>>>>>>>>>>created id var \n",
    //   createdId
    // );
    // console.log(
    //   "------------------------------->>>>>>>>>>>>>>>>>>>created img var \n",
    //   createdImg
    // );
    // console.log(
    //   "------------------------------->>>>>>>>>>>>>>>>>>>messageWithSenderRec var \n",
    //   messagesWithSenderReceiver
    // );
    // console.log(
    //   "------------------------------->>>>>>>>>>>>>>>>>>>chatDetails \n",
    //   chatDetails
    // );
    res.render("chat", {
      createdUser, //contains receiver username email and imageurl and id
      createdUname, // contains rec user name
      createdId, // contains rec id
      temp12: "temp12 variable",
      createdImg, // contains rec img
      loggedUser: userId,
      // user: userId,
      chatDetails: messagesWithSenderReceiver, // contains unique list that have reciver's id name img along with last message
      // allChatMessage: chatDetails, //contains id senderid recid msg and timestamps
    });
    // console.log(createdId)
  } catch (error) {
    console.error("Error fetching chat details:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getRecentMessages = async (req, res, chatId) => {
  console.log(blue + "getRecentMessages has been triggered" + reset);
  // console.log(chatId)
  // chota hhu moto sort huwe h

  let sendChat = await chatModel.find(
    { sender_id: chatId },
    { msg: 1, _id: 0 }
  );
  let chatDetailsRec = await chatModel.find(
    { receiver_id: chatId },
    { msg: 1, _id: 0 }
  );
  let allChatData = await chatModel.find(
    {
      $or: [
        { sender_id: chatId, receiver_id: req.user._id },
        { sender_id: req.user._id, receiver_id: chatId },
      ],
    },
    { sender_id: 1, receiver_id: 1, msg: 1, _id: 0, createdAt: 1 }
  );
  let uData = await userData.find({
    sender_id: chatId,
  });

  // console.log(
  //   "ssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
  //   uData
  // );
  // console.log(
  //   "------------------------------all chat data variable----------------------------",
  //   allChatData
  // );
  // cureent user saari chat
  let temp12 = chatDetailsRec.map((item) => item.msg);
  let chatDetailsSend = sendChat.map((item) => item.msg);
  // const allMessages = [...allChatData];
  // console.log('alllmmmsssss',allChatData)
  // console.log('---------------------------------------------------------',chatDetailsSend)
  res.status(201).json({
    temp12,
    chatDetailsSend,
    allChatData,
    loggedUser: req.user._id,
  });
};

const postMessages = async (req, res) => {
  console.log(blue + "postMessages has been triggered" + reset);
  const message = req.body.message;
  const sender_id = req.user._id;

  let receiver_name = req.body.recid;
  // console.log("recivername variable", receiver_name);
  // // console.log(req.body.recid);
  // let receiver_id = await userData.findOne({ u_name: receiver_name });
  // console.log("reciverID variable", receiver_id);
  // let recid = await receiver_id._id;
  // console.log("recid variable", recid);
  // console.log('recid------------------------------------',receiver_id)
  // console.log('heheheheheheheheheheheheheh',msg);

  if (typeof message == "string") {
    chatModel
      .create({
        sender_id: sender_id,
        msg: message,
        receiver_id: receiver_name,
      })
      .then(() => console.log("message saved success", receiver_name));
  }
  // console.log('id is--------------------------------',receiver_id)
  // Handle the message as needed
  res.sendStatus(200); // Send a response in
};

module.exports = {
  getInitialChats,
  postMessages,
  getRecentMessages,
};
