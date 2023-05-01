const socket = io("/");
const videoGrid = document.getElementById("video-grid");
let Template = document.getElementById('cell-template')
let template = Template.content.valueOf()
let myVideo = null
var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: PORT
});
const playerIds = []
let playerName = ''
let playerId = ''
let playerLife = 40
let myVideoStream;
navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: {
      width: { min: 1024, ideal: 1280, max: 1920 },
      height: { min: 576, ideal: 720, max: 1080 }
    }
  })
  .then((stream) => {
    myVideoStream = stream;
    template = Template.innerHTML
    addVideoStream(template, stream);
    peer.on("call", (call) => {
      call.answer(stream);
      template = Template.innerHTML
      call.on("stream", (userVideoStream) => {
        addVideoStream(template, userVideoStream);
      });
    });
    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  });
const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  template = Template.innerHTML
  call.on("stream", (userVideoStream) => {
    if (!playerIds.includes(userId)) {
      playerIds.push(userId)
      addVideoStream(template, userVideoStream);
    }
  });
};
peer.on("open", (id) => {
  // Get saved data from sessionStorage
  socket.emit("join-room", ROOM_ID, id);
});

const addVideoStream = (template, stream) => {
  const videoCell = document.createElement('div')
  videoCell.innerHTML = template
  const video = videoCell.querySelector('video');
  video.srcObject = stream;
  video.muted = true;
  // video.setAttribute('player-id', playerId)
  video.addEventListener("loadedmetadata", () => {
    video.play();
    videoGrid.append(videoCell);
  });
  // if (!stream) {
  //   video.style.display = 'none';
  //   // video.setAttribute('player-id', playerId)
  //   const blankBox = document.createElement('div');
  //   blankBox.classList.add('blank-box');
  //   template.appendChild(blankBox);
  // } else {
  //   video.muted = true;
  //   video.srcObject = stream;
  //   // video.setAttribute('player-id', playerId)
  //   video.addEventListener("loadedmetadata", () => {
  //     video.play();
  //     videoGrid.append(videoCell);
  //   });
  // }
};


const videoButton = document.getElementById('toggle-video-button');
videoButton.classList.add('active');

const toggleVideo = (element) => {
  const placeholder = document.querySelector('.placeholder');
  const video = document.querySelector('video');

  if (element.classList.contains('active')) {
    element.classList.remove('active');
    myVideo?.pause();
    video.style.visibility = 'hidden';
    if (placeholder) {
      placeholder.style.display = 'block';
    }
  } else {
    element.classList.add('active');
    myVideo?.play();
    video.style.visibility = 'visible';
    if (placeholder) {
      placeholder.style.display = 'none';
    }
  }
};

const toggleMute = (element) => {
  var videoStream = document.querySelector('video');
  element.classList.toggle('active');
  if (element.classList.contains('active')) {
    videoStream.muted = false;
  }
  else {
    videoStream.muted = true;
  }
  video.muted = !video.muted;
};

const toggleReset = (element) => {
  const box = document.querySelector('.cell_playerlife_value');
  element.classList.add('active');

  box.value = Math.min(Number(box.value) + 40, 40);
  changeInputColor(box, box.value);
};

const handleDeath = (deathButton) => {
  const deathScreen = document.createElement('div');
  deathScreen.classList.add('death-screen');
  deathScreen.innerText = 'YOU DIED!';
  deathScreen.style.width = '643.55px';
  deathScreen.style.height = '362px';
  deathScreen.style.position = 'absolute';
  deathScreen.style.top = '0';
  deathScreen.style.left = '0';
  deathScreen.style.background = 'rgba(0, 0, 0, 0.7)';
  deathScreen.style.color = 'red';
  deathScreen.style.display = 'flex';
  deathScreen.style.alignItems = 'center';
  deathScreen.style.justifyContent = 'center';
  document.querySelector('.cell').appendChild(deathScreen);
  deathButton.style.display = 'none';
  toggleVideo(videoButton);
};

