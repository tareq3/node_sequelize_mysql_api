const Sequelize = require("sequelize"); //ORM for mysql
const config = require("config"); //config for config check

const sequelize = new Sequelize(
  config.get("dbName"),
  config.get("dbUserName"),
  config.get("dbUserPassword"),
  {
    host: config.get("dbHost"), //get host paremeter
    dialect: "mysql",
    operatorsAliases: false,

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Or you can simply use a connection uri
//const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');

// if the table not present following line will create the table
sequelize.sync({
  force: false
});

//Test DB Connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = sequelize; //return sequelize object that handles db queries
