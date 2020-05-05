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

module.exports = {
    filterProjectsByPledgeGoal,
    filterProjectsByCollectedAmount
};