const signInForm = document.getElementById("signin-form");
const emailElement = document.getElementById("email");
const passwordElement = document.getElementById("password");
const emailError = document.getElementById('no-email');
const passwordError = document.getElementById('no-password');

if(signInForm) {

    signInForm.addEventListener("submit", (event) => {
        
        if (emailElement.value && passwordElement.value) {
            emailError.hidden = true;
            passwordError.hidden = true;
            signInForm.submit();
        } else {
            event.preventDefault();
            emailError.hidden = emailElement.value;
            passwordError.hidden = passwordElement.value;
        }
    })
}



