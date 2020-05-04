const editProjectForm = document.getElementById("edit-project-form");

const editProjectTitle = document.getElementById("title");
const editProjectGoal = document.getElementById("goal");
const editProjectDescription = document.getElementById("description");

const editProjectTitleError = document.getElementById('no-title');
const editProjectGoalError = document.getElementById('no-goal');
const editProjectAmountError = document.getElementById('invalid-amount');
const editProjectDescriptionError = document.getElementById('no-description');

if (editProjectForm){

    editProjectForm.addEventListener("submit", (event)  => {
        if (editProjectTitle.value && editProjectGoal.value && editProjectDescription.value.length > 0) {
            if (editProjectGoal.value <= 0) {
                event.preventDefault();
                editProjectGoalError.hidden = true;
                editProjectAmountError.hidden = false;
                //see new-project comments
                newProjectTitleError.hidden =true;
                newProjectDescriptionError.hidden = true;
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
                editProjectAmountError.hidden = editProjectGoal.value > 0;
            }
            editProjectDescriptionError.hidden = editProjectDescription.value.length > 0;
        }
    });
}