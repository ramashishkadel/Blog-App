const express = require("express");
const router = express.Router();
const cors = require("cors");
const db = require("../db/db");

router.use(cors());

router.get("/getblogdetails/:blogId", (req, res, next) => {
  if (!req.params.blogId) res.json({ msg: "error" });
  db.query(
    "SELECT * FROM blogs WHERE blogID = ?",
    [req.params.blogId],
    (error, results) => {
      if (error) res.json({ msg: "error" });
      else res.json(results);
    }
  );
});

module.exports = router;
