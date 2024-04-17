require("dotenv").config();
const express=require('express');
const userModel = require('./models/userData');
const app=express();
const expressSession=require('express-session');
const MongoDbSession = require("connect-mongodb-session")(expressSession);

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server)

const passport=require('passport');
const bodyparser = require('body-parser')
const mongoose=require('mongoose')
const path=require('path')
const flash=require('express-flash')
const {initializingPassport} =require("./passportConfig")

initializingPassport(passport);
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())



app.set("view engine", "ejs");
app.use(express.static('public'));
app.set('views',path.join(__dirname,'/views'));
mongoose
  .connect(process.env.MongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongo Database connected Successfully"))
  .catch((err) => console.log(err + "error"));
  const store = new MongoDbSession({
    uri:'mongodb+srv://theharshrooprai:Mathurharsh18@cluster0.klmhr5d.mongodb.net/',
    collection: "authSession",
  });

//-------------------------------------- Socket.io code starts   ---------------------------------------------------
// Keep track of connected users and their corresponding socket IDs
const connectedUsers = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user authentication and save user ID with socket ID
  socket.on('authenticate', (userId) => {
    connectedUsers[userId] = socket.id;
    console.log('User authenticated:', userId);
  });

  socket.on('send-message', (data) => {
    const { recid, message } = data;
    console.log(data)
    // Check if recipient ID is available and connected
    if (recid && connectedUsers[recid]) {
      const recipientSocketId = connectedUsers[recid];
      io.to(recipientSocketId).emit('private-message', { message, sender: socket.id });
    } else {
      console.error('Recipient ID not provided or not connected');
    }
  });

  socket.on('disconnect', () => {
    // Remove user from connected users when disconnected
    for (const userId in connectedUsers) {
      if (connectedUsers[userId] === socket.id) {
        delete connectedUsers[userId];
        console.log('User disconnected:', userId);
        break;
      }
    }
  });
});




//-------------------------------------- Socket.io code Ends  ---------------------------------------------------


  app.use(passport.initialize());
app.use(expressSession({
  secret:'this is my secret',
  store:store,
  resave:false,
  saveUninitialized:true,
 cookie:{maxAge:1000*60*60*24}

 
 
}));
app.use(passport.session())

app.use(flash())
require('./routes')(app);
server.listen(process.env.PORT ||  3000,()=>console.log("app is running"));
