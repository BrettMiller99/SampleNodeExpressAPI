const User = require('../models/User');
const { ValidationError } = require('sequelize');

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
      if (error instanceof ValidationError) {
        res.status(400).json({
          error: 'Validation Error',
          details: error.errors.map(err => ({
            message: err.message,
            field: err.path
          }))
        });
      } else {
        next(error);
      }
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
      if (error instanceof ValidationError) {
        res.status(400).json({
          error: 'Validation Error',
          details: error.errors.map(err => ({
            message: err.message,
            field: err.path
          }))
        });
      } else {
        next(error);
      }
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
        
      // This will perform a soft delete since paranoid is true
      await user.destroy();
      res.json({ message: 'User deleted' });
    } catch (error) {
      next(error);
    }
  },
  
  // New method to permanently delete a user (bypass soft delete)
  permanentlyDeleteUser: async (req, res, next) => {
    try {
      const userId = req.params.id;
      
      const user = await User.findByPk(userId, { paranoid: false });
        
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
        
      // Force true will permanently delete the record
      await user.destroy({ force: true });
      res.json({ message: 'User permanently deleted' });
    } catch (error) {
      next(error);
    }
  },
  
  // New method to restore a soft-deleted user
  restoreUser: async (req, res, next) => {
    try {
      const userId = req.params.id;
      
      // Find the user including soft-deleted records
      const user = await User.findByPk(userId, { paranoid: false });
        
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      
      if (!user.deletedAt) {
        return res.status(400).json({ message: 'User is not deleted' });
      }
        
      // Restore the soft-deleted user
      await user.restore();
      res.json({ message: 'User restored', user });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = UserController;
