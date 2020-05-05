let form = document.getElementById('comment-form');
let commentInput = document.getElementById('comment');
let errorDiv = document.getElementById('empty-comment');

form.addEventListener('submit', (event) => {
   event.preventDefault();
   if(!commentInput.value) {
       errorDiv.hidden = false;
       errorDiv.innerHTML = 'Comment can\'t be empty!';
       errorDiv.focus();
   }
   else
       errorDiv.hidden = true;
});
