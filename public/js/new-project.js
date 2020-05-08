const newProjectForm = document.getElementById("new-project-form");

const newProjectTitle = document.getElementById("title");
const newProjectGoal = document.getElementById("goal");
const newProjectDescription = document.getElementById("description");

const newProjectTitleError = document.getElementById('no-title');
const newProjectGoalError = document.getElementById('no-goal');
const newProjectAmountError = document.getElementById('invalid-amount');
const newProjectDescriptionError = document.getElementById('no-description');
const newProjectTypeError = document.getElementById("invalid-type")

if (newProjectForm){

    newProjectForm.addEventListener("submit", (event)  => {
        if (newProjectTitle.value && newProjectGoal.value && newProjectDescription.value.length > 0) {
            if(isNaN(newProjectGoal.value)){
                event.preventDefault();
                newProjectTypeError.hidden = false;
                newProjectTitleError.hidden =true;
                newProjectDescriptionError.hidden = true;
                newProjectGoalError.hidden = true;
                newProjectAmountError.hidden = true;
            }
            else if (parseFloat(newProjectGoal.value ) <= 0) {
                event.preventDefault();
                newProjectGoalError.hidden = true;
                newProjectAmountError.hidden = false;
                //Add below two lines
                //(if the user first leave empty for title and description, and enter a negative number in amount, it will set newProjectTitleError.hidden and newProjectDescriptionError.hidden to true)
                //(then the user enter title and description,but leave a negative number in amount, it still show titleError and Description error)
                newProjectTitleError.hidden =true;
                newProjectDescriptionError.hidden = true;
                newProjectTypeError.hidden = true;
            }
            else{
                newProjectForm.submit();
            }
        }
        else {
            event.preventDefault();
            newProjectTitleError.hidden = newProjectTitle.value;
            newProjectGoalError.hidden = newProjectGoal.value;
            if (newProjectGoal.value) {
                newProjectGoalError.hidden = true;
                if(isNaN(newProjectGoal.value)){
                    newProjectTypeError.hidden = false;
                    newProjectAmountError.hidden = true;
                }
                else if(parseFloat(newProjectGoal.value ) <= 0){
                    newProjectAmountError.hidden = false;
                    newProjectTypeError.hidden = true;

                }
                else{
                    newProjectAmountError.hidden = true;
                    newProjectTypeError.hidden = true;
                }
    
            }
            else{
                newProjectAmountError.hidden = true;
                newProjectTypeError.hidden = true;

            }
            newProjectDescriptionError.hidden = newProjectDescription.value.length > 0;
        }
    });
}