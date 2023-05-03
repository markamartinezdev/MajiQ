const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
const r = document.querySelector(':root')
myVideo.muted = true;
var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: PORT
});
let playerName = ''
let playerLife = 40
let myVideoStream;
let playerId = sessionStorage.getItem("userId")
const playerIds = []
const streamIds = []
playerId = playerId ?? Date.now()
sessionStorage.setItem('userId', playerId)
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
    addVideoStream(myVideo, stream, playerId);
    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        debugger
        addVideoStream(video, userVideoStream, Date.now());
      });
    });
    socket.on("user-connected", ({ userId, playerId: streamPlayerId }) => {
      connectToNewUser(userId, stream, streamPlayerId);
    });
  });
const connectToNewUser = (userId, stream, streamPlayerId) => {
  const newCall = peer.call(userId, stream);
  newCall.on("stream", (userVideoStream) => {
    const video = document.createElement("video");
    addVideoStream(video, userVideoStream, streamPlayerId);
  });
};

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id, playerId);
});

const addVideoStream = (video, stream, streamPlayerId) => {
  const streamId = stream.id
  if (!streamIds.includes(streamId) && !playerIds.includes(streamPlayerId)) {
    const columnsCount = playerIds.length > 4 ? 3 : 2
    r.style.setProperty('--columns', columnsCount)
    let template = document.getElementById('cell-template')
    streamIds.push(streamId)
    playerIds.push(streamPlayerId)
    const videoCell = document.createElement('div')
    videoCell.setAttribute('player-id', streamPlayerId)
    videoCell.classList.add('cell')
    if (streamPlayerId == playerId) {
      videoCell.classList.add('player-cell')
    }
    videoCell.append(video)
    video.insertAdjacentHTML('beforebegin', template.innerHTML)
    video.srcObject = stream;
    video.classList.add('cell_video')
    video.addEventListener("loadedmetadata", () => {
      video.play();
      videoGrid.append(videoCell);
    });
  }
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

function toggleDeath() {
  if (document.getElementById('togglebox').checked) {
    document.getElementById('cell_deathoverlay').style.display = "inline-block";
  }
  else {
    document.getElementById('cell_deathoverlay').style.display = "none";
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
// document.getElementById('collapse-button').addEventListener('click', toggleCollapse);

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
//hi
// When the user clicks on a result, add it to the messages ul
// $("#results").on("click", ".result", function () {
//   var title = $(this).text();
//   var li = document.createElement("li");
//   li.textContent = title;
//   $(".messages").append(li);
//   closePopup();
// });