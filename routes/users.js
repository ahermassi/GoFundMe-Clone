const express = require('express');
//const passwordHash = require('password-hash');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const projectData = data.projects;
const path = require('path');
const bcrypt = require("bcrypt");
const saltRounds = 16;


router.get('/all', async (req, res) => {
    try {
      let userList = await userData.getAllUsers();
      res.json(userList);
    } catch (e) {
      res.sendStatus(500);
    }
  });

router.get('/signin',async (req,res) => {
    let userList = await userData.getAllUsers();
//    res.sendFile(path.resolve('static/signin.html'));
    res.render('users/signin',{title: 'Sign In', users:userList});
});

router.get('/register',async (req,res) => {
    res.render('users/register', {title: 'Register'});
});

router.post('/signin/login',async(req,res)=>{
  let signinUser = req.body;
  let errors = [];
  if (!signinUser.email){
    errors.push('Need email');
  }
  if(!signinUser.pass){
    errors.push('Need password');
		}
		if (errors.length > 0) {
			res.render('users/signin', {
				errors: errors,
				hasErrors: true,
			});
			return;
			}
		let theUser;
  try{
				theUser = await userData.getUserByEmail(signinUser.email);
  }catch(e){
			res.render('users/signin',{hasErrors:true, errors:errors.push(e)});
		}
		const compareHashedPass =  await bcrypt.compare(signinUser.pass,theUser.passwordHash);
		if (compareHashedPass){
			const projectList = await projectData.getAllProjects();
			for (let project of projectList) {
				const user = await userData.getUser(project.creator);
				project.creator = user.firstName;
			}
			res.render('projects/index',{title: 'Projects', projects: projectList,hasLogin:true,user:theUser});
		}else{
			res.render('users/signin',{hasErrors:true, errors:['invalid email or password']});
		}
});

router.post('/', async(req,res)=> {
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

    if (errors.length > 0) {
		res.render('users/register', {
			errors: errors,
			hasErrors: true,
			user: newUser,
		});
		return;
  }
    try {
//        const hashedPassword = passwordHash.generate(newUser.password);
								const  hashedPassword = await bcrypt.hash(newUser.passwordHash,saltRounds);
        await userData.addUser(newUser.first_name, newUser.last_name, newUser.email, hashedPassword, newUser.city,
            newUser.state);
        res.redirect('/users/all');
    }catch(e){
        res.status(500).json({error:e})
  }
});







module.exports = router;