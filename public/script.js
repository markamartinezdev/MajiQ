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
    socket.emit("join-room", ROOM_ID, key);
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

const toggleMute = (element) => {
    if (element.classList.contains('active')) {
        element.classList.remove('active')
    }
    else {
        element.classList.add('active')
    }

    myVideo.mute = !myVideo.mute
}

const box = document.querySelector(".box");

document.addEventListener("keydown", (event) => {
  // Check if the key pressed is up or down arrow
  if (event.keyCode === 38 || event.keyCode === 40) {
    // Prevent the default action of the key press
    event.preventDefault();

    // Check if the target of the event is the box
    if (event.target === box) {
      // Step the box up or down
      box.stepUp(event.keyCode === 38 ? 1 : -1);
    } else {
      // Step the default box up or down
      document.querySelector(".box").stepUp(event.keyCode === 38 ? 1 : -1);
    }
  }
});
