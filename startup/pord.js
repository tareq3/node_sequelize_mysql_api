const helmet = require('helmet');
const compression = require('compression');
//this modules are for security purposes
module.exports = function (app) {
    app.use(helmet());
    app.use(compression());
}