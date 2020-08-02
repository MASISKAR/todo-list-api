const userSchema = require('../schemas/user.schema'),
 tokenSchema = require('../schemas/token.schema'),
 bcrypt = require('bcryptjs'),
        crypto = require('crypto'),
        jwt = require('jsonwebtoken'),
        errorConfig = require('../../config/error.config'),
        authConfig = require('../../config/auth.config'),
        ObjectId = require('mongoose').Types.ObjectId;

class UserController {
    
    create = async (req, res, next) => {
        try {
            const data = req.body;
            const isUserExist = await userSchema.findOne({email: data.email});
            if (isUserExist) throw errorConfig.userExists;
    
            const pass = await this.generatePassHash(data.password);
    
            const newUser = {
                email: data.email,
                password: pass,
                name: data.name,
                surname: data.surname,
            };
    
            const user = await new userSchema(newUser).save();
            res.json({_id: user._id});
        }
        catch (err) {
            next(err);
        }
    }
    
    signIn = async (req, res, next)=> {
        try {
            const data = req.body;
            const user = await userSchema.findOne({email: data.email});
            if (!user) throw errorConfig.emailOrPasswordNotFound;
    
            const match = await bcrypt.compare(authConfig.pass.prefix + data.password, user.password);
            if (!match) throw errorConfig.emailOrPasswordNotFound;
    
            const token = await this.generateJWT({userId: user._id});
            const tokenModel = new tokenSchema({
                owner: user._id,
                refreshToken: token.refreshToken,
                jwt: token.jwt
            });
            
            await tokenModel.save();
            res.json(token);
        }
        catch (err) {
            res.status(403).json(err);
        }
    }
    
    signOut = (req, res, next) => {
        tokenSchema
        .remove({jwt: req.body.jwt})
        .then(result => {
            if(!result.deletedCount) throw errorConfig.defaultError;
            res.json();
        })
        .catch(err => next(err));
    }
    
    getInfo = (req, res, next) => {
        return userSchema
        .findById(ObjectId(res.locals.userId))
        .select('_id name surname avatar')
        .then(data => res.json(data))
        .catch(err => next(err));
    }
    
    update = (req, res, next) => {
        const data = req.body;
        // if (req.images && req.images[0]) data.avatar = req.images[0].fileName;
        return userSchema
        .findById(res.locals.userId)
        .then(async user => {
            if (!user) throw errorConfig.userNotFound;
            if (data.name) user.name = data.name;
            if (data.surname) user.surname = data.surname;
            if (data.avatar) user.avatar = data.avatar;
            return user.save();
        })
        .then(data => {
            data = JSON.parse(JSON.stringify(data));
            delete data.email;
            delete data.password;
            res.json(data);
        })
        .catch(err => next(err));
    }
    
    
    /**
     * Update jwt
     * @param  {Object} req - request object
     * @param  {Object} res - response data and methods
     * @param  {Function} next - pass request to next endpoint
     **/
    // token_update(req, res, next) {
    //   user_model.token_update(req.params.id, req.body)
    //   .then(token => res.json(token))
    //   .catch(err => next(err));
    // }
    //fixme
    
    /**
     * @param password
     * @returns {*}
     */
    generatePassHash = password => bcrypt.hash(authConfig.pass.prefix + password, authConfig.pass.salt_rounds);
    
    generateToken = (length = 12) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(length, (err, buffer) => {
                if (err) return reject(err);
                return resolve(buffer.toString('hex'));
            });
        });
    }
    
    generateJWT = payload => {
        return Promise.try(() => jwt.sign(
                {...payload, timestamp: Date.now()},
                authConfig.jwt.secret,
                {expiresIn: authConfig.jwt.exp}
        ))
        .then(async jwt => {
            const refreshToken = await this.generateToken(authConfig.refreshToken.size);
            return {jwt, refreshToken};
        });
    }
}

module.exports = new UserController();
