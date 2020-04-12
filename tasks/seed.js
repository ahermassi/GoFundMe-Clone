const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;
const projects = data.projects;

async function main(){
    const db = await dbConnection();

	await db.dropDatabase();

    let john = await users.addUser('John', 'Doe','john@gmail.com','Hudson','NJ',
        'pass1');

    let jane = await users.addUser('Jane', 'Doe','jane@gmail.com','NYC','NY',
        'pass2');

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