const mongoCollections = require('../config/mongoCollections');
const data = require('../data');
const projects = mongoCollections.projects;
const users = mongoCollections.users;
const userData = data.users;

const { ObjectId } = require('mongodb');

module.exports = {
    async addProject(projectTitle, projectCategory, projectCreator, projectDate, projectPledgeGoal,
                     projectCollected=0, projectBackers=[], projectDescription) {

        if (!projectTitle) throw 'You must provide a title for your project';
        if (!projectCategory) throw 'You must provide a category for your project';
        if (!projectCreator) throw 'You must provide a creator for your project';
        if (!projectDate) throw 'You must provide a date for your project';
        if (!projectPledgeGoal) throw 'You must provide a pledge goal for your project';
        if (!projectDescription) throw 'You must provide a description for your project';

        const projectsCollection = await projects();

        let newProject = {
            title: projectTitle,
            category: projectCategory,
            creator: projectCreator,
            date: projectDate,
            pledgeGoal: projectPledgeGoal,
            collected: projectCollected,
            backers: projectBackers,
            description: projectDescription
        };

        const insertInfo = await projectsCollection.insertOne(newProject);
        if (insertInfo.insertedCount === 0) throw 'Could not add project';

        const newId = insertInfo.insertedId;

        return await this.getProject(newId);
    },
    async getAllProjects() {
        const projectsCollection = await projects();
        return await projectsCollection.find({}).toArray();
    },
    async getProject(id) {
        if (!id) throw 'You must provide a project id to search for';

        const objId = ObjectId(id);
        const projectsCollection = await projects();
        const project = await projectsCollection.findOne({ _id: objId });
        if (project === null) throw 'No project with this id';

        return project;
    },
};