const express = require('express'),
  validator = require('../middlewares/validator.middleware'),
  auth = require('../middlewares/auth.middleware'),
  taskRouter = express.Router(),
  taskController = require('../controllers/task.controller');
  
/**
 * Аll routes start with '/task'
 **/
//todo please fix the auth middleware later

// create task
taskRouter.post('/', /*auth,*/ validator('task-create'), taskController.create);

// get one task
taskRouter.get('/:id', /*auth,*/ taskController.getSingle);

// get batch tasks
taskRouter.get('/', /*auth,*/ taskController.getBatch);

// update task
taskRouter.put('/:id',/* auth,*/ validator('task-update'), taskController.update);

// delete batch tasks
taskRouter.patch('/', /*auth,*/ validator('task-delete-batch'), taskController.deleteBatch);

// delete single task
taskRouter.delete('/:id', /*auth,*/ taskController.delete);



module.exports = taskRouter;
