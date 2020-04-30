const registerForm = document.getElementById("register-form");

const registerFirstName = document.getElementById("first_name");
const registerLastName = document.getElementById("last_name");
const registerEmail = document.getElementById("email");
const registerPassword = document.getElementById("password");
const registerConfirmPassword = document.getElementById("password_confirm");
const registerCity = document.getElementById("city");
const registerState = document.getElementById("state");

const registerFirstNameError = document.getElementById("no-first-name");
const registerLastNameError = document.getElementById("no-last-name");
const registerEmailError = document.getElementById("no-email");
const registerPasswordError = document.getElementById("no-password");
const registerConfirmPasswordError = document.getElementById("no-password-confirmation");
const registerPasswordsMismatch = document.getElementById('passwords-mismatch');
const registerCityError = document.getElementById("no-city");
const registerStateError = document.getElementById("no-state");

if (registerForm) {

    registerForm.addEventListener("submit", (event) => {
        if(registerFirstName.value && registerLastName.value && registerEmail.value && registerPassword.value &&
            registerConfirmPassword.value && registerCity.value && registerState.value) {
            if(registerPassword.value === registerConfirmPassword.value)
                registerForm.submit();
            else {
                event.preventDefault();
                registerPasswordError.hidden = true;
                registerConfirmPasswordError.hidden = true;
                registerPasswordsMismatch.hidden = registerPassword.value === registerConfirmPassword.value;
            }
        }
        else {
            event.preventDefault();
            registerFirstNameError.hidden = registerFirstName.value;
            registerLastNameError.hidden = registerLastName.value;
            registerEmailError.hidden = registerEmail.value;
            registerPasswordError.hidden = registerPassword.value;
            registerConfirmPasswordError.hidden = registerConfirmPassword.value;
            registerCityError.hidden = registerCity.value;
            registerStateError .hidden = registerState.value;
        }
    })
}

