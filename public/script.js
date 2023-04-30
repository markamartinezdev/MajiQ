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
  element.classList.toggle('active');
  myVideo.muted = !myVideo.muted;
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
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault();

    const box = document.querySelector('.cell_playerlife_value');
    if (!box) return;

    box.value = parseInt(box.value) + (event.key === 'ArrowUp' ? 1 : -1);
    changeInputColor(box, box.value);
  }
});

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

