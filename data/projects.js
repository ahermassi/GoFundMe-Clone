const mongoCollections = require('../config/mongoCollections');
const projects = mongoCollections.projects;
const users = require('./users');
const { ObjectId } = require('mongodb');

module.exports = {
    async addProject(projectTitle, projectCategory, projectCreator, projectDate, projectPledgeGoal, projectDescription,
                     projectCollected=0, projectBackers=[], active=true) {

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
            description: projectDescription,
            active: active
        };

        const insertInfo = await projectsCollection.insertOne(newProject);
        if (insertInfo.insertedCount === 0) throw 'Could not add project';

        const newId = insertInfo.insertedId;
        const addProjectToUser = await users.addProjectToUser(projectCreator,newId);
        if(!addProjectToUser) throw "Can't add project to this user";

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
    async getProjectsByUser(userId) {
        if (!userId) throw 'You must provide a user id to search for';

        const objId = ObjectId(userId);
        const projectsCollection = await projects();
        const userProjects = await projectsCollection.find({ creator: objId }).toArray();
        if (userProjects.length === 0) throw 'This user has no projects';

        return userProjects;
    },
    async updateProject(projectId, projectTitle, projectCategory, projectCreator, projectDate, projectPledgeGoal,
                        projectDescription, projectCollected, projectBackers, active) {

        if (!projectId) throw 'You must provide a project id to update';
        if (!projectTitle) throw 'You must provide a title for your project';
        if (!projectCategory) throw 'You must provide a category for your project';
        if (!projectCreator) throw 'You must provide a creator for your project';
        if (!projectDate) throw 'You must provide a date for your project';
        if (!projectPledgeGoal) throw 'You must provide a pledge goal for your project';
        if (!projectDescription) throw 'You must provide a description for your project';

        const objId = ObjectId(projectId);
        const projectsCollection = await projects();
        const updatedProject = {
            title: projectTitle,
            category: projectCategory,
            creator: projectCreator,
            date: projectDate,
            pledgeGoal: projectPledgeGoal,
            collected: projectCollected,
            backers: projectBackers,
            description: projectDescription,
            active: active
        };

        const updatedInfo = await projectsCollection.updateOne({ _id: objId }, { $set: updatedProject });
        if (updatedInfo.modifiedCount === 0) {
            throw 'Could not update project successfully';
        }

        return await this.getProject(projectId);
    },
    async removeProject(id) {
        if (!id) throw 'You must provide a project id to search for';
        const objId = ObjectId(id);
        const projectsCollection = await projects();

        // Deactivate the project
        const deletionInfo = projectsCollection.updateOne({ _id: ObjectId(objId) }, {$set: {active: false}});

        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete project with id of ${id}`;
        }
        return deletionInfo.deletedCount;
    },
    async donateProject(id,donateAmount,donater){
        if(!id) throw 'You must provide a project id to donate';
        if(!donateAmount) throw 'You must provide an amount to donate';
        if(donateAmount<0) throw 'Are you kidding me?';
        if(!donater) throw 'You must provide a donater';
        if(typeof(donateAmount) !== 'number') throw 'The donate amount need to be a number';
        if(typeof(id)=='string'){
            id = ObjectId(id);
        }
        if(typeof(donater) == 'string'){
            donater = ObjectId(donater);
        }
        const projectsCollection = await projects();
        const targetProject = await this.getProject(id);
        let newCollected = parseInt(targetProject.collected)+donateAmount;
        let newbackers = targetProject.backers;
        newbackers.push(donater);
        const updatedProject = {
            collected:newCollected,
            backers:newbackers
        }
        const updatedInfo = await projectsCollection.updateOne({_id:id},{$set:updatedProject});
        const updatedDonater = await users.addDonater(donater,id);
        if (updatedInfo.modifiedCount === 0) {
            throw 'Could not update project successfully';
        }
        return await this.getProject(id);
    }
};