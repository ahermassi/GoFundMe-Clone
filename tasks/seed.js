const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;
const projects = data.projects;

async function main(){
    const db = await dbConnection();

	await db.dropDatabase();

    const a = await users.addUser('A', 'B','123@gmail.com','Hudson','NJ','pass',[],[]);
    const id = a._id;
    
    const p1 = await projects.addProject('ProT','Game','A','Jan1',1000,0,[],"this is description of ProT");
    const p2 = await projects.addProject('COL','Movie','A','Jan1',1000,0,[],"this is description of COL");
    const p3 = await projects.addProject('JAJA','Novel','A','Jan1',1000,0,[],"this is description of JAJA");
    console.log('Done seeding database');
	await db.serverConfig.close();
}

main().catch((error) => {
	console.error(error);
//	return dbConnection().then((db) => {
//		return db.serverConfig.close();
//	});
});