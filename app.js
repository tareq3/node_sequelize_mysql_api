const express = require('express');
const bodyParser = require('body-parser');
const logger = require("morgan");
const auth = require('./middleware/auth');




const app = express();

///Init Startup files

require('./startup/config');
require('./startup/dbconfig');
require('./startup/pord')(app);


app.use(logger("dev"));

// parse application/x-www-form-urlencoded
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);




// parse application/json
app.use(bodyParser.json())


/* *****************   Index Route ************ */
app.get("/", (req, res) => {
    res.send('This is the index page of this server');

});

//public route
app.use('/users', require('./routes/users'));

// private route
app.use("/movies", auth, require('./routes/movies'));

app.get("/favicon.ico", (req, res) => {
    res.sendStatus(204);
});


// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
app.use((req, res, next) => {
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
});
// handle errors
app.use((err, req, res, next) => {
    console.log(err);

    if (err.status === 404)
        res.status(404).json({
            message: "Not found"
        });
    else
        res.status(500).json({
            message: "Something looks wrong :( !!!"
        });
});


/* ************* Start Listening **************** */
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.listen(app.get('port'), () => {
    console.log("Node app is running at localhost:" + app.get('port'))
});