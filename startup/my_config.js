const my_config = require("config"); //config provide

//provide privatekey setted or not error
module.exports = () => {
  if (!my_config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
  }
};
