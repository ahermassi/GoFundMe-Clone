const searchForm = document.getElementById("search-project-form");
const searchPledgeGoalFrom = document.getElementById("from-pledged");
const searchPledgeGoalTo = document.getElementById("to-pledged");
const searchCollectedAmountFrom = document.getElementById("from-collected");
const searchCollectedAmountTo = document.getElementById("to-collected");
const invalidPledgeGoalFromError = document.getElementById("invalid-from-pledged");
const invalidPledgeGoalToError = document.getElementById("invalid-to-pledged");
const invalidCollectedAmountFromError = document.getElementById("invalid-from-collected");
const invalidCollectedAmountToError = document.getElementById("invalid-to-collected");
const fromPledgeGoalGreaterThanPledgeToError = document.getElementById("from-pledged>to-pledged");
const fromCollectedAmountGreaterThanCollectedAmountToError = document.getElementById("from-collected>to-collected");
let flag = false;
if (searchForm){

    searchForm.addEventListener("submit", (event) =>{
        if(parseFloat(searchPledgeGoalFrom.value) && parseFloat(searchPledgeGoalTo.value) &&  parseFloat(searchPledgeGoalFrom.value) > parseFloat(searchPledgeGoalTo.value)){
            event.preventDefault();
            fromPledgeGoalGreaterThanPledgeToError.hidden = false;
            flag = true;
         
        }
    
        if(parseFloat(searchCollectedAmountFrom.value) && parseFloat(searchCollectedAmountTo.value) && parseFloat(searchCollectedAmountFrom.value) > parseFloat(searchCollectedAmountTo.value)){
            event.preventDefault();
            fromCollectedAmountGreaterThanCollectedAmountToError.hidden = false;
            flag = true;
        }

        if(parseFloat(searchPledgeGoalFrom.value) < 0){
            event.preventDefault();
            invalidPledgeGoalFromError.hidden = false;
            flag = true;
  
        }
        if(parseFloat(searchPledgeGoalTo.value) < 0){
            event.preventDefault();
            invalidPledgeGoalToError.hidden = false;
            flag = true;
        }
        if(parseFloat(searchCollectedAmountFrom.value) < 0){
            event.preventDefault();
            invalidCollectedAmountFromError.hidden = false;
            flag = true;

        }

        if(parseFloat(searchCollectedAmountTo.value) < 0){
            event.preventDefault();
            invalidCollectedAmountToError.hidden = false;
            flag = true;

        }
        if(parseFloat(searchPledgeGoalFrom.value) && parseFloat(searchPledgeGoalTo.value) &&  parseFloat(searchPledgeGoalFrom.value) <= parseFloat(searchPledgeGoalTo.value)){
            fromPledgeGoalGreaterThanPledgeToError.hidden = true;
        }

        if(parseFloat(searchCollectedAmountFrom.value) && parseFloat(searchCollectedAmountTo.value) && parseFloat(searchCollectedAmountFrom.value) <= parseFloat(searchCollectedAmountTo.value)){
            fromCollectedAmountGreaterThanCollectedAmountToError.hidden = true;
        }

        if(parseFloat(searchPledgeGoalFrom.value) >= 0){
            invalidPledgeGoalFromError.hidden = true;

        }

        if(parseFloat(searchPledgeGoalTo.value) >= 0){
            invalidPledgeGoalToError.hidden = true;
        }

        if(parseFloat(searchCollectedAmountFrom.value) >= 0){
            invalidCollectedAmountFromError.hidden = true;

        }

        if(parseFloat(searchCollectedAmountTo.value) >= 0){
            invalidCollectedAmountToError.hidden = true;
        }
        
        if(!flag){
            searchForm.submit();

        }
        
    } )

}

