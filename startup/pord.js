//Helmet helps you secure your Express apps by setting various HTTP headers.
const helmet = require("helmet");
//compress response bodies for all request that traverse through the middleware,
const compression = require("compression");

//this modules are for security purposes
//initialize helmet and compression
module.exports = function(app) {
  app.use(helmet());
  app.use(compression());
};

//Basically this middleware are in this file cause they really work for production env not for development env.
