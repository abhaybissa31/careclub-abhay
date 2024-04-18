require("dotenv").config();
const express=require('express');
const userModel = require('./models/userData');
const app=express();
const expressSession=require('express-session');
const MongoDbSession = require("connect-mongodb-session")(expressSession);

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true, //# forsending header and cookies
  }
});

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

io.on('connection', (socket) => {

  console.log(socket.id);

  socket.on("message", (data) => {

    console.log("message:", data, "by socket id: ", socket.id)
    io.to(data.room).emit("io-recived-message", data.message); //for all user 
  })


  socket.on("disconnect", () => {
    console.log("listner for disconnect server!!!");
    console.log(`User disconnected ${socket.id}`);
  })


})


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
