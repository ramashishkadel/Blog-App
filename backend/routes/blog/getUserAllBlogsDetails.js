const express = require("express");
const router = express.Router();
const db = require("../db/db");
const cors = require("cors");

router.use(cors());

router.get("/getuserallblogsdetails/:username", (req, res, next) => {
  if (!req.params) res.json({ msg: "error" });
  else
    db.query(
      "SELECT * FROM blogs WHERE author = ?",
      [req.params.username],
      (error, results) => {
        if (error) res.json({ msg: "error" });
        else res.json(results);
      }
    );
});

module.exports = router;
