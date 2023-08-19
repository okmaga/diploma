const User = require("../models/User");
class UserService {
  async get(payload) {
    const existingUser = await User.findById(payload);
    return existingUser;
  };
  async update(id, payload) {
    try {
      const existingUser = await User.findById(id);
      if (existingUser) {
        Object.keys(payload).map(key => {
          existingUser[key] = payload[key]
        });
        return existingUser.save();
      };
    } catch(e) {
      return e;
    }
  };
  async delete (id) {
    try {
      const removedUser = await User.findByIdAndDelete(id);
      return null;
    } catch (e) {
      return e;
    }
  }
};

module.exports = new UserService();