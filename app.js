const express = require("express"); //for express framework
const bodyParser = require("body-parser"); //bodyParser for parsing body data from api request
const logger = require("morgan"); //morgar for loggin
const auth = require("./middleware/auth"); //for auth security check

const app = express(); //express function return app object that provide all route functions

///Init Startup files
require("./startup/my_config"); //check either every config paremeter setted successfully
require("./startup/dbconfig"); //configure Database ORm
require("./startup/pord")(app); //initialize helmet and compress for production deployment

app.use(logger("dev")); //initialzie logger middleware

//initialize bodyParser
// parse application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
// parse application/json
app.use(bodyParser.json());

/* *****************   Index Route ************ */
app.get("/", (req, res) => {
  res.send("This is the index page of this server");
});

//public route
app.use("/users", require("./routes/users"));

// private route
app.use("/movies", auth, require("./routes/movies")); //private route need auth middleware

app.get("/favicon.ico", (req, res) => {
  res.sendStatus(204);
});

// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error middleware func
app.use((req, res, next) => {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// handle errors
app.use((err, req, res, next) => {
  console.log(err);

  if (err.status === 404) {
    res.status(404).json({
      message: "Not found"
    });
  } else {
    res.status(500).json({
      message: "Something looks wrong :( !!!"
    });
  }
});

/* ************* Start Listening **************** */
//setting port variable of express
app.set("port", process.env.PORT || 5000); //looking for the env variable PORT, if it found not setted use 5000

app.use(express.static(__dirname + "/public")); //this line will show static html page in public folder for default path

//listening to the port and in callback returning server is running on that port or not
app.listen(app.get("port"), () => {
  console.log("Node app is running at localhost:" + app.get("port"));
});
