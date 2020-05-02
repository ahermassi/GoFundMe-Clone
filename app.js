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

app.use('/projects/new', (req, res, next) => {
	if(!req.session.user)
		res.redirect('/users/signin');
	else
		next();
});

//Avoid non auth user enter /projects/user/userid to get into others' my project page
 app.use('/projects/user/:creator', (req, res, next) => {
	if(req.session.user){
 		next();
 	}else{
 		return res.redirect('/users/signin');
 	}
 })

app.use('/projects/edit',(req, res, next) => {
	if(!req.session.user)
		res.redirect('/users/signin');
	else
		next();
});

configRoutes(app);

app.listen(3000, () => {
	console.log("We've now got a server!");
	console.log('Your routes will be running on http://localhost:3000');
});