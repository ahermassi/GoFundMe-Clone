const mongoCollections = require('../config/mongoCollections');
const projects = mongoCollections.projects;
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');

module.exports = {
    async addUser(firstName, lastName, email, passwordHash, city, state, projects=[], donated=[],
                  active=true) {
        if(!firstName || typeof firstName!= 'string') throw 'you must provide a valid first name';
        if(!lastName || typeof lastName!= 'string') throw 'you must provide a valid last name';
        if(!email || typeof email!= 'string') throw 'you must provide a valid email';
        if(!passwordHash || typeof passwordHash!= 'string') throw 'you must provide a valid password hash';
        if(!city || typeof city!= 'string') throw 'you must provide a valid city';
        if(!state || typeof state!='string') throw 'you must provide a valid state';

        const usersCollection = await users();
        let newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            passwordHash: passwordHash,
            city: city,
            state: state,
            projects: projects,
            donated: donated,
            active: active
            };
        const insertInfo = await usersCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw 'Could not add user';
        const newId = insertInfo.insertedId;
        return await this.getUser(newId);
    },

    async getAllUsers() {
        const usersCollection = await users();
        return usersCollection.find({}).toArray();
    },

    async getUser(id) {
        if (!id) throw 'You must provide a user id to search for';

        const objId = ObjectId(id);
        const usersCollection = await users();
        const user = await usersCollection.findOne({ _id: objId });
        if (user === null) throw 'No user with this id';

        return user;
    },

    async getUserByEmail(email){
        if(!email || typeof email !== 'string'){
            throw "You need to provide an email";
        }
        const usersCollection = await users();
        const user = await usersCollection.findOne({email:email});
        if(user === null){
            throw "Invalid email";
        }
        return user;
    },

    async updateUser(id , updatedUser) {
        const usersCollection = await users();
    
        const updatedUserData = {};
    
        if (updatedUser.firstName) {
          updatedUserData.firstName = updatedUser.firstName;
        }
    
        if (updatedUser.lastName) {
          updatedUserData.lastName = updatedUser.lastName;
        }
    
        if (updatedUser.email) {
          updatedUserData.email = updatedUser.email;
        }

        if (updatedUser.passwordHash){
            updatedUserData.passwordHash = updatedUser.passwordHash;
        }
    
        if (updatedUser.city){
            updatedUserData.city = updatedUser.city;
        }
    
        if (updatedUser.state){
            updatedUserData.state = updatedUser.state;
        }
    
        let updateCommand = {
          $set: updatedUserData
        };
        const query = {
          _id: id
        };
        await usersCollection.updateOne(query, updateCommand);
    
        return await this.getUser(id);
    },

    async removeUser(id){

        if (!id) throw 'You must provide a valid user id ';
        const objId = ObjectId(id);
        const usersCollection = await users();
        const projectsAPI = require("./projects");
        let userToDelete = await this.getUser(id);

        const projectsList = userToDelete.projects;
        for (let projectId of projectsList) {  // Deactivate all the projects of the user
            const deleteProjects = await projectsAPI.deactivateProject(projectId);
            if (deleteProjects === 0){
                throw 'Could not remove project';
            }
        }
       
        // Deactivate the user
        const deletionInfo = await usersCollection.updateOne({ _id: ObjectId(objId) }, {$set: {active: false}});

        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete user with id of ${id}`;
        }
       
    },
    async addDonatorToProject(donatorId, projectId, amount) {
        // Add the project ID and donation amount to the list of donations made by this user
        if(!donatorId) throw 'You must provide a user id';
        if(!projectId) throw 'You must provide a project Id';

        if (typeof (donatorId) === 'string')
            donatorId = ObjectId(donatorId);

        const targetUser = await this.getUser(donatorId);
        const usersCollection = await users();
        let donations = targetUser.donated;
        let donationExists = false;
        for (let donation of donations) {
            if(donation.projectId === projectId) {
                donationExists = true;
                donation.amount += amount;
                break;
            }
        }
        if (donationExists) {
            const updateInfo = await usersCollection.updateOne({_id: donatorId},{$set: {donated: donations}});
            if (updateInfo.modifiedCount === 0)
                throw 'Could not process the donation';
        }
        else {
            let newDonation = {
                projectId: projectId.toString(),
                amount: amount
            };
            const updateInfo = await usersCollection.updateOne({_id: donatorId}, {$push: {donated: newDonation}});
            if (updateInfo.modifiedCount === 0)
                throw 'Could not process the donation';
        }
        return await this.getUser(donatorId);
    },
    async addProjectToUser(userId, projectId){
        if(!userId) throw 'You must provide a user id';
        if(!projectId) throw 'You must provide a project Id';

        projectId = projectId.toString();
        if(typeof(userId) === 'string')
            userId = ObjectId(userId);
        //if(typeof(projectId) === 'string')
            //projectId = ObjectId(projectId);

        const usersCollection = await users();
        const updateInfo = await usersCollection.updateOne({_id: userId},{$push: {projects: projectId}});
        if (updateInfo.modifiedCount === 0)
            throw 'Could not add the project to the user';

        return true;
    }
};

