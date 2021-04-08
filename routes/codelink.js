const express = require("express");
const { verifyUser, verifyAdmin } = require("../authenticate");
const Codes = require("../models/LinkedCodes");

const router = express.Router();

let list = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
for (let i = 97; i < 97 + 26; i++) list.push(String.fromCharCode(i));

const randomUri = () => {
  let uri = "";
  for (let i = 1; i < 6; i++)
    uri += list[Math.floor(Math.random() * list.length)];
  return uri;
};

const generateUriForCode = () => {
  let flag = true;
  let uri;
  while (flag) {
    uri = randomUri();
    flag = false;
    Codes.find({ uri: uri }, (err, code) => {
      if (code) flag = true;
    });
  }
  return uri;
};

router.get("/", verifyUser, verifyAdmin, (req, res) => {
  Codes.find({}).then((codes) => res.json(codes));
});

router.post("/", (req, res, next) => {
  const uri = generateUriForCode();
  const code = new Codes({
    uri,
    lang: req.body.lang,
    code: req.body.code,
    input: req.body.input,
  });
  code
    .save()
    .then((code) => {
      res.statusCode = 200;
      res.json({ success: true, url: code.uri });
    })
    .catch((err) => next(err));
});

router.get("/:codeUri", (req, res, next) => {
  Codes.findOne({ uri: req.params.codeUri })
    .then((code) => {
      res.statusCode = 200;
      res.json({ lang: code.lang, code: code.code, input: code.input });
    })
    .catch((err) => next(err));
});

module.exports = router;
