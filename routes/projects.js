const express = require('express');
const router = express.Router();
const data = require('../data');
const projectData = data.projects;
const userData = data.users;
const { ObjectId } = require('mongodb');
const utilities = require('../public/js/utilities');
const xss = require('xss');

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

router.get('/', async (req, res) => {
    let projectList = await projectData.getAllProjects();
    for (let project of projectList)
		projectList[projectList.findIndex(obj => obj._id === project._id)] = await utilities.formatProjectFields(project._id);
    let projectsByCreationDate, projectsByCollectedAmount;
	if(projectList.length > 0) {
		projectsByCreationDate = utilities.sortProjectsByCreationDate(projectList);
		projectsByCollectedAmount = utilities.sortProjectsByCollectedAmount(projectList);
	}
	const isLogged = req.session.user ? true : false;
	res.render('projects/index',{title: 'Home', projectsByCreationDate: projectsByCreationDate,
		projectsByCollectedAmount: projectsByCollectedAmount, logged: isLogged, user: req.session.user});
});

router.get('/new', async (req, res) => {
	res.render('projects/new',{title: 'New Project', logged: true, user: req.session.user});
});

router.get('/search', async (req, res) => {
	res.render('projects/search', {title: 'Search', logged: true, user: req.session.user});
});

router.get('/:id', async (req, res) => {
	try {
		let project = await projectData.getProject(req.params.id);
		const user = await userData.getUser(project.creator);
		project = await utilities.formatProjectFields(req.params.id);
		await utilities.fillCommentatorName(project);
		const openToDonations = project.active;  // A user can only donate if the project is active
		const hasComments = project.comments.length !== 0;	
		let canComment = false;
		let canEdit = false;
		let logged = false;
		let canDonate = false;
		if(req.session.user){
			canComment = true;
			logged = true;
			if(ObjectId(req.session.user.userId).equals(user._id)){
				canEdit = true;
			}else{
				canDonate = true;
			}
		}
		res.render('projects/single',{project: project, title: project.title, comments: project.comments, hasComments: hasComments,
			canComment: canComment, canEdit: canEdit, canDonate:canDonate,openToDonations: openToDonations,
			logged: logged, user: req.session.user});
	} catch (e) {
		res.status(500).json({ error: e.toString() });
	}
});

router.get('/edit/:id', async (req, res) => {
	const project = await projectData.getProject(req.params.id);
	// I can't edit a campaign I don't own
	if (project.creator !== req.session.user.userId) {
		res.redirect('/projects');
		return;
	}
	try {
		const project = await projectData.getProject(req.params.id);
		res.render('projects/edit', {title: 'Edit Project', project: project, logged: true, user: req.session.user});
	} catch (e) {
		res.status(500).json({ error: e.toString() });
	}
});

router.post('/', async (req, res) => {
	let newProjectData = req.body;
	let errors = [];

	if (!newProjectData.title)
		errors.push('No title provided');

	if(!newProjectData.goal)
		errors.push('No pledge goal provided');

	if (newProjectData.goal) {
		if (isNaN(newProjectData.goal))
			errors.push('Pledge goal needs to be a number');
		else if (parseFloat(newProjectData.goal) <= 0)
			errors.push('Pledge goal needs to be greater than zero');
	}

	if (newProjectData.description.length === 0)
		errors.push('No description provided');

	if (errors.length > 0) {
		res.render('projects/new', {
			errors: errors,
			hasErrors: true,
			project: newProjectData,
			logged: true,
			user: req.session.user
		});
		return;
	}

	try {
		const projectCreator = req.session.user.userId;
        const newProject = await projectData.addProject(xss(newProjectData.title), xss(newProjectData.category.capitalize()),
			projectCreator, new Date(), parseFloat(xss(newProjectData.goal)), xss(newProjectData.description),0,[],
			[], true);
		res.redirect(`/projects/${newProject._id}`);
	} catch (e) {
		res.status(500).json({ error: e.toString() });
	}
});

