const express = require('express');
const router = express.Router();
const data = require('../data');
const projectData = data.projects;
const userData = data.users;
const { ObjectId } = require('mongodb');
const statistics = require('../data/statistics');


router.get('/', async (req, res) => {
    const projectList = await projectData.getAllProjects();
    for (let project of projectList) {  // Replace the creator ID with the creator name
		const user = await userData.getUser(project.creator);
		project.creator = user.firstName + " " + user.lastName;
	}
    const canComment = req.session.user !== null;
	res.render('projects/index',{title: 'Projects', projects: projectList, canComment: canComment, user: req.session.user});
});

router.get('/new', async (req, res) => {
	res.render('projects/new',{title: 'New Project'});
});

router.get('/search',async(req,res)=>{
	res.render('projects/search',{title:'Search'});
})

router.post('/searchResult',async(req,res)=>{
	let searchProjectData = req.body;
	let errors = []
	if(!searchProjectData.category){
		errors.push('You must select a category to search');
	}
	if(searchProjectData.category == "<blank>"&&!searchProjectData.from&&!searchProjectData.to){
		errors.push('You need to have a range in Goal or select a category');
	}
	if(searchProjectData.from && searchProjectData.to && parseFloat(searchProjectData.from)>parseFloat(searchProjectData.to)){
		errors.push('From need to be less than To');
	}
	if(parseFloat(searchProjectData.from)<0 ||parseFloat(searchProjectData.to)<0){
		errors.push('Please provide postive number for search');
	}
	if(errors.length>0){
		res.render('projects/search',{title:'Search',hasErrors:true,errors:errors})
		return;
	}
	let projectList = []
	//this allows user to search by 1.(select one category),2.(enter a valid number either in From or in To, or both),3.(select one category and enter number)
	if(searchProjectData.category !=="<blank>"){
		projectList = await projectData.getProjectsByCategory(searchProjectData.category);
	}else{
		projectList = await projectData.getAllProjects();
	}
	let noResult=false;
	if(!noResult&&(searchProjectData.from||searchProjectData.to)){
		let lowerBound = null;
		if(searchProjectData.from){
			lowerBound = parseFloat(searchProjectData.from);
		}
		let higherBound = null;
		if(searchProjectData.to){
			higherBound = parseFloat(searchProjectData.to);
		}
			projectList = statistics.filterProjectsByGoal(projectList,lowerBound,higherBound);
		}
		if(projectList.length == 0){
			noResult = true;
		}else{
			for (let project of projectList) { 
				const user = await userData.getUser(project.creator);
				project.creator = user.firstName + " " + user.lastName;
			}
		}
		res.render('projects/searchresult',{title:'Search Result',projects:projectList,noResult:noResult});	
})
router.get('/:id', async (req, res) => {
	try {
		const project = await projectData.getProject(req.params.id);
		const user = await userData.getUser(project.creator);  // Get the user who created the campaign
		project.creator = user.firstName + " " + user.lastName;  // Replace the creator ID with the creator name
		for (let comment of project.comments) {  // Replace the commentator ID with the commentator name in each comment
			const commentator = await userData.getUser(comment.poster);
			comment.poster = commentator.firstName + " " + commentator.lastName;
		}
		const hasComments = project.comments.length !== 0;	
		if(req.session.user) {
			if(ObjectId(req.session.user.userId).equals(user._id))  // If the currently logged in user is the one who created the campaign
				res.render('projects/single',{project: project, comments: project.comments, hasComments: hasComments, canComment: true, canEdit: true});
			else
				// I can only donate to other users' campaigns
				res.render('projects/single',{project:project, comments: project.comments, hasComments: hasComments, canComment: true, canDonate: true});
		}
		else
			res.render('projects/single', {project: project, comments: project.comments, hasComments: hasComments});
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
		for(let eachDonatedProject of user.donated){
			let donatedProject = await projectData.getProject(eachDonatedProject.projectId);
			donatedProject.theUserDonatedAmount = eachDonatedProject.amount;
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
		//the reason to change this is because if a user without any project, it will get the error at "const projects = await projectData.getProjectsByUser()"
		//which throws an error without checking projects.length !== 0. What has been changed is the data/project getProjectsByUser
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

	if(!newProjectData.goal){
		errors.push('No pledge goal provided');
	}

	if(parseFloat(newProjectData.goal)<0){
		error.push('Pledge Goal need to be positive');
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
			new Date(), newProjectData.goal, newProjectData.description,0,[], [], true);
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
			updateProjectData.category, updateProjectData.goal, updateProjectData.description);
		res.redirect(`/projects/${updatedProject._id}`);
	} catch (e) {
		res.status(500).json({ error: e.toString() });
	}
});

router.post('/donate', async(req, res)=>{
	let donationData = req.body;
	if(!donationData.donation){
		res.redirect(`/projects/${donationData.project_id}`);
		return;
	}
	if(typeof(donationData.donation) !== 'number')
		donationData.donation = parseInt(donationData.donation);
	
	//console.log(typeof(donationData.project_id))

	try {
		await projectData.donateToProject(donationData.project_id, donationData.donation, req.session.user.userId);
		res.render('projects/result',{result: 'Donate successfully', projectId: donationData.project_id});
	}catch(e){
		res.status(500).json({ error: e.toString() });
	}
});

router.post('/comment', async (req, res) => {
	let commentInfo = req.body;
	let projectId = commentInfo.project_id;

	try {
		const newComment = await projectData.commentOnProject(projectId, req.session.user.userId, commentInfo.comment);
		res.redirect(`/projects/${projectId}`);
//Still have a bug in Ajax which not correctly handle the callback, now it still uses the previous version.
//		res.render('projects/comments',{layout:null, ...newComment});
	} catch (e) {
		res.status(500).json({ error: e.toString() });
	}
});


module.exports = router;