let socket;
let roomId;
let creator = false;

$(document).ready(function () {
    socket = io("https://yourDomain.com:3100/");

    socket.on("success", (message) => {
        console.log(message);
        $("#searchBar").attr("type", "show");
    });
    socket.on("addSongToQueue", (uri) => {
        console.log(uri);
        if (creator) {
            addSong(uri);
        }
    });

});

function createRoom() {
    console.log('create room');
    roomId = generateRandomInteger();
    console.log(roomId);
    socket.emit("createRoom", roomId);
    $('#createRoomID').val(roomId);
    creator = true;

}

function joinRoom() {
    console.log('join room');
    roomId = $('#id').val();
    socket.emit("joinRoom", roomId);
    $('#createRoomID').val(roomId);
    creator = false;

}

function addToQueue(uri) {
    console.log('moi qui envoie: ' + uri);
    socket.emit("addSongToQueue", roomId + '///' + uri);
}

// Generate a number
function generateRandomInteger() {
    min = Math.ceil(100000);
    max = Math.floor(999999);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}