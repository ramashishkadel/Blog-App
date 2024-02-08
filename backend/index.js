const express = require("express");
const app = express();
const helmet = require("helmet");
const serverless = require("serverless-http");
const userRegRouter = require("./routes/users/registration");
const userLogRouter = require("./routes/users/login");
const userDetailsRouter = require("./routes/users/userDetails.js");
const blogDetailsRouter = require("./routes/blog/blogDetails.js");
const getUserDetails = require("./routes/users/getUserDetails.js");
const getUserAllBlogsDetails = require("./routes/blog/getUserAllBlogsDetails.js");
const getBlogDetailsRouter = require("./routes/blog/getBlogDetails");
const blogupvotes = require("./routes/blog/blogUpvote.js");
const blogdownvotes = require("./routes/blog/blogDownvote.js");
const getUsersUpvotedB = require("./routes/blog/getUsersUpvotedBlogs");
const updateBlogDetails = require("./routes/blog/updateBlogDetails.js");
const getallBlogs = require("./routes/blog/getAllBlogs");
const cors = require("cors");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
app.use("/users", userRegRouter);
app.use("/users", userLogRouter);
app.use("/users", userDetailsRouter);
app.use("/users", getUserDetails);
app.use("/blog", blogDetailsRouter);
app.use("/blog", getUserAllBlogsDetails);
app.use("/blog", getBlogDetailsRouter);
app.use("/blog", blogupvotes);
app.use("/blog", blogdownvotes);
app.use("/blog", getUsersUpvotedB);
app.use("/blog", updateBlogDetails);
app.use("/blog", getallBlogs);

app.use(cors());

app.get("/", (req, res, next) => {
  res.json({ msg: "okay" });
});

// app.listen(3000, () => {
//   console.log("server is running on port 3000");
// });

module.exports.handler = serverless(app);
