const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.post("/login", (req, res, next) => {
  db.query(
    "select hasdetails from users where username = ?",
    [req.body.username],
    (error, results) => {
      if (results[0]?.hasdetails != 1) {
        res.json({ msg: "no" });
      } else {
        db.query(
          "SELECT * FROM users WHERE username = ?",
          [req.body.username],
          (error, data) => {
            console.log(error);
            if (
              !data.length ||
              error ||
              data[0].password != req.body.password
            ) {
              res.json({ msg: "error" });
            } else {
              res.json({ msg: "ok" });
            }
          }
        );
      }
    }
  );
});

module.exports = router;
