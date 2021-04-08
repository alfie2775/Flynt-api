const express = require("express");
const axios = require("axios").default;

const router = express.Router();

const apiKeys = [
  {
    clientId: process.env.clientIdOne,
    clientSecret: process.env.clientSecretOne,
  },
  {
    clientId: process.env.clientIdTwo,
    clientSecret: process.env.clientSecretTwo,
  },
];

const versions = {
  Java: 3,
  C: 4,
  "C++ 17": 0,
  Python: 3,
};

const langs = {
  Java: "java",
  C: "c",
  "C++ 17": "cpp17",
  Python: "python3",
};

router.post("/", async (req, res, next) => {
  const { script, language, stdin } = req.body;
  const resp = await axios
    .post(process.env.apiCredit, apiKeys[0], {
      headers: { "Content-Type": "application/json" },
    })
    .then((resp) => {
      return resp.data;
    })
    .catch((err) => next(err));
  var i = 0;
  if (resp.used >= 200) {
    i++;
  }
  const output = await axios
    .post(
      process.env.apiExecute,
      {
        ...apiKeys[i],
        script,
        language: langs[language],
        stdin,
        versionIndex: versions[language],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((resp) => {
      return resp.data;
    })
    .catch((err) => next(err));
  if (output.error) res.json({ error: output.error, status: "Error" });
  else {
    res.json(output);
  }
});

module.exports = router;
