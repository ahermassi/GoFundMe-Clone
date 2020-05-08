let donationForm = document.getElementById("donate-project");
let donationInput = document.getElementById("donation");
let errorDiv1 = document.getElementById("empty-donation");
let flag = false;
if(donationForm){
    donationForm.addEventListener("submit", (event) =>{
        if(!donationInput.value){
            event.preventDefault();
            errorDiv1.hidden = false;
            errorDiv1.innerHTML = 'Donation cannot be empty';
            errorDiv1.focus();
            flag = true;

        }
        else{
            if (isNaN(donationInput.value)){
                event.preventDefault();
                errorDiv1.hidden = false;
                errorDiv1.innerHTML = 'Donation needs to be a number'
                flag = true;

            }
            if (parseFloat(donationInput.value) <= 0){
                event.preventDefault();
                errorDiv1.hidden = false;
                errorDiv1.innerHTML = 'Donation needs to be greater than zero'
                flag = true;

            }

            
        }

        if(!flag){
            errorDiv1.hidden = true;
            donationForm.submit();
        }


    })
}