function fetch($) {
    var requestConfig = {
        method: 'post',
        url: '/projects/fetch',
        contentType: 'application/json',
        data: JSON.stringify({
            project_id: $('#project_id').val(),
        })
    };

    $.ajax(requestConfig).then(function (responseMessage) {
        var data = $(responseMessage);
        $('#number-of-donors').text(data.selector.split(' ')[0]);
        $('#current-collected').text((parseFloat(data.selector.split(' ')[1])).toLocaleString());
    });

}

setInterval(function() {
    fetch(window.jQuery) // this will run after every 5 seconds
}, 7500);