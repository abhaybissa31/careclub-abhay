async function fnRightChats(name, uid, img) {
  a = document.getElementById("chatName");
  b = document.getElementById("hiddenChatName");
  c = document.getElementById("rightImage");
  // d = document.getElementById('rightImage').style.display='none';
  // c.style.display='none';
  // console.log("image type is ", typeof (img));
  // console.log("image", img);
  // console.log(name, uid, img)
  a.innerHTML = name;
  b.value = uid;
  console.log(img);
  if (img.length == 0) {
    c.src = "images/event/user.png";
    c.style.display = "block";
  } else {
    c.src = img;
    c.style.display = "block";
  }

  try {
    const response = await fetch(`http://localhost:3000/chat`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({ recid }) // Send the message in the request body
    });
    // console.log('------------------ressss---------------------',response)
  } catch (err) {
    console.error(err);
  }

  chatDetail = `<%- JSON.stringify(chatDetails)%>`;
  console.log(typeof chatDetail);
}
// c.src=img;
// img = null ?? '/images/event/user.png';
// c.src=img;

async function fnName(recid, createdId, imgTop) {
  let chatName = document.getElementById("chatName");
  let hiddenchatName = document.getElementById("hiddenChatName");
  let c = document.getElementById("rightImage");

  console.log(
    "------------------------------created id-------------",
    createdId
  );
  chatName.innerText = recid;
  if (imgTop.length == 0) {
    c.style.display = "block";
    c.src = "images/event/user.png";
  } else {
    c.style.display = "block";
    c.src = imgTop;
  }
  hiddenchatName.value = createdId;

  try {
    const response = await fetch(`http://localhost:3000/chat/${createdId}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recid }), // Send the message in the request body
    });

    // console.log(json1)
    // console.log('heloooooooooooooooooooooo')
    let recMessage1 = document.getElementById("recmessage");
    let messagecontainer = document.getElementById("message-container");

    // Clear old data
    recMessage1.innerHTML = "";
    messagecontainer.innerHTML = "";

    let recData = await response.json();
    const { temp12, chatDetailsSend, allChatData, loggedUser } = recData;
    // console.log('-------------------chatdetails', allChatData);
    // Sort allChatData by created time in ascending order

    // Clear old data
    // Clear old data
    document.getElementById("msgShow").innerHTML = "";
    document.getElementById("message-container").innerHTML = "";

    // Combine sender and receiver messages
    const allMessages = [...allChatData];

    // Sort all messages by created time in ascending order
    // Sort all messages by created time in ascending order
    allMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    // console.log(allMessages)
    // Append messages to respective containers in conversation order
    console.log("-ccccccccccccreaaaaaaaaaaaaaaaaaa", allMessages);
    allMessages.forEach((element) => {
      let messageText = `${element.msg}`;
      let time = formatDate(element.createdAt);

      let messageContainer = createMessageContainer(messageText, time);

      if (element.sender_id === loggedUser) {
        messageContainer.id = "messageLeft"; // Assign unique ID for left-positioned message
        pt = document.getElementById("msgShow");
        pt.append(messageContainer);
        messageContainer.style.position = "relative";
        messageContainer.style.left = "19em";
        // messageContainer.style.backgroundColor="black"
        // pt.style.backgroundColor="black"
      } else {
        messageContainer.id = "messageRight"; // Assign unique ID for right-positioned message

        pt = document.getElementById("msgShow");
        pt.append(messageContainer);
        messageContainer.style.position = "relative";
        messageContainer.style.right = "0em";
        messageContainer.style.backgroundColor = "white"; // Set background color for right-positioned message
        // pt.style.background="red"
      }

      //  d = document.getElementById('imgP')
    });

    // Function to create a message container with message and time
    function createMessageContainer(message, time) {
      let container = document.createElement("div");
      container.classList.add("message-container");

      let messageElement = document.createElement("p");
      messageElement.textContent = message;

      let timeElement = document.createElement("span");
      timeElement.classList.add("time");
      timeElement.textContent = time;

      container.appendChild(messageElement);
      container.appendChild(timeElement);

      return container;
    }

    // Function to format date
    function formatDate(dateString) {
      const options = {
        hour: "numeric",
        minute: "numeric",
        month: "long",
        day: "numeric",
        hour12: true,
      };
      const formattedDate = new Date(dateString).toLocaleDateString(
        "en-US",
        options
      );
      return formattedDate;
    }

    // <div class="outgoing-msg">
    //       <div class="outgoing-chats-msg">
    //         <p class="multi-msg" id="message-container">
  } catch (e) {
    console.log("some kinda error shiiittttt", e);
  }
}

function autocomplete(inp, arr, uid1, imgTop) {
  // console.log(uid1)
  /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    var a,
      b,
      i,
      c,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    a.style.fontSize = "18px";

    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);

    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML +=
          "<input type='hidden' id='suggestedUserName' value='" +
          arr[i] +
          "' />";
        b.innerHTML +=
          "<input type = 'hidden' id='suggestHiddenId' value='" +
          uid[i] +
          "' />";
        let imgTopTop = imgTop[i];
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          let uid = this.getElementsByTagName("input")[1].value;
          // let createdId = document.getElementById("suggestHiddenId")[0].value;
          // Value which we need in order to find name
          fnName(inp.value, uid, imgTopTop);
          // window.value = inp.value

          /*close the list of autocompleted values,
            (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
    // alert(window.value)
  });

  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

/*An array containing all the country names in the world:*/
let countries = [],
  temp = [];
countries = `<%= createdUname%>`.split(",");
console.log(countries);
let uid = [];
uid = `<%= createdId %>`.split(",");
// console.log(uid)
let imgTop = [];
imgTop = `<%= createdImg %>`.split(",");
// console.log(imgTop)
/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("myInput"), countries, uid, imgTop);

// Assuming the 'io' variable is defined elsewhere
const socker = io(); // Connect to the server using Socket.IO
const sendBtn = document.getElementById("send-button");
const msgInput = document.getElementById("message");
const recMessage = document.getElementById("message-container");
let socket = socker;

function postMessage() {
  const recid = document.getElementById("hiddenChatName").value; // Recipient's ID

  // // Assuming user is authenticated and their _id is stored in userId variable
  // const userId = `<%= // loggedUser %>`; // Get the authenticated user's _id from session or wherever it's stored
  // // console.log('herei s s s s s s s  s ss  s s',userId)
  // let obj = {
  //   id: recid,
  //   message: msgInput.value,
  //   userId: userId // Sending authenticated user's _id along with the message
  // }
  // // console.log('sssssssssssssssssssssssssssssssss',obj)
  // socket.on("connect", () => {
  //   socket.emit("message", obj);
  // });

  // socket.on("io-recived-message", (message) => {
  //                           // this recives the  all cuircuit information
  //                           console.log('emited rec')
  //                           console.log("io messaage:", message);
  //                         });

  // Rest of your code...

  // const recid = document.getElementById('hiddenChatName').value; // Recipient's ID
  // console.log('------------------------------recid', recid)
  //   let obj = {
  //   id: recid,
  //   message: msgInput.value,
  // }

  // console.log('id---------------',recid,'----------msg',msgInput.value)

  // socker.on("connect", () => {
  //   socker.emit("message", obj);
  //   // socker.emit("message", "helllo");
  //   socket = socker; // Assign the socket reference when connection is established
  //   // console.log(socker.id);
  //   socket.on("io-recived-message", (message) => {
  //     // this recives the  all cuircuit information
  //     console.log("io messaage:", message);
  //   });

  // });

  sendBtn.addEventListener("click", async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    let recid = document.getElementById("chatName").innerText;
    const message = msgInput.value;
    // socket.emit("user-message", message);

    try {
      const response = await fetch("http://localhost:3000/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, recid }), // Send the message in the request body
      });

      if (response.ok) {
        console.log("Message sent successfully.");
        msgInput.value = "";
      } else {
        console.error(
          "Failed to send message. Server responded with status:",
          response.status
        );
      }
      msgInput.value = "";
      window.location.href = "http://localhost:3000/chat";
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });
}

// Redirecting the user to a new URL

// const socket = io()
// const messageContainer = document.getElementById('message-container')
// const messageForm = document.getElementById('send-container')
// const messageInput = document.getElementById('message-input')

// const name = prompt('What is your name?')
// appendMessage('You joined')
// socket.emit('new-user', name)

// socket.on('chat-message', data => {
//   appendMessage(`${data.name}: ${data.message}`)
// })

// socket.on('user-connected', name => {
//   appendMessage(`${name} connected`)
// })

// socket.on('user-disconnected', name => {
//   appendMessage(`${name} disconnected`)
// })

// messageForm.addEventListener('submit', e => {
//   e.preventDefault()
//   const message = messageInput.value
//   appendMessage(`You: ${message}`)
//   socket.emit('send-chat-message', message)
//   messageInput.value = ''
// })

// function appendMessage(message) {
//   const messageElement = document.createElement('div')
//   messageElement.innerText = message
//   messageContainer.append(messageElement)
// }
