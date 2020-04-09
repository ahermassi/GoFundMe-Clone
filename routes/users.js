const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const path = require('path');

router.get('/all', async (req, res) => {
    try {
      let userList = await userData.getAllUsers();
      res.json(userList);
    } catch (e) {
      res.sendStatus(500);
    }
  });

router.get('/signin',async(req,res)=>{
    let userList = await userData.getAllUsers();
//    res.sendFile(path.resolve('static/signin.html'));
    res.render('users/signin',{users:userList});
});

router.get('/register',async(req,res)=>{
  res.render('users/register',{});
});

router.post('/', async(req,res)=>{
  let newUser = req.body;
  let errors = [];

	if (!newUser.firstName) {
		errors.push('No firstName provided');
  }
  if(!newUser.lastName){
    errors.push('No lastName provided');
  }
	if (!newUser.passwordHash) {
		errors.push('No passwordHash provided');
  }
  if (!newUser.city) {
		errors.push('No city provided');
  }
  if (!newUser.state) {
		errors.push('No state provided');
  }
  if (!newUser.email) {
		errors.push('No email provided');
  }
  if (errors.length > 0) {
		res.render('users/register', {
			errors: errors,
			hasErrors: true,
			user: newUser,
		});
		return;
	}
  
  try{
    const  newAddUser = await userData.addUser(
      newUser.firstName, newUser.lastName,newUser.email,newUser.city,newUser.state,newUser.passwordHash,[],[]
    )
     res.redirect('/users/all');
  }catch(e){
    res.status(500).json({error:e})
  }
})





module.exports = router;