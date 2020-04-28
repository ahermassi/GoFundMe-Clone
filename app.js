const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const session = require('express-session');

app.use(
	session({
		name: 'CrowdFundingSession',
		secret: "ssshhhhh",
		saveUninitialized: true,
		resave: false
	})
);
app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.use(async(req, res, next) => {
    console.log('Current Timestamp is', new Date().toUTCString())
    console.log('Request Method is', req.method)
    console.log('Request Route is', req.originalUrl)
    if (req.session.user){
        console.log('user is authenticated')
    }
    else{
        console.log('user is not authenticated')
    }
    next();

});

configRoutes(app);

app.listen(3000, () => {
	console.log("We've now got a server!");
	console.log('Your routes will be running on http://localhost:3000');
});