const toggleDeath = (element) => {
  if (element.classList.contains('active')) {
    document.querySelector('.death-screen').remove();
    element.classList.remove('active');
  }
  else {
    element.classList.add('active');
    handleDeath(element);
  }
};

document.addEventListener('keydown', (event) => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
    event.preventDefault();
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
      debugger
    }
    const box = document.querySelector('.cell_playerlife_value');
    if (!box) return;

    box.value = parseInt(box.value) + (["ArrowUp", "ArrowRight"].includes(event.key) ? 1 : -1);
    changeInputColor(box, box.value);
  }
});

function reduceLife(element) {
  const box = element.parentNode.querySelector('.cell_playerlife_value');
  if (!box) return;

  box.value = parseInt(box.value) - 1;
  changeInputColor(box, box.value);
  playerLife -= 1
}

function addLife(element) {
  const box = element.parentNode.querySelector('.cell_playerlife_value');
  if (!box) return;

  box.value = parseInt(box.value) + 1;
  changeInputColor(box, box.value);
  playerLife += 1
}


function changeInputColor(input, value) {
  input.classList.remove("cell_playerlife_value-red", "cell_playerlife_value-yellow", "cell_playerlife_value-white", "cell_playerlife_value-green");
  if (value <= 10) {
    input.classList.add("cell_playerlife_value-red");
  } else if (value >= 11 && value <= 20) {
    input.classList.add("cell_playerlife_value-yellow");
  } else if (value >= 40) {
    input.classList.add("cell_playerlife_value-green");
  } else {
    input.classList.add("cell_playerlife_value-white");
  }
}

// Collapse Chat/Game Log
function toggleCollapse(element) {
  const target = element.dataset.target;
  const isCollapsed = element.classList.contains('collapsed');

  if (isCollapsed) {
    element.classList.remove('collapsed');
    document.getElementById(target).style.display = 'block';
    button.classList.toggle("active");
  } else {
    element.classList.add('collapsed');
    document.getElementById(target).style.display = 'none';
    button.classList.toggle("active");
  }
}

// Add event listener to collapse button
document.getElementById('collapse-button').addEventListener('click', toggleCollapse);

//Button Customization
function toggleCollapse(element, button) {
  if (element.classList.contains('collapsed')) {
    element.classList.remove('collapsed');
    if (button) {
      button.innerHTML = '<span><i class="fas fa-comment"></i></span>';
    }
  } else {
    element.classList.add('collapsed');
    if (button) {
      button.innerHTML = '<span><i class="fas fa-comment-slash"></i></i></span>';
    }
  }
}

//Card Search
function search(button) {
  // Get the search term from the text field
  var searchTerm = document.getElementById("searchTerm").value;

  // Make a request to the search endpoint
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://mtg.pingadulce.com/card?searchTerm=" + searchTerm);
  xhr.onload = function () {
    if (xhr.status === 200) {
      // The request was successful, so parse the results
      var results = JSON.parse(xhr.responseText);

      // Display the results
      for (var i = 0; i < results.length; i++) {
        var result = results[i];
        var title = result.title;
        var image = result.image;

        // Create a paragraph element to display the title
        var paragraph = document.createElement("p");
        paragraph.textContent = title;

        // Create an image element to display the image
        var imageElement = document.createElement("img");
        imageElement.src = image;

        // Append the paragraph and image element to the results div
        $("#results").append(paragraph);
        $("#results").append(imageElement);
      }
    } else {
      // The request failed, so display an error message
      alert("Error: " + xhr.status);
    }
  };
  xhr.send();
}

function closePopup() {
  // Hide the popup
  $("#searchPopup").hide();
}

// When the user clicks on a result, add it to the messages ul
$("#results").on("click", ".result", function () {
  var title = $(this).text();
  var li = document.createElement("li");
  li.textContent = title;
  $(".messages").append(li);
  closePopup();
});