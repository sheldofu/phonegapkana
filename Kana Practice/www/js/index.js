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


var kanaMod = angular.module('kanaMod', ['ngRoute']);

kanaMod.controller('MainController', function($scope, $route){
    $scope.test = "An initial test";
});


//to get kana list
kanaMod.controller('kanaList', function($scope, $http){
    $http.get('res/kanalist.json').success(function (data){
        $scope.kana = data;
    });
});

kanaMod.controller('KanaQuestion', function($scope){
    

/*
* 0: a-o, hiragana
* 1: ka-ko, hiragana
* etc
*/

//kana should be a service
//https://www.airpair.com/javascript/posts/services-in-angularjs-simplified-with-examples
//https://docs.angularjs.org/tutorial/step_11
    $scope.kana = [
        {
            character:"あ",
            set:0,
            romaji:"a"
        },
        {
            character:"い",
            set:0,
            romaji:"i"
        },
        {
            character:"う",
            set:0,
            romaji:"u"
        },
        {
            character:"え",
            set:0,
            romaji:"e"
        },
        {
            character:"お",
            set:0,
            romaji:"o"
        },


        {
            character:"か",
            set:1,
            romaji:"ka"
        },        
        {
            character:"き",
            set:1,
            romaji:"ki"
        },
        {
            character:"く",
            set:1,
            romaji:"ku"
        },
        {
            character:"け",
            set:1,
            romaji:"ke"
        },
        {
            character:"こ",
            set:1,
            romaji:"ko"
        },


        {
            character:"さ",
            set:2,
            romaji:"sa"
        },
        {
            character:"し",
            set:2,
            romaji:"shi"
        },
        {
            character:"す",
            set:2,
            romaji:"su"
        },
        {
            character:"せ",
            set:2,
            romaji:"se"
        },
        {
            character:"そ",
            set:2,
            romaji:"so"
        },


        {
            character:"た",
            set:3,
            romaji:"ta"
        },
        {
            character:"ち",
            set:3,
            romaji:"chi"
        },
        {
            character:"つ",
            set:3,
            romaji:"tsu"
        },
        {
            character:"て",
            set:3,
            romaji:"te"
        },
        {
            character:"と",
            set:3,
            romaji:"to"
        },
 

        {
            character:"な",
            set:4,
            romaji:"na"
        },
        {
            character:"に",
            set:4,
            romaji:"ni"
        },
        {
            character:"ぬ",
            set:4,
            romaji:"nu"
        },
        {
            character:"ね",
            set:4,
            romaji:"ne"
        },
        {
            character:"の",
            set:4,
            romaji:"no"
        },


        {
            character:"は",
            set:5,
            romaji:"ha"
        },
        {
            character:"ひ",
            set:5,
            romaji:"hi"
        },
        {
            character:"ふ",
            set:5,
            romaji:"fu"
        },
        {
            character:"へ",
            set:5,
            romaji:"he"
        },
        {
            character:"ほ",
            set:5,
            romaji:"ho"
        },



        {
            character:"ま",
            set:6,
            romaji:"ma"
        },
        {
            character:"み",
            set:6,
            romaji:"mi"
        },
        {
            character:"む",
            set:6,
            romaji:"mu"
        },
        {
            character:"め",
            set:6,
            romaji:"me"
        },
        {
            character:"も",
            set:6,
            romaji:"mo"
        },


        {
            character:"ら",
            set:7,
            romaji:"ra"
        },
        {
            character:"り",
            set:7,
            romaji:"ri"
        },
        {
            character:"る",
            set:7,
            romaji:"ru"
        },
        {
            character:"れ",
            set:7,
            romaji:"re"
        },
        {
            character:"ろ",
            set:7,
            romaji:"ro"
        },


        {
            character:"わ",
            set:8,
            romaji:"wa"
        },
        {
            character:"を",
            set:8,
            romaji:"wo"
        },


        {
            character:"や",
            set:9,
            romaji:"ya"
        },
        {
            character:"ゆ",
            set:9,
            romaji:"yu"
        },
        {
            character:"よ",
            set:9,
            romaji:"yo"
        },

        {
            character:"ん",
            set:10,
            romaji:"n"
        },
    ]

    $scope.options = [];

    $scope.newKana = function() {

        $scope.options[0] = $scope.kana[Math.floor((Math.random()*$scope.kana.length))].romaji;
        $scope.options[1] = $scope.kana[Math.floor((Math.random()*$scope.kana.length))].romaji;
        $scope.options[2] = $scope.kana[Math.floor((Math.random()*$scope.kana.length))].romaji;

        $scope.correctOption = Math.floor((Math.random()*3));
        $scope.correctKana = $scope.kana[Math.floor((Math.random()*$scope.kana.length))]

        $scope.options[$scope.correctOption] = $scope.correctKana.romaji;
        $scope.currentKana = $scope.correctKana.character;
        //$scope.sound = "/res/audio/" + $scope.correctKana.romaji + ".mp3";
        $scope.sound = "res/audio/tsu.mp3";

    }

    $scope.response = function(opt) {
        console.log('clicked' + opt);
        if (opt == $scope.correctOption) {
            console.log('correct');
            $scope.newKana();
        }    
    }

    $scope.newKana();

});

// kanaMod.config(['$routeProvider',
//     function($routeProvider) {
//         $routeProvider.when('/')
//     }])

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
