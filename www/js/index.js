var wsServer = "ws://172.31.253.10:8080/";

var ws = WS(wsServer),
    touching = null;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

$(document).ready(function(){
    ws.opened.then(function(){
        ws.send("setClientDeviceType",{
            deviceType: "guest"
        });
    });

    $("button.play").on("touchstart mousedown", function(){
        console.log("no touch start?");
        touching = navigator.accelerometer.watchAcceleration(
            function(accel){
                sendOrientation(accel);
            }, 
            function(){
                console.log("PANIC");
            }, {
                frequency:250
            });
    });

    $(document).on('touchstart', function(e){
        console.log(e);
    });
});

function sendOrientation(accel){
    ws.send("setOrientation",{
        gamma: accel.x,
        beta: accel.y,
        alpha: accel.z
    });
};