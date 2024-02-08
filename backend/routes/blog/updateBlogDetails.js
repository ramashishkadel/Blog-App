const express = require("express");
const cors = require("cors");
const db = require("../db/db");
const router = express.Router();

router.use(cors());

router.post("/updateblogdetails", (req, res, next) => {
  if (!req.body) {
    return res.json({ msg: "error" });
  }

  console.log(req.body);

  const title = req.body.title;
  const textCont = req.body.textCont;
  const blogId = req.body.BlogId;

  const currentTimestamp = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  // if (req.body.imageUrl) {
  db.query(
    `UPDATE blogs
          SET
            title = ?,
            image = ?, 
            content = ?,
            timestamp = ?
          WHERE
            blogId = ?`,
    [title, req.body.imageUrl, textCont, currentTimestamp, blogId],
    (error, results) => {
      console.log(error);
      if (error) {
        return res.json({ msg: "error", error: error.message });
      }
      return res.json({ msg: "okay" });
    }
  );
  //   } else {
  //     db.query(
  //       `UPDATE blogs
  //         SET
  //           title = ?,

  //           content = ?,
  //           timestamp = ?
  //         WHERE
  //           blogId = ?`,
  //       [title, textCont, currentTimestamp, blogId],
  //       (error, results) => {
  //         console.log(error);
  //         if (error) {
  //           return res.json({ msg: "error", error: error.message });
  //         }
  //         return res.json({ msg: "okay" });
  //       }
  //     );
  //   }
});

module.exports = router;
