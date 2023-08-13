const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router({ mergeParams: true });
const User = require("../models/User");
const UserService = require("../services/user.service");

router.get("/", async (req, res) => {
  try {
    const list = await User.find();
    res.status(200).send(list);
  } catch (e) {
    res.status(500).json({
      message: "Server error. Try again later"
    })
  };
});


router.get("/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    if(ObjectId.isValid(_id)) {
      const user = await UserService.get(_id);
      if (!user) {
        return res.status(404).send({
          error: {
            message: "USER_NOT_FOUND",
            code: 404
          }
        })
      };
      res.status(200).send(user);
    };
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Server error. Try again later"
    });
  };
});

router.post("/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    if(ObjectId.isValid(_id)) {

      const existingUserById = await User.findById(_id);
      if (!existingUserById) {
        return res.status(404).send({
          error: {
            message: "USER_NOT_FOUND",
            code: 404
          }
        });
      };

      const existingUserByEmail = await User.findOne({email: req.body.email});
      if (existingUserByEmail) {
        return res.status(400).json({
          error: {
            message: "EMAIL_ASSIGNED_TO_ANOTHER_USER",
            code: 400
          }
        });
      };

      const updatedUser = await UserService.update(_id, req.body);

      res.status(200).send(updatedUser);
    };
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Server error. Try again later"
    });
  };
});

module.exports = router;