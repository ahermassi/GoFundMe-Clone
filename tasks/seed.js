const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;
const projects = data.projects;
const passwordHash = require('password-hash');

async function main(){
    const db = await dbConnection();

    await db.dropDatabase();
    
   let pass1 = passwordHash.generate('pass1');
   let pass2 = passwordHash.generate('pass2');

    let john = await users.addUser('John', 'Doe','john@gmail.com', pass1,
        'Hudson','NJ');

    let jane = await users.addUser('Jane', 'Doe','jane@gmail.com', pass2,
        'NYC','NY');

    await projects.addProject('ProT','Game',john._id,'Jan1',
        1000,"this is description of ProT");
    await projects.addProject('COL','Movie',john._id,'Jan1',
        1000,"this is description of COL");
    await projects.addProject('JAJA','Novel',jane._id,'Jan1',1000,
								"this is description of JAJA");
    console.log('Done seeding database');
	await db.serverConfig.close();
}

main().catch((error) => {
	console.error(error);
//	return dbConnection().then((db) => {
//		return db.serverConfig.close();
//	});
});