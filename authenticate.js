const passport = require("passport");
const passportJwt = require("passport-jwt");
const passportLocal = require("passport-local");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
const jwt = require("jsonwebtoken");
const Users = require("./models/Users");
const { jwtSecret, googleOAuth } = require("./keys");

require("dotenv").config();

module.local = passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

exports.getToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {});
};

exports.jwtPassport = passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    },
    (jwt_payload, done) => {
      console.log(jwt_payload);
      Users.findOne({ _id: jwt_payload._id }, (err, user) => {
        if (err) return done(err, false);
        else if (user) return done(null, user);
        else return done(null, false);
      });
    }
  )
);

exports.verifyUser = passport.authenticate("jwt", { session: false });
exports.verifyAdmin = (req, res, next) => {
  Users.findOne({ _id: req.user._id })
    .then((user) => {
      if (user.admin) {
        return next();
      } else {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.end("You are not authorized!");
      }
    })
    .catch((err) => next(err));
};

exports.google = passport.use(
  new GoogleStrategy(googleOAuth, () => {
    console.log("OP bhai");
  })
);