router.post('/edit', async (req, res) => {
	let updateProjectData = req.body;
	let errors = [];

	if (!updateProjectData.title)
		errors.push('No title provided');

	if (!updateProjectData.category)
		errors.push('No category provided');

	if(!updateProjectData.goal)
		errors.push('No pledge goal provided');

	if (updateProjectData.goal) {
		if (isNaN(updateProjectData.goal))
			errors.push('Pledge goal needs to be a number');
		else if (parseFloat(updateProjectData.goal) <= 0)
			errors.push('Pledge goal needs to be greater than zero');
	}

	if (updateProjectData.description.length === 0)
		errors.push('No description provided');

	if (errors.length > 0) {
		res.render('projects/edit', {
			title: 'Edit Project',
			errors: errors,
			hasErrors: true,
			project: updateProjectData,
			logged: true,
			user: req.session.user
		});
		return;
	}

	try {
		const updatedProject = await projectData.updateProject(xss(updateProjectData.id), xss(updateProjectData.title),
			xss(updateProjectData.category.capitalize()), parseFloat(xss(updateProjectData.goal)), xss(updateProjectData.description));
		res.redirect(`/projects/${updatedProject._id}`);
	} catch (e) {
		res.status(500).json({ error: e.toString() });
	}
});

router.post('/donate', async(req, res) => {
	let donationData = req.body;
	let errors = [];

	if(!donationData.donation)
		errors.push('Donation needs to have a value');

	if (donationData.donation) {
		if (isNaN(donationData.donation))
			errors.push('Donation needs to be a number');
		if (parseFloat(donationData.donation) <= 0)
			errors.push('Donation needs to be greater than zero');
	}

	if (errors.length > 0) {
		try {
			const project = await utilities.formatProjectFields(donationData.project_id);
			await utilities.fillCommentatorName(project);
			const hasComments = project.comments.length !== 0;
			res.render('projects/single', {
				title: project.title, project: project, comments: project.comments, hasComments: hasComments,
				canComment: true, canDonate: true, openToDonations: true, errors: errors, hasErrors: true,
				logged: true, user: req.session.user
			});
			return;
		} catch (e) {
			res.status(500).json({ error: e.toString() });
		}
	}

	try {
		await projectData.donateToProject(xss(donationData.project_id), parseFloat(xss(donationData.donation)), req.session.user.userId);
		let project = await projectData.getProject(xss(donationData.project_id));
		project = await utilities.formatProjectFields(project._id);
		await utilities.fillCommentatorName(project);
		const d = {totalDonors: project.donations.length};
		res.render('partials/donation-successful', {layout:null, user: req.session.user, ...d});
	}catch(e){
		res.status(500).json({ error: e.toString() });
	}
});

router.post('/comment', async (req, res) => {
	let commentInfo = req.body;
	let projectId = xss(commentInfo.project_id);

	try {
		const newComment = await projectData.commentOnProject(projectId, req.session.user.userId, xss(commentInfo.comment));
		const commentator = await userData.getUser(newComment.poster);
		newComment.poster = commentator.firstName + " " + commentator.lastName;
		res.render('partials/comments', {layout:null, ...newComment, logged: true, user: req.session.user});
	} catch (e) {
		res.status(500).json({ error: e.toString() });
	}
});

