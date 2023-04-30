const socket = io("/");
const videoGrid = document.getElementById("video-grid");
let Template = document.getElementById('cell-template')
let template = Template.content.valueOf()
let myVideo = null
var peer = new Peer(undefined, {
    path: "/peerjs",
    host: "/",
    port: '3030'
});
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
        myVideo = template.querySelector('video');
        addVideoStream(template, stream);
        peer.on("call", (call) => {
            call.answer(stream);
            template = JSON.parse(JSON.stringify(Template.content))
            call.on("stream", (userVideoStream) => {
                addVideoStream(template, userVideoStream);
            });
        });
        socket.on("user-connected", (userId) => {
            let key = sessionStorage.getItem("userId")
            key = key ?? userId
            sessionStorage.setItem("userId", key)
            connectToNewUser(userId, stream);
        });
    });
const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    template = JSON.parse(JSON.stringify(Template.content))

    call.on("stream", (userVideoStream) => {
        addVideoStream(template, userVideoStream);
    });
};
peer.on("open", (id) => {
    // Get saved data from sessionStorage
    let key = sessionStorage.getItem("userId")
    key = key ?? id
    sessionStorage.setItem("userId", key)
    socket.emit("join-room", ROOM_ID, id);
});

const addVideoStream = (template, stream) => {
    const video = template.querySelector('video');
    video.muted = true;
    video.srcObject = stream;
    videoGrid.append(template);
    video.addEventListener("loadedmetadata", () => {
        video.play();
    });
};

const videoButton = document.getElementById('toggle-video-button');
videoButton.classList.add('active');

const toggleVideo = (element) => {
  const placeholder = document.querySelector('.placeholder');

  if (element.classList.contains('active')) {
    element.classList.remove('active');
    myVideo?.pause();
    myVideo?.style.setProperty('display', 'none');
    placeholder.style.display = 'block';
  } else {
    element.classList.add('active');
    myVideo?.play();
    myVideo?.style.setProperty('display', 'block');
    placeholder.style.display = 'none';
  }
};

const toggleMute = (element) => {
  element.classList.toggle('active');
  myVideo.muted = !myVideo.muted;
};

const toggleReset = (element) => {
    const box = document.querySelector('.box');
    box.value = 40;
    changeInputColor(box, box.value);
    if (element.classList.contains('active')) {
      element.classList.remove('active');
    } else {
      element.classList.add('active');
    }
  };
  

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault();

    const box = document.querySelector('.box');
    if (!box) return;

    box.value = parseInt(box.value) + (event.key === 'ArrowUp' ? 1 : -1);

    if (myVideo && !myVideo.paused) {
        if (box.value <= 0 && !document.querySelector('.overlay')) {
          toggleVideo(videoButton);
          const overlay = document.createElement('div');
          overlay.classList.add('overlay');
          const message = document.createElement('p');
          message.innerText = 'YOU DIED!';
          overlay.appendChild(message);
          document.querySelector('.cell').appendChild(overlay);
        }
        else if (myVideo.paused && document.querySelector('.overlay')) {
          document.querySelector('.overlay').remove();
          toggleVideo(videoButton);
        }
      }
      

    changeInputColor(box, box.value);
  }
});

function changeInputColor(input, value) {
    input.classList.remove("box-red", "box-yellow", "box-white", "box-green");
    if (value <= 10) {
        input.classList.add("box-red");
    } else if (value >= 11 && value <= 20) {
        input.classList.add("box-yellow");
    } else if (value >= 40) {
        input.classList.add("box-green");
    } else {
        input.classList.add("box-white");
    }
}

