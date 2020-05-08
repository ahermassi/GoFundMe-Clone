const editProjectForm = document.getElementById("edit-project-form");

const editProjectTitle = document.getElementById("title");
const editProjectGoal = document.getElementById("goal");
const editProjectDescription = document.getElementById("description");

const editProjectTitleError = document.getElementById('no-title');
const editProjectGoalError = document.getElementById('no-goal');
const editProjectAmountError = document.getElementById('invalid-amount');
const editProjectDescriptionError = document.getElementById('no-description');
const editProjectTypeError = document.getElementById("invalidtype-edit")
if (editProjectForm){

    editProjectForm.addEventListener("submit", (event)  => {
        if (editProjectTitle.value && editProjectGoal.value && editProjectDescription.value.length > 0) {
            if(isNaN(editProjectGoal.value)){
                event.preventDefault();
                editProjectTypeError.hidden = false;
                editProjectTitleError.hidden =true;
                editProjectDescriptionError.hidden = true;
                editProjectGoalError.hidden = true;
                editProjectAmountError.hidden = true;

            }
            else if (parseFloat(editProjectGoal.value ) <= 0) {
                event.preventDefault();
                editProjectGoalError.hidden = true;
                editProjectAmountError.hidden = false;
                //see new-project comments
                editProjectTitleError.hidden =true;
                editProjectDescriptionError.hidden = true;
                editProjectTypeError.hidden = true;
            }
            else
                editProjectForm.submit();
        }
        else {
            event.preventDefault();
            editProjectTitleError.hidden = editProjectTitle.value;
            editProjectGoalError.hidden = editProjectGoal.value;
            if (editProjectGoal.value) {
                editProjectGoalError.hidden = true;
                if(isNaN(editProjectGoal.value)){
                    editProjectTypeError.hidden = false;
                    editProjectAmountError.hidden = true;
                }
                else if(parseFloat(editProjectGoal.value ) <= 0){
                    editProjectAmountError.hidden = false;
                    editProjectTypeError.hidden = true;
                }
                else{
                    editProjectAmountError.hidden = true;
                    editProjectTypeError.hidden = true;
                }
            }
            else{
                editProjectAmountError.hidden = true;
                editProjectTypeError.hidden = true;
            }
            editProjectDescriptionError.hidden = editProjectDescription.value.length > 0;
        }
    });
}