router.post('/searchResult', async (req, res) => {
	let searchProjectData = req.body;
	let errors = [];
	const isLogged = req.session.user != null;

	if(isNaN(searchProjectData.from_pledged))
		errors.push('Pledge goal lower bound needs to be a number');
	else if(parseFloat(searchProjectData.from_pledged) < 0)
		errors.push('Pledge goal lower bound needs to be positive');

	if(isNaN(searchProjectData.to_pledged))
		errors.push('Pledge goal upper bound needs to be a number');
	else if(parseFloat(searchProjectData.to_pledged) < 0)
		errors.push('Pledge goal upper bound needs to be positive');

	if(isNaN(searchProjectData.from_collected))
		errors.push('Collected amount lower bound needs to be a number');
	else if(parseFloat(searchProjectData.from_collected) < 0)
		errors.push('Collected amount lower bound needs to be positive');

	if(isNaN(searchProjectData.to_collected))
		errors.push('Collected amount upper bound needs to be a number');
	else if(parseFloat(searchProjectData.to_collected) < 0)
		errors.push('Collected amount upper bound needs to be positive');

	if(!isNaN(searchProjectData.from_pledged) && !isNaN(searchProjectData.to_pledged) &&
		parseFloat(searchProjectData.from_pledged) > parseFloat(searchProjectData.to_pledged))
		errors.push('Pledge goal lower bound can\'t be greater than its upper bound');

	if(!isNaN(searchProjectData.from_collected) && !isNaN(searchProjectData.to_collected) &&
		parseFloat(searchProjectData.from_collected) > parseFloat(searchProjectData.to_collected))
		errors.push('Collected amount lower bound can\'t be greater than its upper bound');

	if(errors.length > 0) {
		res.render('projects/search',{title:'Search', hasErrors: true, errors: errors,
			searchProjectData: searchProjectData, logged: isLogged, user: req.session.user});
		return;
	}

	let projectsByCategory, projectsByPledgeGoal = [], projectsByCollectedAmount = [];

	// This allows user to search by:
	// 1- selecting a category
	// 2- entering a valid number in either From or To, or both
	// 3- selecting a category and entering a range bounds
	// 4- default which fetches all the projects

	if(searchProjectData.category !== "none")
		projectsByCategory = await projectData.getProjectsByCategory(xss(searchProjectData.category));
	else
		projectsByCategory = await projectData.getAllProjects();

	if(searchProjectData.from_pledged || searchProjectData.to_pledged) {
		let pledgeLowerBound = null, pledgeHigherBound = null;
		if(searchProjectData.from_pledged)
			pledgeLowerBound = parseFloat(xss(searchProjectData.from_pledged));

		if(searchProjectData.to_pledged)
			pledgeHigherBound = parseFloat(searchProjectData.to_pledged);

		try {
			projectsByPledgeGoal = utilities.filterProjectsByPledgeGoal(projectsByCategory, pledgeLowerBound, pledgeHigherBound);
		} catch (e) {
			res.status(500).json({ error: e.toString() });
		}
	}

	if(searchProjectData.from_collected || searchProjectData.to_collected) {
		let collectedLowerBound = null, collectedHigherBound = null;
		if(searchProjectData.from_collected)
			collectedLowerBound = parseFloat(xss(searchProjectData.from_collected));

		if(searchProjectData.to_collected)
			collectedHigherBound = parseFloat(xss(searchProjectData.to_collected));

		try {
			projectsByCollectedAmount = utilities.filterProjectsByCollectedAmount(projectsByCategory, collectedLowerBound, collectedHigherBound);
		} catch (e) {
			res.status(500).json({ error: e.toString() });
		}
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
		for (let project of results)
			results[results.findIndex(obj => obj._id === project._id)] = await utilities.formatProjectFields(project._id);

	}
	res.render('projects/search-result',{title:'Search Result', projects: results, resultsExist: resultsExist,
		logged: isLogged, user: req.session.user});
});

router.get('/deactivate/:id', async (req, res) => {
	const projectId = req.params.id;
	const project = await projectData.getProject(projectId);
	// No other user can deactivate my own campaign
	if (project.creator !== req.session.user.userId) {
		res.redirect('/projects');
		return;
	}

	try {
		await projectData.deactivateProject(projectId);
		res.redirect(`/projects/${projectId}`);
	} catch (e) {
		res.status(500).json({ error: e.toString() });
	}
});

router.get('/activate/:id', async (req, res) => {
	const projectId = req.params.id;
	const project = await projectData.getProject(projectId);
	// No other user can activate my own campaign
	if (project.creator !== req.session.user.userId) {
		res.redirect('/projects');
		return;
	}
	try {
		await projectData.activateProject(projectId);
		res.redirect(`/projects/${projectId}`)
	} catch (e) {
		res.status(500).json({ error: e.toString() });
	}
});

module.exports = router;