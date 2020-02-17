const {
  env_port,
  db_user,
  db_password
} = require("./config");
const express = require("express");
const mustacheExpress = require("mustache-express");
var mongoose = require("mongoose");
var Routes = require("./routes/Routes.js");
const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

const Messages = require('./models/Messages');

const port = process.env.PORT || env_port;
var typingArray = [];

app.engine("html", mustacheExpress());
app.use("/", Routes);

app.set("view engine", "html");
app.set("views", __dirname + "/html");

app.use("/img", express.static(__dirname + "/img"));

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER || db_user}:${process.env.DB_PASSWORD || db_password}@users-cfoet.mongodb.net/test?retryWrites=true&w=majority`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .catch(error => console.error(error));

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
db.once('open', function () {
  console.log("Connexion à la base OK");
});

io.on("connection", function (socket) {
  io.emit("chat typing", typingArray);

  socket.on("chat message", function (msg) {
    data = msg.split(" - ")
    console.log(data)
    if (data[1] != undefined && data[0] != '') {
      message = new Messages({
        pseudo: data[0],
        message: data[1]
      })
      message.save(function (err) {
        if (err) return console.error(err);
      });
      io.emit("chat message", msg);
    }

  });

  socket.on("chat typing add", function (pseudo) {
    socket.username = pseudo;
    typingArray.push(pseudo);
    io.emit("chat typing", typingArray);
  });

  socket.on("chat typing delete", function () {
    for (let i = 0; i < typingArray.length; i++) {
      if (typingArray[i] == socket.username) {
        typingArray.splice(i, 1);
      }
    }
    io.emit("chat typing", typingArray);
  });

  socket.on("disconnect", function () {
    for (let i = 0; i < typingArray.length; i++) {
      if (typingArray[i] == socket.username) {
        typingArray.splice(i, 1);
      }
    }
    io.emit("chat typing", typingArray);
  });
});

http.listen(port, () => console.log(`Example app listening on port ${port}!`));