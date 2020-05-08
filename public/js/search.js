const searchForm = document.getElementById("search-project-form");
const searchPledgeGoalFrom = document.getElementById("from-pledged");
const searchPledgeGoalTo = document.getElementById("to-pledged");
const searchCollectedAmountFrom = document.getElementById("from-collected");
const searchCollectedAmountTo = document.getElementById("to-collected");

const pledgeGoalFromNaN = document.getElementById('from-pledged-nan');
const pledgeGoalToNaN = document.getElementById('to-pledged-nan');
const collectedAmountFromNaN = document.getElementById('from-collected-nan');
const collectedAmountToNaN = document.getElementById('to-collected-nan');

const invalidPledgeGoalFromError = document.getElementById("invalid-from-pledged");
const invalidPledgeGoalToError = document.getElementById("invalid-to-pledged");
const invalidCollectedAmountFromError = document.getElementById("invalid-from-collected");
const invalidCollectedAmountToError = document.getElementById("invalid-to-collected");

const fromPledgeGoalGreaterThanPledgeToError = document.getElementById("from-pledged>to-pledged");
const fromCollectedAmountGreaterThanCollectedAmountToError = document.getElementById("from-collected>to-collected");

if (searchForm){

    searchForm.addEventListener("submit", (event) => {
        let flag = false;

        if (isNaN(searchPledgeGoalFrom.value)) {
            pledgeGoalFromNaN.hidden = false;
            invalidPledgeGoalFromError.hidden = true;
            flag = true;
        }
        else if(parseFloat(searchPledgeGoalFrom.value) < 0) {
            invalidPledgeGoalFromError.hidden = false;
            pledgeGoalFromNaN.hidden = true;
            flag = true;
        }
        else {
            pledgeGoalFromNaN.hidden = true;
            invalidPledgeGoalFromError.hidden = true;
        }

        if(isNaN(searchPledgeGoalTo.value)) {
            pledgeGoalToNaN.hidden = false;
            invalidPledgeGoalToError.hidden = true;
            flag = true;
        }
        else if(parseFloat(searchPledgeGoalTo.value) < 0) {
            invalidPledgeGoalToError.hidden = false;
            pledgeGoalToNaN.hidden = true;
            flag = true;
        }
        else {
            pledgeGoalToNaN.hidden = true;
            invalidPledgeGoalToError.hidden = true;
        }


        if(isNaN(searchCollectedAmountFrom.value)) {
            collectedAmountFromNaN.hidden = false;
            invalidCollectedAmountFromError.hidden = true;
            flag = true;
        }
        else if(parseFloat(searchCollectedAmountFrom.value) < 0){
            invalidCollectedAmountFromError.hidden = false;
            collectedAmountFromNaN.hidden = true;
            flag = true;
        }
        else {
            collectedAmountFromNaN.hidden = true;
            invalidCollectedAmountFromError.hidden = true;
        }

        if(isNaN(searchCollectedAmountTo.value)) {
            collectedAmountToNaN.hidden = false;
            invalidCollectedAmountToError.hidden = true;
            flag = true;
        }
        else if(parseFloat(searchCollectedAmountTo.value) < 0){
            invalidCollectedAmountToError.hidden = false;
            collectedAmountToNaN.hidden = true;
            flag = true;
        }
        else {
            collectedAmountToNaN.hidden = true;
            invalidCollectedAmountToError.hidden = true;
        }

        if(!isNaN(searchPledgeGoalFrom.value) && !isNaN(searchPledgeGoalTo.value) &&
            parseFloat(searchPledgeGoalFrom.value) > parseFloat(searchPledgeGoalTo.value)) {
            fromPledgeGoalGreaterThanPledgeToError.hidden = false;
            flag = true;
         
        }

        if(!isNaN(searchPledgeGoalFrom.value) && !isNaN(searchPledgeGoalTo.value) &&
            parseFloat(searchPledgeGoalFrom.value) > parseFloat(searchPledgeGoalTo.value)) {
            fromPledgeGoalGreaterThanPledgeToError.hidden = true;
        }
    
        if(!isNaN(searchCollectedAmountFrom.value) && !isNaN(searchCollectedAmountTo.value) &&
            parseFloat(searchCollectedAmountFrom.value) > parseFloat(searchCollectedAmountTo.value)) {
            fromCollectedAmountGreaterThanCollectedAmountToError.hidden = false;
            flag = true;
        }
        
        if(flag)
            event.preventDefault();
        else
            searchForm.submit();
    } )

}

