const express = require('express');
const app = express();
// const app1 = express();
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const session = require('express-session');

const handlebarsInstance = exphbs.create({
	defaultLayout: 'main',
	partialsDir: ['views/partials/']
});

function configApp(app, i) {
	app.use(
		session({
			name: 'CrowdFundingSession' + i,
			secret: "ssshhhhh",
			saveUninitialized: true,
			resave: false
		})
	);
	app.use('/public', static);
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.engine('handlebars', handlebarsInstance.engine);
	app.set('view engine', 'handlebars');
	app.set('views', __dirname + '/views');

	let redirectToSignIn = (req, res, next) => {
		if(!req.session.user)
			res.redirect('/users/signin');
		else
			next();
	};

	app.use('/projects/new', redirectToSignIn);
	app.use('/projects/search', redirectToSignIn);
	app.use('/projects/edit/:id', redirectToSignIn);
	app.use('/projects/searchResult', redirectToSignIn);
	app.use('/projects/deactivate/:id', redirectToSignIn);
	app.use('/projects/activate/:id', redirectToSignIn);

	app.use('/users/history/:creator', redirectToSignIn);

	configRoutes(app);
}

configApp(app, 1);
// configApp(app1, 2);

app.listen(3000, () => {
	console.log("We've now got a server!");
	console.log('Your routes will be running on http://localhost:3000');
});

// app1.listen(2000, () => {
// 	console.log("Started server on 2000");
// });
