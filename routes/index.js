const projectRoutes = require('./projects');
const userRoutes = require('./users');

const constructorMethod = (app) => {
	app.use('/projects', projectRoutes);
	app.use('/users', userRoutes);
	app.use('*', (req, res) => {
		res.redirect('/projects');
	});
};

module.exports = constructorMethod;