const User = require('../models/User');

const users = [];

const UserController = {
  getUsers: (req, res) => {
    res.json(users);
  },
  createUser: (req, res) => {
    const user = new User(users.length + 1, req.body.name, req.body.email, req.body.password);
    users.push(user);
    res.json(user);
  }  
};

module.exports = UserController;

