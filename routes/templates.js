const { verifyUser } = require("../authenticate");
const Users = require("../models/Users");
const express = require("express");

const router = express.Router();

router.get("/", verifyUser, (req, res, next) => {
  res.statusCode = 200;
  res.json({ templates: req.user.templates });
});

router.post("/", verifyUser, (req, res, next) => {
  const { lang, code } = req.body;
  const n = req.user.templates.filter((x) => x.lang === lang).length;
  if (n < 3) {
    Users.findOne({ _id: req.user._id })
      .then((user) => {
        user.templates.push({ lang, code });
        user
          .save()
          .then((user) => {
            res.statusCode = 200;
            res.json({ success: true, status: "Template succesfully added" });
          })
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  } else {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.json({
      success: false,
      status: "A user can have only 3 templates per languages",
    });
  }
});

router.post("/:templateId", verifyUser, (req, res, next) => {
  Users.findOne({ _id: req.user._id }).then((user) => {
    for (let i = 0; i < user.templates.length; i++) {
      if (user.templates[i]._id == req.params.templateId) {
        user.templates[i].code = req.body.code;
        user
          .save()
          .then((user) => {
            res.statusCode = 200;
            res.json({ success: true, status: "Template succesfully changed" });
          })
          .catch((err) => next(err));
        return;
      }
    }
    var error = new Error("Template not found!");
    next(error);
  });
});

router.delete("/:templateId", verifyUser, (req, res, next) => {
  Users.findOne({ _id: req.user._id }).then((user) => {
    for (let i = 0; i < user.templates.length; i++) {
      if (user.templates[i]._id == req.params.templateId) {
        user.templates.splice(i, 1);
        user
          .save()
          .then((user) => {
            res.statusCode = 200;
            res.json({ success: true, status: "Template succesfully changed" });
          })
          .catch((err) => next(err));
        return;
      }
    }
    var error = new Error("Template not found!");
    next(error);
  });
});

module.exports = router;
