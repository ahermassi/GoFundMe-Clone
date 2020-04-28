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
		if(req.session.user){
			if(ObjectId(req.session.user.userId).equals(user._id)){
				res.render('projects/single',{project:project,auth_creator:true});
			}else{
				res.render('projects/single',{project:project,auth_user:true});
			}
		}else{
			res.render('projects/single', { project: project });
		}
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
		res.redirect(`/projects/${updatedProject._id}`);
	}catch(e){
		res.status(500).json({ error: e.toString() });
	}
});

module.exports = router;