window.onload = function() {


  var fileUpload = document.querySelector(".file-upload");
  var profilePic = document.querySelector(".profile-pic");
  var uploadButton = document.querySelector(".upload-button");
  var si = document.querySelector(".squarepic");

  var readURL = function(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function(e) {
        profilePic.setAttribute('src', e.target.result);
        profilePic.style.objectFit = 'cover';
      }

      reader.readAsDataURL(input.files[0]);
    }
  }

  profilePic.addEventListener('click', function() {
    fileUpload.click();
  });

  fileUpload.addEventListener('change', function() {
    readURL(this);
  });

 

 

  
}