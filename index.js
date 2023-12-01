const express = require("express");
const session = require('express-session')
const cors = require('cors')
const passportSetup = require('./passport')
const passport = require('passport')
const authRoute = require("./routes/auth")
const bodyParser = require('body-parser')


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session(
    {
        secret: "secret-key",
        resave: false,
        saveUninitialized: false,
    }
))

app.use(passport.initialize())
app.use(passport.session())

app.use(cors({
	origin:"http://localhost:3000",
	methods: "GET, POST, PUT, DELETE",
	credentials: true,
})
)

app.use(authRoute)

app.get('/test', function(request, response) {
	response.type('text/plain')
	response.send('Node.js and Express running on port='+port)
})


const port = process.env.PORT || 3000
app.listen(port, function() {
	console.log("Server is running at http://localhost:3000/")
})


app.use(express.static(__dirname + '/client'))