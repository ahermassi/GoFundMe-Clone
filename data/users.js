const mongoCollections = require('../config/mongoCollections');
const data = require('../data');
const projects = mongoCollections.projects;
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');

module.exports = {
    async addUser(firstName, lastName, email, city, state, passwordHash, projects, donated) {
        if(!firstName || typeof firstName!= 'string') throw 'you must provide a valid firstname'
        if(!lastName || typeof lastName!= 'string') throw 'you must provide a valid lastname'
        if(!email || typeof email!= 'string') throw 'you must provide a valid email'
        if(!city || typeof city!= 'string') throw 'you must provide a valid city'
        if(!state || typeof state!='string') throw 'you must provide a valid state'
        if(!passwordHash || typeof passwordHash!= 'string') throw 'you must provide a valid passwordhash'
        if (!Array.isArray(projects)) {
            projects = [];
          }
        
        if (!Array.isArray(donated)) {
            donated = [];
          }
        const usersCollection = await users();
        let newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            city:  city,
            state:  state,
            passwordHash: passwordHash,
            projects: projects,
            donated: donated
            };
        const insertInfo = await usersCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw 'Could not add user';
        const newId = insertInfo.insertedId;
        const user = await this.getBand(newId);
        return user;
    },

    async getAllUsers() {
        const usersCollection = await users();
        return await usersCollection.find({}).toArray();
    },

    async getUser(id) {
        if (!id) throw 'You must provide a project id to search for';

        const objId = ObjectId(id);
        const usersCollection = await users();
        const user = await usersCollection.findOne({ _id: objId });
        if (user === null) throw 'No user with this id';

        return user;
    },