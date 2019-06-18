const Sequelize = require('sequelize');

const sequelize = require('../../../startup/dbconfig')



const Joi = require('joi'); // joi for validation
const bcrypt = require('bcryptjs'); //for password Hash

const saltRounds = 10; //for round for bCrypt hash It can be set to config

const User = sequelize.define('user', {
    /*    id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV1,
		primaryKey: true
	  },
     */
    name: {
        type: Sequelize.STRING,
        allowNull: false,


    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false
    },
    token: {
        type: Sequelize.STRING,
        allowNull: true
    }
});


//It's like pre method in mongoose
User.beforeCreate((user) => {

    return bcrypt.hash(user.password, saltRounds)
        .then(hashCode => {
            user.password = hashCode;
        })
        .catch(err => {
            throw new Error();
        });
});

//validate sign up/ register
function validateRegisterUser(req) { //passing request values 
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(250).required().email(),
        password: Joi.string().min(8).max(255).required(),

    };
    return Joi.validate(req, schema); //comparing req values with schema
}

//validate sign-in 
function validateLoginUser(req) { //passing request values 
    const schema = {
        email: Joi.string().min(5).max(250).required().email(),
        password: Joi.string().min(8).max(255).required(),

    };
    return Joi.validate(req, schema); //comparing req values with schema
}

module.exports.userModel = User;
module.exports.validateRegisterUser = validateRegisterUser;
module.exports.validateLoginUser = validateLoginUser;