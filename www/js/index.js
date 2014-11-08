var wsServer = "ws://192.168.1.184:8080/";

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
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

var ws = WS(wsServer),
    touching = null;

$(document).ready(function(){
    ws.opened.then(function(){
        ws.send("setClientDeviceType",{
            deviceType: "guest"
        });
    });

    $("body").on("touchstart mousedown", function(){
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

    $("body").on("touchend mouseup", function(){
        navigator.accelerometer.clearWatch(touching);
    });
});

function sendOrientation(accel){
    ws.send("setOrientation",{
        gamma: accel.x,
        beta: accel.y,
        alpha: accel.z
    });
};