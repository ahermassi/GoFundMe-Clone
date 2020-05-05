const signInForm = document.getElementById("signin-form");
const loginEmail = document.getElementById("email");
const loginPassword = document.getElementById("password");
const loginEmailError = document.getElementById('no-email');
const loginPasswordError = document.getElementById('no-password');

if(signInForm) {

    signInForm.addEventListener("submit", (event) => {
        
        if (loginEmail.value && loginPassword.value) {
            loginEmailError.hidden = true;
            loginPasswordError.hidden = true;
            signInForm.submit();
        } else {
            event.preventDefault();
            loginEmailError.hidden = loginEmail.value;
            loginPasswordError.hidden = loginPassword.value;
            
        }
    })
}



