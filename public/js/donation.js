let donationForm = document.getElementById("donation-form");
let donationInput = document.getElementById("donation");
let donationInputError = document.getElementById("donation-error");
let errorExists = false;

if(donationForm) {
    donationForm.addEventListener("submit", (event) => {
        if(!donationInput.value) {
            event.preventDefault();
            donationInputError.hidden = false;
            donationInputError.innerHTML = 'Donation cannot be empty';
            donationInput.focus();
            errorExists = true;

        }
        else {
            if (isNaN(donationInput.value)) {
                event.preventDefault();
                donationInputError.hidden = false;
                donationInputError.innerHTML = 'Donation needs to be a number';
                errorExists = true;

            }
            if (parseFloat(donationInput.value) <= 0) {
                event.preventDefault();
                donationInputError.hidden = false;
                donationInputError.innerHTML = 'Donation needs to be greater than zero';
                errorExists = true;

            }
        }

        if(!errorExists) {
            donationInputError.hidden = true;
            donationForm.submit();
        }
    })
}