const express = require("express");
const router = express.Router();
const cors = require("cors");
const db = require("../db/db");

router.use(cors());

router.get("/getuserdetails/:username", (req, res, next) => {
  if (!req.params) res.json({ msg: "error" });
  else {
    db.query(
      "SELECT * FROM userdetails WHERE username = ?",
      [req.params.username],
      async (error, results) => {
        if (error) res.json({ msg: "error" });
        else {
          res.json(results[0]);
        }
      }
    );
  }
});

module.exports = router;
