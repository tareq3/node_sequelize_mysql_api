const Sequelize = require('sequelize');

const sequelize = require('../../../startup/dbconfig');

const Joi = require('joi');

const Movie = sequelize.define('movie', {
    name: {
        type: Sequelize.STRING
    },
    released_on: {
        type: Sequelize.DATE

    },

});

function validate(req) {

    const schema = {
        name: Joi.string().min(2).max(100).required(),
        released_on: Joi.date().min('2000-01-01').required()

    };

    return Joi.validate(req, schema);

}

module.exports.movieModel = Movie;
module.exports.validateMovie = validate;