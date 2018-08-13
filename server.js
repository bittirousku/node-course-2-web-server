
// launch server: nodemon server.js -e js,hbs

const express = require("express");
const hbs = require("hbs");
const fs = require("fs");

var app = express();

hbs.registerPartials(__dirname + "/views/partials");
app.set("view engine", "hbs");

// custom middleware:
app.use((req, res, next) => {
  let now = new Date().toString();
  let log = `${now}: ${req.method} ${req.url}`;
  let logFileName = "server.log";
  console.log(log);
  fs.appendFile(logFileName, log + "\n", (err) => {
    if (err) {
      console.log(`Unable to append to ${logFileName}`);
    }
  });
  next();  // next tells express when middleware "is done"
});

// blocking "maintenance" middleware without next:
app.use((req, res, next) => {
  res.render("maintenance.hbs");
});

// NB: use static folder only after the "maintenance" middleware
// otherwise it will be displayed even though it shouldn't.
app.use(express.static(__dirname + "/public"));
hbs.registerHelper("getCurrentYear", () => new Date().getFullYear());
hbs.registerHelper("screamIt", (text) => {
  return text.toUpperCase();
});

app.get("/", (request, response) => {
  response.render("home.hbs", {
    pageTitle: "Home page",
    welcomeMessage: "Terwetuloa sivuille",
  });
});

app.get("/about", (request, response) => {
  response.render("about.hbs", {
    pageTitle: "About page",
  });
});

app.get("/bad", (req, res) => {
  res.send({status: "Error", errorMessage: "Bad page reached."});
});

// heroku port variable or default
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
