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
const registerInvalidEmailError = document.getElementById("invalid-email");
const registerPasswordError = document.getElementById("no-password");
const registerConfirmPasswordError = document.getElementById("no-password-confirmation");
const registerPasswordShort = document.getElementById("password-short");
const registerPasswordsMismatch = document.getElementById('passwords-mismatch');
const registerCityError = document.getElementById("no-city");
const registerStateError = document.getElementById("no-state");

const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

if (registerForm) {

    registerForm.addEventListener("submit", (event) => {
        if(registerFirstName.value && registerLastName.value && registerEmail.value && registerPassword.value &&
            registerConfirmPassword.value && registerCity.value && registerState.value && emailRegex.test(registerEmail.value)) {
            if (registerPassword.value.length < 8) {
                event.preventDefault();
                registerPasswordShort.hidden = false;
                registerPasswordsMismatch.hidden = true;
            }
            else if(registerPassword.value === registerConfirmPassword.value)
                registerForm.submit();
            else {
                event.preventDefault();
                registerPasswordError.hidden = true;
                registerConfirmPasswordError.hidden = true;
                registerPasswordShort.hidden = true;
                registerPasswordsMismatch.hidden = registerPassword.value === registerConfirmPassword.value;
            }
        }
        else {
            event.preventDefault();
            registerFirstNameError.hidden = registerFirstName.value;
            registerLastNameError.hidden = registerLastName.value;
            if (registerEmail.value)
                registerInvalidEmailError.hidden = emailRegex.test(registerEmail.value);
            else
                registerInvalidEmailError.hidden = true;
            registerEmailError.hidden = registerEmail.value;
            registerPasswordError.hidden = registerPassword.value;
            if(registerPassword.value)
                registerPasswordShort.hidden = registerPassword.value.length >= 8;
            else
                registerPasswordShort.hidden = true;
            if (registerPassword.value)
                registerConfirmPasswordError.hidden = registerConfirmPassword.value;
            else
                registerConfirmPasswordError.hidden = true;
            if (registerPassword.value && registerConfirmPassword.value)
                registerPasswordsMismatch.hidden = registerPassword.value === registerConfirmPassword.value;
            else
                registerPasswordsMismatch.hidden = true;
            registerCityError.hidden = registerCity.value;
            registerStateError .hidden = registerState.value;
        }
    })
}

