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
      return null;
    }
  };
};

module.exports = new UserService();