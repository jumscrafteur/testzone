const express = require("express");
const mustacheExpress = require("mustache-express");
const https = require("https");
var mongoose = require("mongoose");
const {
  env_port
} = require('./config');

const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const port = process.env.PORT || env_port;

app.engine("html", mustacheExpress());

app.set("view engine", "html");
app.set("views", __dirname + "/html");

app.use("/img", express.static(__dirname + "/img"));

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@testzone-2rfnk.mongodb.net/test?retryWrites=true&w=majority`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .catch(error => console.error(error));

app.get("/", function (req, res) {
  var data = {
    head: {
      title: "Home",
      home: "active"
    },
    homepage: {
      title: "🛠 Amélioration d'une attelle"
    }
  };
  res.render("master", data);
});

app.get("/utilite", function (req, res) {
  var data = {
    head: {
      title: "Utilité",
      utilite: "active"
    },
    usepage: {
      title: "Pourquoi améliorer cette attelle ?",
      text: "Bienvenu sur Utilité",
      img: {
        src: "img/hopital_greve.jpg",
        alt: "greve Hopital"
      }
    }
  };
  res.render("master", data);
});

app.get("/etude", function (req, res) {
  var data = {
    head: {
      title: "Utilité",
      utilite: "active"
    },
    usepage: {
      title: "Pourquoi améliorer cette attelle ?",
      text: "Bienvenu sur Utilité",
      img: {
        src: "img/hopital_greve.jpg",
        alt: "greve Hopital"
      }
    }
  };
  res.render("master", data);
});

app.get("/exoplanetes", function (req, res) {
  pageIndex = parseInt(req.query.page);

  if (pageIndex >= 0 && pageIndex <= 825 && Number.isInteger(pageIndex)) {
    https
      .get(
        "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&format=json",
        resp => {
          let dataNasa = "";

          // A chunk of data has been recieved.
          resp.on("data", chunk => {
            dataNasa += chunk;
          });
          resp.on("end", () => {
            dataNasa = JSON.parse(dataNasa);
            dataNasa = dataNasa.slice(pageIndex * 5, (pageIndex + 1) * 5);

            var dataPage = {
              head: {
                title: "Exoplanètes",
                exoplanetes: "active"
              },
              exoplanetespage: {
                data: dataNasa,
                before: {
                  isAPage: true,
                  page: pageIndex - 1
                },
                after: {
                  isAPage: true,
                  page: pageIndex + 1
                }
              }
            };

            if (pageIndex == 0) {
              dataPage.exoplanetespage.before.isAPage = false;
            } else if (dataNasa.length < 5) {
              dataPage.exoplanetespage.after.isAPage = false;
            }
            res.render("master", dataPage);
          });
        }
      )
      .on("error", err => {
        console.error("Error: " + err.message);
      });
  } else {
    var dataPage = {
      head: {
        title: "Error"
      },
      errorpage: {
        title: "Page Introuvable",
        text: "Il semble que cette page n'existe pas ou qu'elle n'est pas accessible pour le moment 😭"
      }
    };
    res.render("master", dataPage);
  }
});

app.get("/tchat", function (req, res) {
  var data = {
    head: {
      title: "Tchat",
      tchatpage: "active"
    },
    tchatpage: {
      pseudo: false
    }
  };
  if (req.query.pseudo) {
    data.tchatpage.pseudo = req.query.pseudo;
  }

  res.render("master", data);
});

app.get("/42", function (req, res) {
  var data = {
    head: {
      title: "⚠️㊙️☣️",
      sandbox: "active"
    },
    sandbox: {}
  };
  res.render("master", data);
});

app.get("/*", function (req, res) {
  var data = {
    head: {
      title: "Error"
    },
    errorpage: {
      title: "Page Introuvable",
      text: "Il semble que cette page n'existe pas ou qu'elle n'est pas accessible pour le moment 😭"
    }
  };
  res.render("master", data);
});

io.on("connection", function (socket) {
  socket.on("chat message", function (msg) {
    io.emit("chat message", msg);
  });
});

http.listen(port, () => console.log(`Example app listening on port ${port}!`));