(function($) {
    var donationForm = $('#donation-form'), donationSuccessful = $('#donation-successful'),
        donationInputError = $('#donation-error'), currentCollected = $('#current-collected');

    donationForm.submit(function(event) {
        event.preventDefault();
        var donation = $('#donation').val(), projectId = $('#project_id').val();

        if (!donation) {
            donationInputError.removeAttr('hidden');
            donationInputError.text('Donation cannot be empty');
        }

        else if (!$.isNumeric(donation)) {
            donationInputError.removeAttr('hidden');
            donationInputError.text('Donation has to be a number');
        }

        else if (donation < 0) {
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
                var t = newElement.text();
                var totalDonors = t.split('.')[1];
                donationSuccessful.html(t.split('.')[0]);
                $('#number-of-donors').text(totalDonors);
                // Update the total money collected in the page
                var previousAmount = parseFloat($('#current-collected').text().replace(',', ''));
                currentCollected.text((previousAmount + parseFloat(donation)).toLocaleString());
                $('#donation').val('');
            });
        }

    })

})(window.jQuery);