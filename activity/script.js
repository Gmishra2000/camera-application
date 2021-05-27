let videoElem = document.querySelector("video");
// let audioElem = document.querySelector("audio");
// 1.
let recordBtn = document.querySelector(".record");
let captureImgBtn = document.querySelector(".click-image");
let filterArr = document.querySelectorAll(".filter");
let filterOverlay = document.querySelector(".filter_overlay");
let timings = document.querySelector(".timing");
let filterColor = "";
let isRecording = false;
let counter = 0;
let clearObj ;
// user requirement send

let constraint = {
    // audio: true,
     video: true
}
// represents future recording
let recording = [];
let mediarecordingObjectForCurrStream;
// Promise
// The navigator represents the state and identity of the browser (i.e. the user-agent) as it exists on the web.
let userMediaPromise = navigator.mediaDevices.getUserMedia(constraint);
//  Returns a promise on passing navigator getMedia function 
// Brings the stream on UI
userMediaPromise.
    then(function (stream) {

        videoElem.srcObject = stream;
        // audioElem.srcObject = stream;
        // can be displayed through webrtc, or can be sent to anyone
        // Browser
        mediarecordingObjectForCurrStream = new MediaRecorder(stream); //makes a new object on which we are using different functions, API object
        // camera recording add -> recording array
        // this works when we call the start button
        mediarecordingObjectForCurrStream.ondataavailable = function (e) {
            recording.push(e.data);
        }
        // download
        mediarecordingObjectForCurrStream.onstop = function () {
            // recording -> url convert
            // type-> MIME type
            const blob = new Blob(recording, { type: 'video/mp4' });
            const url = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.download = 'file.mp4';
            a.href = url;
            a.click();
            recording = [];
        }

    }).catch(function (err) {
        alert("Please allow both microphone and camera")
    });

recordBtn.addEventListener("click", function () {
    if (mediarecordingObjectForCurrStream == undefined) {
        alert("First select the devices");
        return;
    }
    if (isRecording == false) {
        mediarecordingObjectForCurrStream.start();
        recordBtn.innerText = "Recording......";
        startTimer();
    } else {
        stopTimer();
        mediarecordingObjectForCurrStream.stop();
        recordBtn.innerText = "Record";
    }
    isRecording = !isRecording;
})

captureImgBtn.addEventListener("click", function() {
    // canvas create
    let canvas = document.createElement("canvas");
    canvas.height = videoElem.videoHeight;
    canvas.width = videoElem.videoWidth;
    let tool = canvas.getContext("2d");
    tool.drawImage(videoElem, 0 , 0);
    if(filterColor) {
        tool.fillStyle = filterColor;
        tool.fillRect(0, 0, canvas.width,canvas.height);
    }
    // let tool = canvas.getContext("2d");
    // tool.drawImage(videoElem, 0 , 0);
    let url = canvas.toDataURL();
    let a = document.createElement("a");
    a.download = "file.png";
    a.href = url;
    a.click();
    a.remove();
    // videoElement
})

// filter Array
for(let i = 0; i < filterArr.length; i++){
    filterArr[i].addEventListener("click", function() {
        filterColor = filterArr[i].style.backgroundColor;
        filterOverlay.style.backgroundColor = filterColor;
    })
}

function startTimer() {
    timings.style.display = "block";
    function fn() {
        let hours = Number.parseInt(counter/3600);
        let RemSeconds = counter % 3600;
        let mins = Number.parseInt(RemSeconds / 60);
        let seconds = RemSeconds % 60;
        hours = hours < 10 ? `0${hours}` : hours;
        mins = mins < 10 ? `0${mins}` : `${mins}`;
        seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        timings.innerText = `${hours}:${mins}:${seconds}`;
        counter++;
    }
    clearObj = setInterval(fn, 1000);
}

function stopTimer() {
    timings.style.display = "none";
    clearInterval(clearObj);
}