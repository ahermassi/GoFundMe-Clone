const express = require('express');
const router = express.Router();
const data = require('../data');
const projectData = data.projects;
const userData = data.users;

router.get('/', async (req, res) => {
    const projectList = await projectData.getAllProjects();
    for (let project of projectList) {  // Replace the creator ID with the creator name
		const user = await userData.getUser(project.creator);
		project.creator = user.firstName;
	}
	res.render('projects/index',{title: 'Projects', projects: projectList, user: req.session.user});
});

router.get('/new', async (req, res) => {
	res.render('projects/new',{title: 'New Project'});
});

router.get('/:id', async (req, res) => {
	try {
		const project = await projectData.getProject(req.params.id);
		const user = await userData.getUser(project.creator);
		project.creator = user.firstName;  // Replace the creator ID with the creator name
		res.render('projects/single', { project: project });
	} catch (e) {
		res.status(500).json({ error: e.toString() });
	}
});

router.get('/user/:creator', async (req, res) => {
	try {
		const projects = await projectData.getProjectsByUser(req.params.creator);
		res.render('projects/myprojects', { title: 'My Projects', hasProjects: projects.length !== 0, projects: projects });
	} catch (e) {
		res.status(500).json({ error: e.toString() });
	}
});

router.post('/', async (req, res) => {
	let newProjectData = req.body;
	let errors = [];

	if (!newProjectData.title) {
		errors.push('No title provided');
	}

	if (!newProjectData.category) {
		errors.push('No category provided');
	}

	if(!newProjectData.goal){
		errors.push('No pledge goal provided')
	}

	if (newProjectData.description.length === 0) {
		errors.push('No description provided');
	}

	if (errors.length > 0) {
		res.render('projects/new', {
			errors: errors,
			hasErrors: true,
			project: newProjectData,
		});
		return;
	}

	try {
		const projectCreator = req.session.user.userId;
        const newProject = await projectData.addProject(newProjectData.title, newProjectData.category, projectCreator,
			new Date(), newProjectData.goal, newProjectData.description);
		res.redirect(`/projects/${newProject._id}`);
	} catch (e) {
		res.status(500).json({ error: e.toString() });
	}
});

module.exports = router;