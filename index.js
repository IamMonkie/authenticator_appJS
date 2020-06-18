//Variables
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const messagebird = require("messagebird")("1MmM8cNhwLykFX8RPtJ6z4Yam");

//express setup
const app = express();
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extend: true }));

//render request page
app.get("/", function (req, res) {
  res.render("step1");
});

//phone number submission
app.post("setp2", function (req, res) {
  var number = req.body.number;

  //send request to API
  messagebird.verify.create(
    number,
    {
      template: "Your verification code is: %token.",
    },
    function (err, response) {
      //request failed
      if (err) {
        console.log(err);
        res.render("step1", {
          error: err.errors[0].description,
        });
      } else {
        //request successful
        console.log(response);
        res.render("step2", {
          id: response.id,
        });
      }
    }
  );
});

//token verification
app.post("step3", function (req, res) {
  let id = req.body.id;
  let token = req.body.token;

  //verify API request
  messagebird.verify.verify(id, token, function (err, response) {
    if (err) {
      //verification failed
      res.render("step2", {
        error: err.errors[0].description,
        id: id,
      });
    } else {
      //verification successful
      res.render("step3");
    }
  });
});

//Application start
app.listen(8080);
