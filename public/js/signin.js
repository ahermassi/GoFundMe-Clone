const signinForm = document.getElementById("signin-form");
if(signinForm){
    const emailElement = document.getElementById("email");
    const passwordElement = document.getElementById("password");
    const errorDiv = document.getElementById('error')
    signinForm.addEventListener("submit", event => {
        
        if (emailElement.value && passwordElement.value){
            signinForm.submit()
        }
        else{
            event.preventDefault();
            errorDiv.hidden = false;
            errorDiv.innerHTML = 'You Must Enter a valid email and password!';
            emailElement.focus()
            passwordElement.focus()
        }

    })

}



