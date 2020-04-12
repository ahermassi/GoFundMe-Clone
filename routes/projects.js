const express = require('express');
const router = express.Router();
const data = require('../data');
const projectData = data.projects;
const userData = data.users;

router.get('/',async(req,res)=>{
    const projectList = await projectData.getAllProjects();
    for (let project of projectList) {  // Replace the creator ID with the creator name
		const user = await userData.getUser(project.creator);
		project.creator = user.firstName;
	}
	res.render('projects/index',{title: 'Projects', projects: projectList});
});

router.get('/:id', async (req, res) => {
	try {
		const project = await projectData.getProject(req.params.id);
		const user = await userData.getUser(project.creator);
		project.creator = user.firstName;  // Replace the creator ID with the creator name
		res.render('projects/single', { project: project });
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

router.get('/new',async(req,res)=>{
	const users = await userData.getAllUsers();
	res.render('projects/new',{});
});


// router.post('/', async (req, res) => {
// 	let newProjectData = req.body;
// 	let errors = [];

// 	if (!newProjectData.title) {
// 		errors.push('No title provided');
// 	}

// 	if (!newProjectData.description) {
// 		errors.push('No description provided');
// 	}

// 	if (!newProjectData.category) {
// 		errors.push('No category provided');
//     }
    
//     if (!newProjectData.creator){
//         errors.push('No creator provided')
//     }

//     if(!newProjectData.goal){
//         errors.push('No goal provided')
//     }

// 	if (errors.length > 0) {
// 		const users = await userData.getAllUsers();
// 		res.render('projects/new', {
// 			errors: errors,
// 			hasErrors: true,
// 			project: newProjectData,
// 		});
// 		return;
// 	}

// 	try {
//         const newProject = await newProjectData.addProject(newProjectData.title,newProjectData.category,newProjectData.creator,new Date(),
//             newProjectData.goal,0,[],newProjectData.description)

// 		res.redirect(`/projects/${newProject._id}`);
// 	} catch (e) {
// 		res.status(500).json({ error: e });
// 	}
// });

module.exports = router;