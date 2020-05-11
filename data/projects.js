const mongoCollections = require('../config/mongoCollections');
const projects = mongoCollections.projects;
const users = require('./users');
const { ObjectId } = require('mongodb');

module.exports = {
    async addProject(projectTitle, projectCategory, projectCreator, projectDate, projectPledgeGoal, projectDescription,
                     projectCollected=0, projectDonations=[], projectComments = [], active=true) {

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
            donations: projectDonations,
            description: projectDescription,
            comments: projectComments,
            active: active
        };

        const insertInfo = await projectsCollection.insertOne(newProject);
        if (insertInfo.insertedCount === 0) throw 'Could not add project';

        const userId = insertInfo.insertedId;
        
        let addProjectToUser;
        try {
            addProjectToUser = await users.addProjectToUser(projectCreator, userId);
        } catch (e) {
            console.log(e.toString());
        }
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
    async deactivateProject(id) {
        if (!id) throw 'You must provide a project id to search for';
        if (typeof (id) === 'string')
            id = ObjectId(id);
        const projectsCollection = await projects();

        // Deactivate the project
        const updateInfo = await projectsCollection.updateOne({ _id: id }, {$set: {active: false}});

        if (updateInfo.matchedCount === 0) {
            throw `Could not delete deactivate project with id of ${id}`;
        }
        return updateInfo.matchedCount;
    },
    async activateProject(id) {
        if (!id) throw 'You must provide a project id to search for';
        if (typeof (id) === 'string')
            id = ObjectId(id);
        const projectsCollection = await projects();

        // Activate the project
        const updateInfo = projectsCollection.updateOne({ _id: id }, {$set: {active: true}});

        if (updateInfo.matchedCount === 0) {
            throw `Could not activate project with id of ${id}`;
        }
        return updateInfo.matchedCount;
    },
    async donateToProject(projectId, amount, donatorId) {
        if(!projectId) throw 'You must provide a project id to donate';
        if(!amount) throw 'You must provide an amount to donate';
        if(amount < 0) throw 'Are you kidding me?';
        if(!donatorId) throw 'You must provide a donator';
        if(typeof(amount) !== 'number') throw 'The donation amount needs to be a number';

        const projectsCollection = await projects();
        let targetProject;
        try {
            targetProject = await this.getProject(projectId);
        } catch (e) {
            console.log(e.toString());
        }
        let newCollected = parseFloat(targetProject.collected) + parseFloat(amount);
        let donations = targetProject.donations;
        let donatedBefore = false;
        for (let donation of donations) {
            if (donation.donatorId === donatorId) {
                donation.amount += amount;
                donatedBefore = true;
                break;
            }
        }
        if (!donatedBefore) {
            let newDonation = {
                donatorId: donatorId,
                amount: amount
            };
            donations.push(newDonation);
        }
        const updateInfo = await projectsCollection.updateOne({_id: ObjectId(projectId)}, {
                $set: {
                    collected: newCollected,
                    donations: donations
                }
            });
        if (updateInfo.modifiedCount === 0)
            throw 'Could not process the donation successfully';
        let updateDonator;
        try {
            updateDonator = await users.addDonatorToProject(donatorId, projectId, amount);
        } catch (e) {
            console.log(e.toString());
        }
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