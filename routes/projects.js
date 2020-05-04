const express = require('express');
const router = express.Router();
const data = require('../data');
const projectData = data.projects;
const userData = data.users;
const { ObjectId } = require('mongodb');
const statistics = require('../data/statistics');


String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

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

router.get('/search', async (req, res) => {
	res.render('projects/search', {title: 'Search'});
});

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
		res.render('projects/my-projects', {title: 'My Projects', hasProjects: projects.length !== 0, projects: projects,
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
        const newProject = await projectData.addProject(newProjectData.title, newProjectData.category.capitalize(), projectCreator,
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
		const commentator = await userData.getUser(newComment.poster);
		newComment.poster = commentator.firstName + " " + commentator.lastName;
		res.render('partials/comments', {layout:null, ...newComment});
	} catch (e) {
		res.status(500).json({ error: e.toString() });
	}
});

router.post('/searchResult', async (req, res) => {
	let searchProjectData = req.body;
	let errors = [];

	if(searchProjectData.from_pledged && searchProjectData.to_pledged &&
		parseFloat(searchProjectData.from_pledged) > parseFloat(searchProjectData.to_pledged))
		errors.push('Pledge goal lower bound can\'t be greater than its upper bound');

	if(searchProjectData.from_collected && searchProjectData.to_collected &&
		parseFloat(searchProjectData.from_collected) > parseFloat(searchProjectData.to_collected))
		errors.push('Collected amount lower bound can\'t be greater than its upper bound');

	if(parseFloat(searchProjectData.from_pledged) < 0)
		errors.push('Please enter a positive number in pledge goal lower bound');

	if(parseFloat(searchProjectData.to_pledged) < 0)
		errors.push('Please enter a positive number in pledge goal upper bound');

	if(parseFloat(searchProjectData.from_collected) < 0)
		errors.push('Please enter a positive number in collected amount lower bound');

	if(parseFloat(searchProjectData.to_collected) < 0)
		errors.push('Please enter a positive number in collected amount upper bound');

	if(errors.length > 0) {
		res.render('projects/search',{title:'Search', hasErrors: true, errors: errors, searchProjectData: searchProjectData});
		return;
	}

	let projectsByCategory, projectsByPledgeGoal = [], projectsByCollectedAmount = [];

	// This allows user to search by:
	// 1- selecting a category
	// 2- entering a valid number in either From or To, or both
	// 3- selecting a category and entering a range bounds
	// 4- default which fetches all the projects

	if(searchProjectData.category !== "none")
		projectsByCategory = await projectData.getProjectsByCategory(searchProjectData.category.capitalize());
	else
		projectsByCategory = await projectData.getAllProjects();

	if(searchProjectData.from_pledged || searchProjectData.to_pledged) {
		let pledgeLowerBound = null, pledgeHigherBound = null;
		if(searchProjectData.from_pledged)
			pledgeLowerBound = parseFloat(searchProjectData.from_pledged);

		if(searchProjectData.to_pledged)
			pledgeHigherBound = parseFloat(searchProjectData.to_pledged);

		projectsByPledgeGoal = statistics.filterProjectsByPledgeGoal(projectsByCategory, pledgeLowerBound, pledgeHigherBound);
	}

	if(searchProjectData.from_collected || searchProjectData.to_collected) {
		let collectedLowerBound = null, collectedHigherBound = null;
		if(searchProjectData.from_collected)
			collectedLowerBound = parseFloat(searchProjectData.from_collected);

		if(searchProjectData.to_collected)
			collectedHigherBound = parseFloat(searchProjectData.to_collected);

		projectsByCollectedAmount = statistics.filterProjectsByCollectedAmount(projectsByCategory, collectedLowerBound, collectedHigherBound);
	}
	let results = [];
	for (let project of projectsByCategory) {
		// Projects in projectsByCategory are the search results before filtering. A project is included in the final
		// search results if and only if it appears in projectsByPledgeGoal and projectsByCollectedAmount.
		// However, projectsByPledgeGoal (respectively projectsByCollectedAmount) can be empty for 2 different reasons:
		// 1- The search didn't return any results
		// 2- The user didn't supply any lower/upper bound values
		// Therefore, deciding whether a project X should be included in the final results' list boils down to checking
		// if X can be found in projectsByPledgeGoal and projectsByCollectedAmount if the user supplied search criteria.
		let projectInPledged, projectInCollected;
		if (projectsByPledgeGoal.length > 0)
			projectInPledged = projectsByPledgeGoal.includes(project);
		else
			projectInPledged = !searchProjectData.from_pledged && !searchProjectData.to_pledged;
		if (projectsByCollectedAmount.length > 0)
			projectInCollected = projectsByCollectedAmount.includes(project);
		else
			projectInCollected = !searchProjectData.from_collected && !searchProjectData.to_collected;
		if (projectInPledged && projectInCollected)
			results.push(project);
	}
	let resultsExist = true;
	if (results.length === 0)
		resultsExist = false;
	else {
		for (let project of results) {
			const user = await userData.getUser(project.creator);
			project.creator = user.firstName + " " + user.lastName;
		}
	}
	res.render('projects/search-result',{title:'Search Result', projects: results, resultsExist: resultsExist});
});


module.exports = router;