const postRoutes = require('./projects');
const userRoutes = require('./users');
const path = require('path');

const constructorMethod = (app) => {
	app.use('/projects', postRoutes);
	app.use('/users', userRoutes);
	app.use('*', (req, res) => {
		res.redirect('/projects');
	});
};

module.exports = constructorMethod;