const express = require('express'),
        validator = require('../middlewares/validator.middleware'),
        auth = require('../middlewares/auth.middleware'),
        userController = require('../controllers/user.controller'),
        userRouter = express.Router();

/**
 * Аll routes start with '/user'
 **/

// Create a new user
userRouter.post('/', validator('user-create'), userController.create);

// Update user info
userRouter.put('/', auth, validator('user-update'), userController.update);

// Get user info
userRouter.get('/', auth, userController.getInfo);

// Sign in
userRouter.post('/sign-in', validator('user-sign-in'), userController.signIn);

//  Sign out
userRouter.post('/sign-out', auth, validator('user-sign-out'), userController.signOut);




//fixme

// update token
// userRouter.put('/:id/update-token', userController.token_update);

module.exports = userRouter;
