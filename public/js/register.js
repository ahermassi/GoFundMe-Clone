const registerForm = document.getElementById("register-form")
if (registerForm){
    firstNameElement = document.getElementById("first_name");
    lastNameElement = document.getElementById("last_name");
    emailElement = document.getElementById("email");
    passwordElement = document.getElementById("password");
    confirmPasswordElement = document.getElementById("password_confirm");
    cityElement = document.getElementById("city");
    stateElement = document.getElementById("state");
    errorDivRegister = document.getElementById("errordiv");
    registerForm.addEventListener("submit", event => {
        if(firstNameElement.value && lastNameElement.value && emailElement.value && passwordElement.value && confirmPasswordElement.value && cityElement.value && stateElement.value){
            if(passwordElement.value == confirmPasswordElement.value){
                registerForm.submit();
            }
            else{
                event.preventDefault();
                errorDivRegister.hidden = false;
                errorDivRegister.innerHTML = 'password and confirm password dont match!';
            }

        }
        //if(!firstNameElement.value || !lastNameElement.value || !emailElement.value || !passwordElement || !confirmPasswordElement.value || !cityElement.value ||  !stateElement.value){
        else{
            event.preventDefault();
            errorDivRegister.hidden = false;
            errorDivRegister.innerHTML = 'You Must Enter a valid firstname, lastname, email, password , city and state!';
            //emailElement.focus()
            //passwordElement.focus()

        }  


    })
}

