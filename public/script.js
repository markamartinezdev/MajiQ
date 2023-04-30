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
    socket.emit("join-room", ROOM_ID, id, playerName);
});

const addVideoStream = (template, stream) => {
    const video = template.querySelector('video');
    if (!stream) {
      video.style.display = 'none';
      const blankBox = document.createElement('div');
      blankBox.classList.add('blank-box');
      template.appendChild(blankBox);
    } else {
      video.muted = true;
      video.srcObject = stream;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
    }
    videoGrid.append(template);
  };
  

const videoButton = document.getElementById('toggle-video-button');
videoButton.classList.add('active');

const toggleVideo = (element) => {
    const placeholder = document.querySelector('.placeholder');
    const video = document.querySelector('video');
  
    if (element.classList.contains('active')) {
      element.classList.remove('active');
      myVideo?.pause();
      video.style.display = 'none';
      if (placeholder) {
        placeholder.style.display = 'block';
      }
    } else {
      element.classList.add('active');
      myVideo?.play();
      video.style.display = 'block';
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
    const box = document.querySelector('.box');
    element.classList.add('active');
    
    box.value = Math.min(Number(box.value) + 40, 40);
      changeInputColor(box, box.value);
  };

  
const toggleDeath = (element) => {
  if (element.classList.contains('active')){
    document.querySelector('.death-screen').remove();
    element.classList.remove('active');
  }
  else {
    element.classList.add('active');
    handleDeath();
  }
};

const handleDeath = () => {
  const deathButton = document.querySelector('#death-button');
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

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
  
      const box = document.querySelector('.box');
      if (!box) return;
  
      box.value = parseInt(box.value) + (event.key === 'ArrowUp' ? 1 : -1);

        if (myVideo && !myVideo.paused) {
          if (box.value <= 0) {
            box.value = 0;
            handleDeath();
          } else if (document.querySelector('.death-screen')) {
            document.querySelector('.death-screen').remove();
            if (myVideo.paused) {
              toggleVideo(videoButton);
            }
          } else if (myVideo.paused) {
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

