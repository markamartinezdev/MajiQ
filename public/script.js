const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;
var peer = new Peer(undefined, {
    path: "/peerjs",
    host: "/",
});
let myVideoStream;
navigator.mediaDevices
    .getUserMedia({
        audio: false,
        video: {
            width: { min: 1024, ideal: 1280, max: 1920 },
            height: { min: 576, ideal: 720, max: 1080 }
        }
    })
    .then((stream) => {
        myVideoStream = stream;
        addVideoStream(myVideo, stream);
        peer.on("call", (call) => {
            call.answer(stream);
            const video = document.createElement("video");
            call.on("stream", (userVideoStream) => {
                addVideoStream(video, userVideoStream);
            });
        });
        socket.on("user-connected", (userId) => {
            connectToNewUser(userId, stream);
        });
    });
const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
    });
};
peer.on("open", (id) => {
    socket.emit("join-room", ROOM_ID, id);
});
const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
        videoGrid.append(video);
    });
};