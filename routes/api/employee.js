const express = require("express");
const router = express.Router();
const Post = require("../../models/employee");

//GET ALL THE POST
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.json({message: err});
  }
});

//SUBMIT A POST
router.post("/", async (req, res) => {
  const post = new Post({
    EmployeeID: req.body.EmployeeID,
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    JobTitle: req.body.JobTitle,
    Gender: req.body.Gender,
    BirthDate: req.body.BirthDate,
    Salary: req.body.Salary,
    Phone: req.body.Phone,
    Address: req.body.Address,
    Field: req.body.Field,
  });

  try {
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    res.json({message: err});
  }
});

//SPECIFIC POST
router.get("/:postId", async (req, res) => {
  try {
    // const post = await Post.findById({account_number: req.params.postId});
    const post = await Post.find({EmployeeID: req.params.postId});
    res.json(post);
  } catch (err) {
    res.json({message: err});
  }
});

//UPDATE POST
router.patch("/:postId", async (req, res) => {
  try {
    const updatedpost = await Post.updateOne(
      {EmployeeID: req.params.postId},
      {
        $set: {
          FirstName: req.body.FirstName,
          LastName: req.body.LastName,
          JobTitle: req.body.JobTitle,
          Gender: req.body.Gender,
          BirthDate: req.body.BirthDate,
          Salary: req.body.Salary,
          Phone: req.body.Phone,
          Address: req.body.Address,
          Field: req.body.Field,
        },
      }
    );
    res.json(updatedpost);
  } catch (err) {
    res.json({message: err});
  }
});

//DELETE POST
router.delete("/:postId", async (req, res) => {
  try {
    const removedpost = await Post.remove({
      EmployeeID: req.params.postId,
    });
    res.json(removedpost);
  } catch (err) {
    res.json({message: err});
  }
});

module.exports = router;
