const express = require('express');
const router = express.Router();
const data = require('../data');
const projectData = data.projects;
const userData = data.users;
const { ObjectId } = require('mongodb');


router.get('/', async (req, res) => {
    const projectList = await projectData.getAllProjects();
    for (let project of projectList) {  // Replace the creator ID with the creator name
		const user = await userData.getUser(project.creator);
		project.creator = user.firstName + " " + user.lastName;
	}
	res.render('projects/index',{title: 'Projects', projects: projectList, user: req.session.user});
});

router.get('/new', async (req, res) => {
	res.render('projects/new',{title: 'New Project'});
});

router.get('/:id', async (req, res) => {
	try {
		const project = await projectData.getProject(req.params.id);
		const user = await userData.getUser(project.creator);  // Get the user who created the campaign
		project.creator = user.firstName + " " + user.lastName;  // Replace the creator ID with the creator name
		if(req.session.user) {
			if(ObjectId(req.session.user.userId).equals(user._id))  // If the currently logged in user is the one who created the campaign
				res.render('projects/single',{project: project});
			else
				res.render('projects/single',{project:project, can_donate: true});  // I can only donate to other users' campaigns
		}
		else
			res.render('projects/single', {project: project});
	} catch (e) {
		res.status(500).json({ error: e.toString() });
	}
});

router.get('/user/:creator', async (req, res) => {
	// List the campaigns created by the user whose ID is 'creator' as well as the campaigns to which this user donated
	try {
		const projects = await projectData.getProjectsByUser(req.params.creator);
		const user = await userData.getUser(req.params.creator);
		let donated = [];
		for(let projectId of user.donated){
			let donatedProject = await projectData.getProject(projectId);
			donated.push(donatedProject);
		}
		let hasDonated = donated.length !== 0;
		for(let project of donated){
			let user = await userData.getUser(project.creator);
			project.creator = user.firstName + " " + user.lastName;
		}
		res.render('projects/myprojects', {title: 'My Projects', hasProjects: projects.length !== 0, projects: projects,
			hasDonated: hasDonated, donated: donated});
	} catch (e) {
		res.render('projects/myprojects', { title: 'My Projects', hasProjects: false });
	}
});

router.get('/edit/:id', async (req, res) => {
	try {
		const project = await projectData.getProject(req.params.id);
		res.render('projects/edit', {title: 'Edit Project', project: project});
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
        const newProject = await projectData.addProject(newProjectData.title, newProjectData.category, ObjectId(projectCreator),
			new Date(), newProjectData.goal, newProjectData.description,0,[],true);
		res.redirect(`/projects/${newProject._id}`);
	} catch (e) {
		res.status(500).json({ error: e.toString() });
	}
});

router.post('/edit', async (req, res) => {
	let updateProjectData = req.body;
	let errors = [];

	if (!updateProjectData.title) {
		errors.push('No title provided');
	}

	if (!updateProjectData.category) {
		errors.push('No category provided');
	}

	if(!updateProjectData.goal){
		errors.push('No pledge goal provided')
	}

	if (updateProjectData.description.length === 0) {
		errors.push('No description provided');
	}

	if (errors.length > 0) {
		res.render('projects/edit', {
			errors: errors,
			hasErrors: true,
			project: updateProjectData,
		});
		return;
	}

	try {
		const updatedProject = await projectData.updateProject(updateProjectData.id, updateProjectData.title,
			updateProjectData.category, ObjectId(req.session.user.userId), updateProjectData.date, updateProjectData.goal, updateProjectData.description);
		res.redirect(`/projects/${updatedProject._id}`);
	} catch (e) {
		res.status(500).json({ error: e.toString() });
	}
});

router.post('/donate',async(req,res)=>{
	let updateProjectData = req.body;
	if(!updateProjectData.donate){
		res.redirect(`/projects/${updateProjectData.id}`);
		return;
	}
	if(typeof(updateProjectData.donate)!=='number'){
		updateProjectData.donate = parseInt(updateProjectData.donate)
	}
	try{
		const updatedProject = await projectData.donateProject(updateProjectData.id,updateProjectData.donate,req.session.user.userId);
		res.render('projects/result',{result:'Donate successfully',projectid:updateProjectData.id});
	}catch(e){
		res.status(500).json({ error: e.toString() });
	}
});

module.exports = router;