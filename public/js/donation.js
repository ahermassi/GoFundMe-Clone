(function($) {
    var donationForm = $('#donation-form'), donationSuccessful = $('#donation-successful'),
        donationInputError = $('#donation-error'), currentCollected = $('#current-collected');

    donationForm.submit(function(event) {
        event.preventDefault();
        var donation = $('#donation').val(), projectId = $('#project_id').val();
        var regex = /^\d\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;
        if (!donation) {
            donationInputError.removeAttr('hidden');
            donationInputError.text('Donation cannot be empty');
        }

        else if (!$.isNumeric(donation)) {
            donationInputError.removeAttr('hidden');
            donationInputError.text('Donation has to be a number');
        }

        else if(!regex.test(donation)){
            donationInputError.removeAttr('hidden');
            donationInputError.text('Donation has to a currency with at mots 2 decimal digits');
        }
        else if (donation <= 0) {
            donationInputError.removeAttr('hidden');
            donationInputError.text('Donation needs to be greater than zero');
        }

        else {
            donationInputError.attr('hidden', true);
            var requestConfig = {
                method: 'POST',
                url: '/projects/donate',
                contentType: 'application/json',
                data: JSON.stringify({
                    project_id: projectId,
                    donation: donation,
                })
            };

            $.ajax(requestConfig).then(function (responseMessage) {
                var newElement = $(responseMessage);
                var totalDonors = newElement.text().split('.')[1];
                donationSuccessful.html(newElement.text().split('.')[0]);
                $('#number-of-donors').text(totalDonors);
                // Update the total money collected in the page
                var previousAmount = parseFloat($('#current-collected').text().replace(',', ''));
                currentCollected.text((previousAmount + parseFloat(donation)).toLocaleString());
                $('#donation').val('');
            });
        }

    })

})(window.jQuery);