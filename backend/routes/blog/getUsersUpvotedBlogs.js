const express = require("express");
const router = express.Router();
const cors = require("cors");
const db = require("../db/db");

router.use(cors());

router.get("/getuserupvotedblogs/:username", (req, res, next) => {
  const username = req.params.username;
  db.query(
    `SELECT b.*
    FROM blogs AS b
    INNER JOIN user_blog_upvotes AS u
    ON b.blogId = u.blogId
    WHERE u.username = ?`,
    [username],
    (error, results) => {
      res.json(results);
    }
  );
});

module.exports = router;
