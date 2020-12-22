const errorConfig = require('../../config/error.config'),
        ObjectId = require('mongoose').Types.ObjectId,
        taskSchema = require('../schemas/task.schema');

class TaskController {
    
    create = async (req, res, next) => {
        try {
            const taskData = {
                owner: ObjectId(res.locals.userId),
                ...req.body,
            }

            const task = await taskSchema.create(taskData);
            res.json(task);
        } catch (err) {
            next(err)
        }
    }
    
    getSingle = async (req, res, next) => {
        try {
            const task = await taskSchema.findOne({
                _id: req.params.id,
                // owner: res.locals.userId
                //fixme
            });
            if (!task) throw errorConfig.taskNotFound;
            res.json(task.toObject());
        } catch (err) {
            next(err)
        }
    }
    
    update = async (req, res, next) => {
        try {
            const task = await taskSchema.findOne({
                _id: req.params.id,
                // owner: res.locals.userId
                //fixme
            });
            if (!task) throw errorConfig.taskNotFound;
            
            const {title, description, date, status} = req.body;
            title && ( task.title = title);
            description && (task.description = description);
            date && ( task.date = date);
            status && ( task.status = status);
            
            await task.save();
            res.json(task.toObject());
        } catch (err) {
            next(err)
        }
    }
    
    
    delete = async (req, res, next) => {
        try {
            const task = await taskSchema.findOneAndDelete({
                _id: req.params.id,
                // owner: res.locals.userId
                //fixme
            });
            
            if (!task) throw errorConfig.taskNotFound;
            res.json({success: true});
        } catch (err) {
            next(err)
        }
    }
    
    deleteBatch = async (req, res, next) => {
        try {
            const result = await taskSchema.remove({
                _id: {
                    $in: (req.body.tasks).map(ObjectId)
                }
            });
            if (result.deletedCount === 0) throw errorConfig.nothingToRemove;
            res.json({success: true});
        } catch (err) {
            next(err)
        }
    }
    
    getBatch = async (req, res, next) => {
        try {
            const {userId} = res.locals,
                    {query} = req;
            
            const dbQuery = {
                //fixme
                // owner: userId
            };
    
            const {status} = query;
            if(status && /^active$|^done$/ig.test(status)){
                dbQuery.status = status;
            }
            
            if(query.search){
                const searchReg = new RegExp(query.search, 'ig');
                dbQuery.$or = [{ title: searchReg }, { description: searchReg }];
            }
    
            if (query.create_lte || query.create_gte) {
                const createdAtQuery = {};
                query.create_lte && ( createdAtQuery.$lte = new Date(query.create_lte));
                query.create_gte && ( createdAtQuery.$gte = new Date(query.create_gte));
                dbQuery.created_at = createdAtQuery;
            }
    
            if (query.complete_lte || query.complete_gte) {
                const dateQuery = {};
                query.complete_lte && (dateQuery.$lte = new Date(query.complete_lte));
                query.complete_gte && ( dateQuery.$gte = new Date(query.complete_gte));
                dbQuery.date = dateQuery;
            }
            
            const sort = {};
            if (query.sort) {
                switch (query.sort) {
                    case  'a-z':
                        sort.title = 1;
                        break;
                    case  'z-a':
                        sort.title = -1;
                        break;
                    case  'creation_date_oldest':
                        sort.created_at = 1;
                        break;
                    case  'creation_date_newest':
                        sort.created_at = -1;
                        break;
                    case  'completion_date_oldest':
                        sort.date = 1;
                        break;
                    case  'completion_date_newest':
                        sort.date = -1;
                }
            }
            
            const tasks = await taskSchema.find(dbQuery).sort(sort).exec();
            if (!tasks) throw errorConfig.taskNotFound;
    
            res.json(tasks);
        }
        catch (err) {
            next(err)
        }
    }
    
}

module.exports = new TaskController();
