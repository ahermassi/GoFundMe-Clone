const editProjectForm = document.getElementById("edit-project-form");
if (editProjectForm){
    const editTitle = document.getElementById("title");
    const editGoal = document.getElementById("goal");
    const editDescription = document.getElementById("description");
    const editErrorDiv = document.getElementById("errordiv");
    editProjectForm.addEventListener("submit", event =>{
        if (editTitle.value && editGoal.value && editDescription.value){
            try{
                editGoalValue = parseInt(editGoal.value)
                if (editGoalValue <= 0){
                    throw 'project goal cant be less than or equal to zero'
                }
                editProjectForm.submit()

            }
            catch(e){
                event.preventDefault();
                editErrorDiv.hidden = false;
                editErrorDiv.innerHTML = e;
            }
        }
        else{
            event.preventDefault();
            editErrorDiv.hidden = false;
            editErrorDiv.innerHTML = 'you must provide a valid project title, project goal and project description to edit'
        }


    })
}