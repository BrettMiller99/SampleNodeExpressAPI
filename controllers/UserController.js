const User = require('../models/User');
const { createSpan } = require('../tracing');

const UserController = {
  getUsers: async (req, res, next) => {
    try {
      // Create a custom span for the getUsers operation
      return await createSpan('Get Users', async () => {
        const users = await User.findAll();
        res.json(users);
      }, {
        'http.method': 'GET',
        'http.route': '/users',
        'operation.type': 'read',
        'result.count': 0 // Will be updated after query
      });
    } catch (error) {
      next(error);
    }
  },
  
  getUser: async (req, res, next) => {
    try {
      const userId = req.params.id;
      
      // Create a custom span for the getUser operation
      return await createSpan('Get User', async () => {
        const user = await User.findByPk(userId);
        
        if (!user) {
          res.status(404).json({ message: 'User not found' });
          return;
        }
        
        res.json(user);
      }, {
        'http.method': 'GET',
        'http.route': '/users/:id',
        'user.id': userId,
        'operation.type': 'read'
      });
    } catch (error) {
      next(error);
    }
  },
  
  createUser: async (req, res, next) => {
    try {
      // Create a custom span for the createUser operation
      return await createSpan('Create User', async () => {
        const user = await User.create(req.body);
        res.status(201).json(user);
      }, {
        'http.method': 'POST',
        'http.route': '/users',
        'operation.type': 'create',
        'user.email': req.body.email // Track business-relevant data
      });
    } catch (error) {
      next(error);
    }
  },
  
  updateUser: async (req, res, next) => {
    try {
      const userId = req.params.id;
      
      // Create a custom span for the updateUser operation
      return await createSpan('Update User', async () => {
        const user = await User.findByPk(userId);
        
        if (!user) {
          res.status(404).json({ message: 'User not found' });
          return;
        }
        
        await user.update(req.body);
        res.json(user);
      }, {
        'http.method': 'PUT',
        'http.route': '/users/:id',
        'user.id': userId,
        'operation.type': 'update',
        'fields.updated': Object.keys(req.body).join(',') // Track what fields were updated
      });
    } catch (error) {
      next(error);
    }
  },
  
  deleteUser: async (req, res, next) => {
    try {
      const userId = req.params.id;
      
      // Create a custom span for the deleteUser operation
      return await createSpan('Delete User', async () => {
        const user = await User.findByPk(userId);
        
        if (!user) {
          res.status(404).json({ message: 'User not found' });
          return;
        }
        
        await user.destroy();
        res.json({ message: 'User deleted' });
      }, {
        'http.method': 'DELETE',
        'http.route': '/users/:id',
        'user.id': userId,
        'operation.type': 'delete'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = UserController;
