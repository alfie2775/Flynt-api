var express = require("express");
var router = express.Router();
var passport = require("passport");
const authenticate = require("../authenticate");

const Users = require("../models/Users");

/* GET users listing. */

router.get(
  "/",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    Users.find({ admin: { $eq: false } })
      .then((users) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        if (users) res.json(users);
      })
      .catch((err) => next(err));
  }
);

router.post("/login", passport.authenticate("local"), (req, res) => {
  var token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.json({
    success: true,
    token: token,
    status: "You are logged in succesfully",
  });
});

router.post("/signup", (req, res, next) => {
  Users.register(
    new Users({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      templates: [],
      savedCodes: [],
    }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.json({ err });
        return;
      }
      passport.authenticate("local")(req, res, () => {
        const token = authenticate.getToken({ _id: user._id });
        res.statusCode = 200;
        res.json({ success: true, status: "Registration succesful", token });
      });
    }
  );
});

router.get("/userinfo", authenticate.verifyUser, (req, res) => {
  res.json(req.user);
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
  }),
  (req, res) => console.log("loading")
);

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.send("You reached a callbackURI");
});

router.delete(
  "/",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    Users.remove({ admin: { $eq: false } })
      .then((user) => res.json({ success: true }))
      .catch((err) => next(err));
  }
);

module.exports = router;
