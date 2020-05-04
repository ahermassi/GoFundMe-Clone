//Create this for use of statistics part, functions added here for implement of statistics feature
function filterProjectsByGoal(projects,lowerbound,higherbound){
    if(!Array.isArray(projects) || projects.length == 0) throw 'no project pass into filerProjectsByGoal';
    if(lowerbound==null && higherbound == null) throw 'At least one bound need to be provided';
    if(lowerbound !== null && higherbound !== null && lowerbound>higherbound) throw 'From need to be less than To';
    let result = [];
    if(lowerbound != null && higherbound != null){
        for(let element of projects){
            if(element.pledgeGoal>=lowerbound && element.pledgeGoal<=higherbound){
                result.push(element);
            }
        }
    }else if(lowerbound != null){
        for(let element of projects){
            if(element.pledgeGoal>=lowerbound){
                result.push(element);
            }
        }
    }else {
        for(let element of projects){
            if(element.pledgeGoal<=higherbound){
                result.push(element);
            }
        }
    }
    return result;
}
module.exports={
    filterProjectsByGoal
};