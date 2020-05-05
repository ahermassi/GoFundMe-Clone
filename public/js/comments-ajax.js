(function($) {
    var commentForm = $('#comment-form'), newComments = $('#new-comments');
    
    commentForm.submit(function(event) {
        event.preventDefault();
        var comment = $('#comment').val(), projectId = $('#project_id').val();

        if(newComments) {
            var requestConfig = {
                method: 'POST',
                url: '/projects/comment',
                contentType: 'application/json',
                data: JSON.stringify({
                    project_id: projectId,
                    comment: comment,
                })
            };

            $.ajax(requestConfig).then(function (responseMessage) {
                var newElement = $(responseMessage);
                newComments.append(newElement);
                $('#comment').val('');
            });
        }
    })

})(window.jQuery);