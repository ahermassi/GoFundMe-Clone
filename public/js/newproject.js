const newProjectForm = document.getElementById("new-project-form");

const title = document.getElementById("title");
const goal = document.getElementById("goal");
const description = document.getElementById("description");

const titleError = document.getElementById('no-title');
const goalError = document.getElementById('no-goal');
const amountError = document.getElementById('invalid-amount');
const descriptionError = document.getElementById('no-description');

if (newProjectForm){

    newProjectForm.addEventListener("submit", (event)  => {
        if (title.value && goal.value && description.value.length > 0) {
            if (goal.value <= 0) {
                event.preventDefault();
                goalError.hidden = true;
                amountError.hidden = false;
            }
            else
                newProjectForm.submit();
        }
        else {
            event.preventDefault();
            titleError.hidden = title.value;
            goalError.hidden = goal.value;
            if (goal.value) {
                goalError.hidden = true;
                amountError.hidden = goal.value > 0;
            }
            descriptionError.hidden = description.value.length > 0;
        }
    });
}