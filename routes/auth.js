const express = require("express");
const router = express.Router();
const passport = require("passport");
const mailer = require("express-mailer");
const mailOptions = require("../helper/mailer");
const keys = require("../config/keys");
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",

  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // res.mailer.send("../views/mail", mailOptions, function(err, message) {
    //   if (err) {
    //     console.log(err);
    //     // res.send('There was an error sending the email'+err);
    //     console.log("mail  not sent");
    //     return;
    //   } else {
    //     console.log("mail sent...........");
    //     return;
    //   }
    // });

    req.flash("success_msg", "Welcome to TapeYourTales");
    res.redirect("/dashboard");
  }
);

router.get("/verify", (req, res) => {
  if (req.user) {
    console.log(req.user);
  } else {
    console.log("Not auth");
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
