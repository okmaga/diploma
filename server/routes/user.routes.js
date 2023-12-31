const express = require("express");
const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");
const router = express.Router({ mergeParams: true });
const User = require("../models/User");
const UserService = require("../services/user.service");
const auth = require("../middleware/auth.middleware");


router.get("/", auth, async (req, res) => {
  try {
    const list = await User.find();
    res.status(200).send(list);
  } catch (e) {
    res.status(500).json({
      error: {
        message: "SERVER_ERROR",
        code: 500
      }
    })
  };
});

router.get("/:id", auth,async (req, res) => {
  const { id } = req.params;
  try {
    if(ObjectId.isValid(id)) {
      const user = await UserService.get(id);
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
    res.status(500).json({
      error: {
        message: "SERVER_ERROR",
        code: 500
      }
    });
  };
});

router.post("/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    if(ObjectId.isValid(id)) {

      const existingUserById = await User.findById(id);
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

      const canEdit = id === req.user._id || req.isAdmin;

      if (canEdit) {
        const { password } = req.body;
        if (password) {
          const updatedPassword = await bcrypt.hash(password, 12);
          req.body.password = updatedPassword;
        };
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        res.send(updatedUser);
      } else {
        return res.status(401).json({error: {
            message: "NOT_AUTHORIZED",
            code: 401
          }});
      };
    };
  } catch (e) {
    res.status(500).json({
      error: {
        message: "SERVER_ERROR",
        code: 500
      }
    });
  };
});

router.patch("/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    if(ObjectId.isValid(id)) {
      const existingUserById = await User.findById(id);
      if (!existingUserById) {
        return res.status(404).send({
          error: {
            message: "USER_NOT_FOUND",
            code: 404
          }
        });
      };

      const existingUserByEmail = await User.findOne({email: req.body.email});

      const isEmailAlreadyUsed = existingUserByEmail._id.toString() !== existingUserById._id.toString();

      if (isEmailAlreadyUsed) {
        return res.status(400).json({
          error: {
            message: "EMAIL_ASSIGNED_TO_ANOTHER_USER",
            code: 400
          }
        });
      };

      const canEdit = id === req.user._id || req.isAdmin;

      if (canEdit) {
        const { password } = req.body;
        if (password) {
          const updatedPassword = await bcrypt.hash(password, 12);
          req.body.password = updatedPassword;
        };
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        res.send(updatedUser);
      } else {
        return res.status(401).json({error: {
          message: "NOT_AUTHORIZED",
          code: 401
        }});
      };
    };
  } catch (e) {
    res.status(500).json({
      error: {
        message: "SERVER_ERROR",
        code: 500
      }
    });
  };
});

router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    if(ObjectId.isValid(id)) {
      const existingUserById = await User.findById(id);
      if (!existingUserById) {
        return res.status(404).send({
          error: {
            message: "USER_NOT_FOUND",
            code: 404
          }
        });
      };
      const removedUser = await UserService.delete(id);
      return res.send(null);
    };
  } catch (e) {
    res.status(500).json({
      error: {
        message: "SERVER_ERROR",
        code: 500
      }
    });
  };
});

module.exports = router;
