const User = require('../models/User');
const UserController = {
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      next(error);
    }
  },
  
  getUser: async (req, res, next) => {
    try {
      const userId = req.params.id;
      
      const user = await User.findByPk(userId);
        
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
        
      res.json(user);
    } catch (error) {
      next(error);
    }
  },
  
  createUser: async (req, res, next) => {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },
  
  updateUser: async (req, res, next) => {
    try {
      const userId = req.params.id;
      
      const user = await User.findByPk(userId);
        
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
        
      await user.update(req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },
  
  deleteUser: async (req, res, next) => {
    try {
      const userId = req.params.id;
      
      const user = await User.findByPk(userId);
        
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
        
      await user.destroy();
      res.json({ message: 'User deleted' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = UserController;
