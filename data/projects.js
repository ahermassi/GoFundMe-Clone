const mongoCollections = require('../config/mongoCollections');
const projects = mongoCollections.projects;
const users = require('./users');
const { ObjectId } = require('mongodb');

module.exports = {
    async addProject(projectTitle, projectCategory, projectCreator, projectDate, projectPledgeGoal, projectDescription,
                     projectCollected=0, projectBackers=[], projectComments = [], active=true) {

        if (!projectTitle) throw 'You must provide a title for your project';
        if (!projectCategory) throw 'You must provide a category for your project';
        if (!projectCreator) throw 'You must provide a creator for your project';
        if (!projectDate) throw 'You must provide a date for your project';
        if (!projectPledgeGoal) throw 'You must provide a pledge goal for your project';
        if (!projectDescription) throw 'You must provide a description for your project';

        const projectsCollection = await projects();
        projectCreator = projectCreator.toString();
        let newProject = {
            title: projectTitle,
            category: projectCategory,
            creator: projectCreator,
            date: projectDate,
            pledgeGoal: projectPledgeGoal,
            collected: projectCollected,
            backers: projectBackers,
            description: projectDescription,
            comments: projectComments,
            active: active
        };

        const insertInfo = await projectsCollection.insertOne(newProject);
        if (insertInfo.insertedCount === 0) throw 'Could not add project';

        const userId = insertInfo.insertedId;
        
        const addProjectToUser = await users.addProjectToUser(projectCreator, userId);
        if(!addProjectToUser) throw "Can't add project to this user";

        return await this.getProject(userId);
    },
    async getAllProjects() {
        const projectsCollection = await projects();
        return await projectsCollection.find({}).toArray();
    },
    async getProject(id) {
        if (!id) throw 'You must provide a project id to search for';

        if(typeof(id)=='string'){
            id = ObjectId(id);
        }
        const objId = id;
        const projectsCollection = await projects();
        const project = await projectsCollection.findOne({ _id: objId });
        if (project === null) throw 'No project with this id';

        return project;
    },
    async getProjectsByUser(userId) {
        if (!userId) throw 'You must provide a user id to search for';

        const objId = userId;
        const projectsCollection = await projects();
        const userProjects = await projectsCollection.find({ creator: objId }).toArray();
//        if (userProjects.length === 0) throw 'This user has no projects';

        return userProjects;
    },
    async getProjectsByCategory(category){
        if(!category || typeof(category)!=='string') throw 'You must provide a valid category to search for'
        const projectsCollection = await projects();
        const categoryRelatedProjects = await projectsCollection.find({category:category}).toArray();
        return categoryRelatedProjects;

    },
    async updateProject(projectId, projectTitle, projectCategory, projectPledgeGoal, projectDescription,) {

        if (!projectId) throw 'You must provide a project id to update';
        if (!projectTitle) throw 'You must provide a title for your project';
        if (!projectCategory) throw 'You must provide a category for your project';
        if (!projectPledgeGoal) throw 'You must provide a pledge goal for your project';
        if (!projectDescription) throw 'You must provide a description for your project';

        const objId = ObjectId(projectId);
        const projectsCollection = await projects();
        const updatedInfo = await projectsCollection.updateOne({ _id: objId }, { $set: {title: projectTitle, category: projectCategory,
            pledgeGoal: projectPledgeGoal, description: projectDescription}});
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
    async donateToProject(projectId, amount, donatorId) {
        if(!projectId) throw 'You must provide a project id to donate';
        if(!amount) throw 'You must provide an amount to donate';
        if(amount < 0) throw 'Are you kidding me?';
        if(!donatorId) throw 'You must provide a donator';
        if(typeof(amount) !== 'number') throw 'The donation amount needs to be a number';

        const projectsCollection = await projects();
        const targetProject = await this.getProject(projectId);
        let newCollected = parseInt(targetProject.collected) + amount;
        let backers = targetProject.backers;
        if (!backers.includes(donatorId))
            backers.push(donatorId);
        const updateInfo = await projectsCollection.updateOne({_id: ObjectId(projectId)}, {
                $set: {
                    collected: newCollected,
                    backers: backers
                }
            });
        if (updateInfo.modifiedCount === 0)
            throw 'Could not process the donation successfully';
        const updateDonator = await users.addDonatorToProject(donatorId, projectId, amount);
        if (updateDonator.modifiedCount === 0)
            throw 'Could not add a donator';

        return await this.getProject(projectId);
    },
    async commentOnProject(projectId, commentatorId, comment) {
        if(!projectId) throw 'You must provide a project id to comment on';
        if(!commentatorId) throw 'You must provide a commentator id';
        if(!comment) throw 'You must provide the comment text';

        if(typeof(projectId) === 'string')
            projectId = ObjectId(projectId);
        if(typeof(commentatorId) === 'string')
            commentatorId = ObjectId(commentatorId);

        let newComment = {
            _id: ObjectId(),
            poster: commentatorId,
            comment: comment
        };

        const projectsCollection = await projects();
        const updateInfo = await projectsCollection.updateOne({_id: projectId}, {$push: {comments: newComment}});
        if (updateInfo.modifiedCount === 0)
            throw 'Could not add a comment';

       // return await this.getProject(projectId);
        return newComment;
    }

};