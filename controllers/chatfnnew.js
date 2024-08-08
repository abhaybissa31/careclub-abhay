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
    console.log("---------req", req.session.user._id);
    return;
  }

  try {
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error(`Invalid ObjectId for session user: ${userId}`);
      res.status(400).send("Invalid user ID.");
      return;
    }
  } catch (e) {
    console.error(e);
  }

  res.render("chat", {
    createdUser: "",
    createdUname: "",
    createdId: "",
    temp12: "bhdwaaaaa",
    createdImg: "",
    loggedUser: req.user._id,
    user: "",
    chatDetails: "",
    allChatMessage: "",
  });
};

module.exports = {
  getInitialChats,
  //   postMessages,
  //   getChats2,
  //   getRecentMessages,
};
