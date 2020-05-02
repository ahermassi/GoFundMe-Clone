(function($) {
    var commentForm = $('#comment-form')
        newEnteredComment = $('#comment')
        projectId = $('#project_id')
        newComment = $('#new-comment');
    
    commentForm.submit(function(event){
        event.preventDefault();

        var AddedComment = newEnteredComment.val();
        var AddToProject = projectId.val();

        if(newComment){
            var requestConfig = {
                method:'POST',
                url:'/projects/comment',
                countentType:'application/json',
                data:{
                    project_id:AddToProject,
                    comment:AddedComment,
                }
            };

            $.ajax(requestConfig).then(function(responseMessage) {
                console.log(responseMessage);
                var newElement = $(responseMessage);

                newComment.append(newElement);
            });
        }
    })

})(window.jQuery);