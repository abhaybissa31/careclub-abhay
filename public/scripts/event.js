window.onload = function() {


  var fileUpload = document.querySelector(".file-upload");
  var profilePic = document.querySelector(".profile-pic");
  var uploadButton = document.querySelector(".upload-button");
  var si = document.querySelector(".squarepic");
  var post = document.querySelector(".post");
  var left = document.querySelector(".left");
  var right = document.querySelector(".right");
  var cen = document.querySelector(".cen");
  var home = document.querySelector(".home");
  var profile = document.querySelector(".profile");
 var comment = document.querySelector(".commentmodal")
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

  post.addEventListener('click',function handlepost(){
    cen.style.display="none";
    left.style.display="block";
    right.style.display="none";
    console.log("clicked");
    
  });

  home.addEventListener('click',function handlepost(){
    cen.style.display="block";
    left.style.display="none";
    right.style.display="none";
    console.log("clicked");
  });

  profile.addEventListener('click',function handlepost(){
    cen.style.display="none";
    left.style.display="none";
    right.style.display="none";
    window,location.href="/profile/profile.php";
    console.log("clicked");
  });
// Get all the heart icons and like count elements
const likeBtns = document.querySelectorAll('.heart-icon');
const numberOfLikesElements = document.querySelectorAll('.number-of-likes');

// Initialize an array to track the likes
const likes = new Array(likeBtns.length).fill(false);

// Function to handle like click
const likeClick = (index) => {
  likes[index] = !likes[index];
  if (likes[index]) {
    likeBtns[index].classList.add('isLiked');
    numberOfLikesElements[index].textContent = parseInt(numberOfLikesElements[index].textContent) + 1;
  } else {
    likeBtns[index].classList.remove('isLiked');
    numberOfLikesElements[index].textContent = parseInt(numberOfLikesElements[index].textContent) - 1;
  }
};

// Add click event listeners to each like button
likeBtns.forEach((likeBtn, index) => {
  likeBtn.addEventListener('click', () => likeClick(index));
});


const showMoreLinks = document.querySelectorAll('.show-more a');

showMoreLinks.forEach(link => {
  link.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default behavior (page scrolling)

    const content = this.parentElement.previousElementSibling;
    const linkText = this.textContent.toUpperCase();

    if (linkText === 'SHOW MORE') {
      this.textContent = 'Show less';
      content.classList.remove('hideContent');
      content.classList.add('showContent');
    } else {
      this.textContent = 'Show more';
      content.classList.remove('showContent');
      content.classList.add('hideContent');
    }
  });
});// Select all upvote buttons and add click event listeners
const upvoteButtons = document.querySelectorAll(".upvote");

upvoteButtons.forEach(button => {
    button.addEventListener("click", () => {
        const upvoteButton = button; // The clicked "Join Event" button
        const voteCount = upvoteButton.nextElementSibling; // The vote count element next to the button
        let count = parseInt(voteCount.textContent, 10);

        if (upvoteButton.classList.contains("joined")) {
            // If already joined, reduce the count and remove the "joined" class
            count--;
            upvoteButton.classList.remove("joined");
        } else {
            // If not joined, increment the count and add the "joined" class
            count++;
            upvoteButton.classList.add("joined");
        }

        voteCount.textContent = count;
    });
});




}
