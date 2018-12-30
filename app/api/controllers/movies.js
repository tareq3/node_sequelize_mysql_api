const {
    movieModel,
    validateMovie
} = require('../models/movies');

module.exports = {
    create: async (req, res, next) => {

        //For cheaking the validation using Joi 
        console.log(req.body);
        const {
            error
        } = validateMovie(req.body);
        if (error) return res.status(400).send(error.details[0].message);






        try {
            //cheaking is there any data already exists
            let movie = await movieModel.findOne({
                where: {
                    name: req.body.name
                }
            });
            if (movie) return res.status(400).send('movie already registered');




            const result = await movieModel.create({
                name: req.body.name,
                released_on: req.body.released_on

            });

            //sending response back to user
            res.json({
                status: "success",
                message: "Movie added successfully!!!",
                data: result
            });
        } catch (error) {
            next(error);
        }
    },
    getAll: async (req, res, next) => {
        let moviesList = []; //letting an empty array list

        try {
            const result = await movieModel.findAll();

            //adding movies to array list
            for (let movie of result) {
                moviesList.push({
                    id: movie.id,
                    name: movie.name,
                    released_on: movie.released_on
                });
            }
            //sending response as json 
            res.json({
                status: "success",
                message: "Movies list found!!!",
                data: {
                    movies: moviesList
                }
            });
        } catch (error) {
            next(error);
        }
    },
    getById: async function (req, res, next) {

        try {

            const movieInfo = await movieModel.findByPk(req.params.movieId);

            if (!movieInfo) return res.status(400).send("Movie Id doesn't match");

            //sending json response to route
            res.json({
                status: "success",
                message: "Movie found!!!",
                data: {
                    movies: movieInfo
                }
            });

        } catch (err) {
            next(err);
        }
    },
    updateById: async function (req, res, next) {

        try {
            const movieInfo = await movieModel.findByPk(req.params.movieId);

            if (!movieInfo) return res.status(400).send("Movie Id doesn't match");

            movieInfo.update({
                name: req.body.name,
                released_on: req.body.released_on

            });

            if (movieInfo === null) {
                res.json({
                    status: "error",
                    message: "Data not found",
                    data: movieInfo
                });
            } else {
                res.json({
                    status: "success",
                    message: "Movie updated successfully!!!",
                    data: null
                });
            }
        } catch (error) {
            next(err); //sending error to route using next
        }
    },
    deleteById: async function (req, res, next) {

        try {
            const movieInfo = await movieModel.findById(req.params.movieId);

            if (!movieInfo) return res.status(400).send("Movie Id doesn't match");
            7
            if (movieInfo === null) {
                res.json({
                    status: "error",
                    message: "Data not found",
                    data: movieInfo
                });
            } else {

                //delete the data
                const result = await movieInfo.destroy();


                res.json({
                    status: "success",
                    message: "Movie deleted successfully!!!",
                    data: result
                });
            }

        } catch (error) {
            next(error); //sending error to route using next
        }

    },
}