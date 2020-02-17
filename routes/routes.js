var express = require('express');
var router = express.Router();
const https = require("https");
const Messages = require('../models/Messages');

router.use(function (req, res, next) {
    next();
});

router.get("/", function (req, res) {
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

router.get("/utilite", function (req, res) {
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

router.get("/etude", function (req, res) {
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

router.get("/exoplanetes", function (req, res) {
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

router.get("/tchat", function (req, res) {
    Messages.find(function (err, Messages) {
        if (err) return console.error(err);
        var data = {
            head: {
                title: "Tchat",
                tchatpage: "active"
            },
            tchatpage: {
                username: false,
                messages: Messages
            }
        };
        if (req.query.pseudo) {
            data.tchatpage.username = req.query.pseudo;
        }
        res.render("master", data);
    })


});

router.get("/42", function (req, res) {
    var data = {
        head: {
            title: "⚠️㊙️☣️",
            sandbox: "active"
        },
        sandbox: {}
    };
    res.render("master", data);
});

router.get("/*", function (req, res) {
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

module.exports = router;