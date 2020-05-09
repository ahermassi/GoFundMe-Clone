const express = require('express');
const passwordHash = require('password-hash');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const projectData = data.projects;
const statistics = require('../data/statistics');

router.get('/all', async (req, res) => {
    try {
      let userList = await userData.getAllUsers();
      res.json(userList);
    } catch (e) {
      res.sendStatus(500);
    }
  });

router.get('/signin',async (req, res) => {
    res.render('users/signin',{title: 'Sign In'});
});

router.get('/register',async (req,res) => {
    res.render('users/register', {title: 'Register'});
});

router.post('/signin',async (req, res) => {
    let loginInfo = req.body;
    let errors = [];

    if (!loginInfo.email)
        errors.push('Please enter your email');

    if(!loginInfo.password)
        errors.push('Please enter your password');

    if (errors.length > 0) {
        res.render('users/signin', {
            errors: errors,
            hasErrors: true,
        });
        return;
    }
    let user;
    try{
        user = await userData.getUserByEmail(loginInfo.email);
    } catch(e) {
        errors.push(e);
        res.render('users/signin',{hasErrors: true, errors: errors});
        return;
    }
    const compareHashedPassword =  passwordHash.verify(loginInfo.password, user.passwordHash);
    if (compareHashedPassword){
        req.session.user = { firstName: user.firstName, lastName: user.lastName, userId: user._id };
        res.redirect('/projects');
    }
    else
        res.render('users/signin',{hasErrors: true, errors: ['Invalid email or password']});
});

router.post('/', async (req, res) => {
    let newUser = req.body;
    let errors = [];

    if (!newUser.first_name)
		errors.push('No first name provided');

    if(!newUser.last_name)
        errors.push('No last name provided');

    if(!newUser.email)
        errors.push('No email provided');

	if (!newUser.password)
		errors.push('No password provided');

    if (!newUser.password_confirm)
        errors.push('No password confirmation provided');

    if(newUser.password_confirm !== newUser.password)
        errors.push('Passwords don\'t match');

    if (!newUser.city)
		errors.push('No city provided');

    if (!newUser.state)
		errors.push('No state provided');

    if (!newUser.email)
        errors.push('No email provided');
    
    newUser.email = newUser.email.toLowerCase();
    
    try{
        const existingEmail =  await userData.getUserByEmail(newUser.email);
        if (existingEmail)
            errors.push('An account with this email already exists.');
    } catch(e) {}
    
    if (errors.length > 0) {
		res.render('users/register', {
			errors: errors,
			hasErrors: true,
			user: newUser,
		});
		return;
    }
    try {
        const hashedPassword = passwordHash.generate(newUser.password);
        await userData.addUser(newUser.first_name, newUser.last_name, newUser.email, hashedPassword, newUser.city,
            newUser.state);
        res.redirect('/users/signin');
    }catch(e){
        res.status(500).json({error: e.toString()})
  }
});

router.get('/logout', async (req, res) => {
    req.session.destroy();
    res.redirect('/projects');
});

router.get('/history/:userId', async (req, res) => {
    // List the campaigns created by the user whose ID is 'userId' as well as the campaigns to which this user donated
    try {
        let projects = await projectData.getProjectsByUser(req.params.userId);
        const user = await userData.getUser(req.params.userId);
        let hasDonated = user.donated.length !== 0;
        for(let donation of user.donated) {
            const project = await projectData.getProject(donation.projectId);
            let user = await userData.getUser(project.creator);
            donation.projectTitle = project.title;
            donation.projectCreator = user.firstName + " " + user.lastName;
        }
        if(projects.length>0){
            projects = statistics.sortProjectsByCreateDate(projects);
        }
        for (let project of projects) {
            project.date = project.date.toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric' });
            project.pledgeGoal = project.pledgeGoal.toLocaleString();
            project.collected = project.collected.toLocaleString();
            project.donors = project.donations.length;
        }
        res.render('projects/my-projects', {title: 'My Projects', hasProjects: projects.length !== 0, projects: projects,
            hasDonated: hasDonated, donated: user.donated});
    } catch (e) {
        // The reason to change this is because if a user has no projects, it will get the error at
        // "const projects = await projectData.getProjectsByUser()", which throws an error without checking
        // projects.length !== 0. What has been changed is the data/project getProjectsByUser()
        res.status(500).json({ error: e.toString() });
    }
});

module.exports = router;