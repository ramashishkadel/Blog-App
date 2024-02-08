const express = require("express");
const cors = require("cors");
const db = require("../db/db");
const router = express.Router();
const bodyParser = require("body-parser");

router.use(cors());
router.use(bodyParser.json());

router.post("/blogdetails", (req, res, next) => {
  if (!req.body) {
    return res.json({ error: "error" });
  }
  db.query(
    "insert into blogs(author,content,title,upvotes,downvotes,image) values(?,?,?,?,?,?)",
    [
      req.body.author,
      req.body.textCont,
      req.body.title,
      0,
      0,
      req.body.imageUrl,
    ],
    (error, results) => {
      if (error) {
        return res.json({ error: "error" });
      }
      res.json({ msg: "okay" });
    }
  );
});

module.exports = router;
