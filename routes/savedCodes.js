const { verifyUser } = require("../authenticate");
const User = require("../models/Users");
const router = require("express").Router();

router.post("/", verifyUser, (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      user.savedCodes.push({
        codeName: req.body.title,
        lang: req.body.lang,
        code: req.body.code,
        input: req.body.input,
      });
      user
        .save()
        .then((user) => {
          res.statusCode = 200;
          res.json({ success: true, status: "Added successfully" });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => next(err));
});

router.get("/", verifyUser, (req, res, next) => {
  res.statusCode = 200;
  res.json(req.user.savedCodes);
});

router.delete("/:codeId", verifyUser, (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      for (let i = 0; i < user.savedCodes.length; i++) {
        if (user.savedCodes[i]._id == req.params.codeId) {
          user.savedCodes.splice(i, 1);
          user
            .save()
            .then((user) =>
              res.json({ success: true, status: "Deleted successfuly" })
            )
            .catch((err) => next(err));
          return;
        }
      }
      res.statusCode = 404;
      res.json({ error: "Template Not Found" });
    })
    .catch((err) => next(err));
});

module.exports = router;
