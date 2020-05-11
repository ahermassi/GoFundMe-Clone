const data = require('../../data');
const projectData = data.projects;
const userData = data.users;

async function formatProjectFields(projectId) {
    let project, user;
    try {
        project = await projectData.getProject(projectId);
    } catch (e) {
        console.log(e.toString());
    }
    try {
        user = await userData.getUser(project.creator);  // Get the user who created the campaign
    } catch (e) {
        console.log(e.toString());
    }
    project.creator = user.firstName + " " + user.lastName;  // Replace the creator ID with the creator name
    project.date = project.date.toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric' });
    project.pledgeGoal = project.pledgeGoal.toLocaleString();
    project.collected = project.collected.toLocaleString();
    project.category = project.category.capitalize();
    project.donors = project.donations.length;
    return project;
}

async function fillCommentatorName(project) {
    try {
        for (let comment of project.comments) {  // Replace the commentator ID with the commentator name in each comment
            const commentator = await userData.getUser(comment.poster);
            comment.poster = commentator.firstName + " " + commentator.lastName;
        }
    } catch (e) {
        console.log(e.toString());
    }
}

function filterProjectsByPledgeGoal(projects, lowerBound, higherBound) {

    if(!Array.isArray(projects) || projects.length === 0) throw 'No project passed to filerProjectsByGoal';
    if(lowerBound === null && higherBound === null) throw 'At least one bound needs to be provided';
    if(lowerBound !== null && higherBound !== null && lowerBound > higherBound) throw 'Lower bound can\'t be greater than higher bound';

    let result = [];
    if(lowerBound != null && higherBound != null) {
        for (let project of projects) {
            if(project.pledgeGoal >= lowerBound && project.pledgeGoal <= higherBound)
                result.push(project);
        }
    }
    else if (lowerBound != null) {
        for(let project of projects){
            if(project.pledgeGoal >= lowerBound)
                result.push(project);
        }
    }
    else {
        for(let project of projects) {
            if(project.pledgeGoal <= higherBound)
                result.push(project);
        }
    }

    return result;
}

function filterProjectsByCollectedAmount(projects, lowerBound, higherBound) {

    if(!Array.isArray(projects) || projects.length === 0) throw 'No project passed to filterProjectsByCollectedAmount';
    if(lowerBound === null && higherBound === null) throw 'At least one bound needs to be provided';
    if(lowerBound !== null && higherBound !== null && lowerBound > higherBound) throw 'Lower bound can\'t be greater than higher bound';

    let result = [];
    if(lowerBound != null && higherBound != null) {
        for(let project of projects) {
            if(project.collected >= lowerBound && project.collected <= higherBound)
                result.push(project);
        }
    }
    else if(lowerBound != null) {
        for(let project of projects){
            if(project.collected >= lowerBound)
                result.push(project);
        }
    }
    else {
        for(let project of projects) {
            if(project.collected <= higherBound)
                result.push(project);
        }
    }

    return result;
}

function sortProjectsByCreationDate(projects) {
    if(!Array.isArray(projects) || projects.length === 0) throw 'No project list to sort';
    return projects.slice().sort((a, b) => b.date - a.date);

}

function sortProjectsByCollectedAmount(projects) {
    if(!Array.isArray(projects) || projects.length === 0) throw 'No project list to sort';
    return projects.slice().sort((a, b) => parseFloat(b.collected.replace(/,/g,'')) - parseFloat(a.collected.replace(/,/g,'')));
}

module.exports = {
    formatProjectFields,
    fillCommentatorName,
    filterProjectsByPledgeGoal,
    filterProjectsByCollectedAmount,
    sortProjectsByCreationDate,
    sortProjectsByCollectedAmount
};