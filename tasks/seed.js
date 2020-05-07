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
   let pass3 = passwordHash.generate('pass3');

   const categories =["Medical", "Education", "Animals", "Business", "Community", "Sports", "Travel", "Volunteer"];

    let john = await users.addUser('John', 'Doe','john@gmail.com', pass1,
        'Hudson','NJ');

    let jane = await users.addUser('Jane', 'Doe','jane@gmail.com', pass2,
        'NYC','NY');
    
    let king = await users.addUser('King', 'sb','king@gmail.com', pass3,
        'Los Angles','CA');

    await projects.addProject('ProT','medical',john._id, new Date(),
        1000,"this is description of ProT",0,[], [], true);

    await projects.addProject('COL','medical',john._id, new Date(),
        1000,"this is description of COL",0,[], [], true);
    await projects.addProject('JAJA','business',jane._id, new Date(),1000,
                                "this is description of JAJA",0,[], [],true);
    for(let i = 1; i < 9; i++){
        let testName = "Test Case" + i;
        let creator;
        let category = categories[i % 8];
        let goal = i * 100 + i * i;
        let desc = "This is description for testCase" + i;
        if(i % 2 === 0)
            creator = john._id;
        else
            creator = jane._id;

        await projects.addProject(testName, category, creator, new Date(), goal, desc,0,[],[],true)

    }
    console.log('Done seeding database');
	await db.serverConfig.close();
}

main().catch((error) => {
	console.error(error);
//	return dbConnection().then((db) => {
//		return db.serverConfig.close();
//	});
});