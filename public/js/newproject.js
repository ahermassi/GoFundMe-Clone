const newProjectForm = document.getElementById("new-project-form");
if (newProjectForm){
    projectTitle = document.getElementById("title");
    projectGoal = document.getElementById("goal");
    projectDescription = document.getElementById("description")
    errorDivProject = document.getElementById('errordiv')
    newProjectForm.addEventListener("submit", event =>{
        if (projectTitle.value && projectGoal.value && projectDescription.value){
            try{
                 projectGoalValue = parseInt(projectGoal.value)
                 if(projectGoalValue <=0){
                     throw 'project goal cant be less than or equal to zero'
                 }
                 newProjectForm.submit()
            }
            catch(e){
                event.preventDefault();
                errorDivProject.hidden = false;
                errorDivProject.innerHTML = e;

            }
        }
        else{
            event.preventDefault();
            errorDivProject.hidden = false;
            errorDivProject.innerHTML = 'you must provide a valid project title, project goal and project description'
        }

    })


}