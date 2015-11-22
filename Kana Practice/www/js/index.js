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

kanaMod.factory('KanaList', ['$http', function ($http) {

    var KanaList = {};
    KanaList.getKana = function(set) {
        if (set == 1) {
        return $http.get('res/kanalist.json')
                    .then(function(response) {
                      if (typeof response.data === 'object') {
                            return response.data;
                        }            
                    });
        } else {
        return $http.get('res/katakana.json')
                    .then(function(response) {
                      if (typeof response.data === 'object') {
                            return response.data;
                        }            
                    });            
        }
    }

    // Kanalist.incrementScore = function() 

     return KanaList;

}]);

kanaMod.factory('AudioService', [function() {
  var audioElement = document.createElement('audio'); // <-- Magic trick here
  return {
    audioElement: audioElement,

    play: function(filename) {
        audioElement.src = filename;
        audioElement.play();     //  <-- Thats all you need
    }
    // Exersise for the reader - extend this service to include other functions
    // like pausing, etc, etc.

  }
}]);

kanaMod.controller('ToBeMainController', function(ScoreKeeper, AudioService, KanaList, $scope){
    $scope.score = 0;
    $scope.rightAnswer = "0";
    $scope.options = [];
    $scope.kana;
    $scope.correctKana;
    $scope.correct = false;
    $scope.kanaSet;
    $scope.sound = "res/audio/tsu.mp3";

    $scope.isCorrect = function(selectedOption) {
        $scope.correct = ScoreKeeper.isCorrect(selectedOption, $scope.correctKana);
        if ($scope.correct == true) {
            $scope.score = $scope.score +1;
            $scope.correct = false;
            $scope.kanaOptions();
            $scope.setCorrectKana();
        }
    }

    // $scope.$watch('correct', function(){
    //     console.log($scope.correct);
    // })

    $scope.setKanaSet = function(set){
        $scope.kanaSet = set;
        KanaList.getKana($scope.kanaSet)
        .then(function (data){
            $scope.kana = data;
            $scope.kanaOptions();
            $scope.setCorrectKana();
        });
    }

    $scope.kanaOptions = function() {
        $scope.options = ScoreKeeper.newKana($scope.kana);
    }

    $scope.setCorrectKana = function() {
        $scope.correctKana = ScoreKeeper.correctKana($scope.options);
        AudioService.play($scope.sound);
    }

});

kanaMod.service('ScoreKeeper', [function() {

    this.isCorrect = function(chosen, correct){
        if (chosen == correct) {
            return true;
        } else {
            return false;
        }
    }

    this.newKana = function(kana) {
        var options = [];

        options[0] = kana[Math.floor((Math.random()*kana.length))];
        options[1] = kana[Math.floor((Math.random()*kana.length))];
        options[2] = kana[Math.floor((Math.random()*kana.length))];

        return options;
    }

    this.correctKana = function(options) {
        var correctOption = Math.floor((Math.random()*3));
        //options[Math.floor((Math.random()*options.length))]
// var correctKana =
        return options[correctOption];
    }

}])

kanaMod.directive('answerButton',function() {
    return {
        restrict:'E',
        scope: {
            option: '=options',
            checkAnswer: '&'
        },
        replace: true,
        template: '<button class="btn-primary" ng-click="checkAnswer()">{{option.romaji}}</button>'
    }
});

//http://stackoverflow.com/questions/11850025/recommended-way-of-getting-data-from-the-server

// kanaMod.controller('kanaTEST', function($scope, $http, KanaList){

//     $scope.kana = "test";


//     // KanaList.getKana()
//     // .then(function (data){
//     //     $scope.kana = data;
//     //     // return data;
//     // })

// });

/*
* 0: a-o, hiragana
* 1: ka-ko, hiragana
* etc
*/

//kana should be a service
//https://www.airpair.com/javascript/posts/services-in-angularjs-simplified-with-examples
//https://docs.angularjs.org/tutorial/step_11

    // $scope.kana;
    // $scope.totalCorrect = 0;

    // KanaList.getKana()
    // .success(function (data){
    //     $scope.kana = data;
    //     console.log($scope.kana);
    // })
    // .error(function (error) {
    //     console.log(error.message);
    // });

    // KanaList.getKana()
    // .then(function (data){
    //     $scope.kana = data;
    //     $scope.newKana();
    // });

    // console.log($scope.kana);

    // $scope.newKana = function() {

    //     $scope.options = [];

    //     $scope.options[0] = $scope.kana[Math.floor((Math.random()*$scope.kana.length))].romaji;
    //     $scope.options[1] = $scope.kana[Math.floor((Math.random()*$scope.kana.length))].romaji;
    //     $scope.options[2] = $scope.kana[Math.floor((Math.random()*$scope.kana.length))].romaji;

    //     $scope.correctOption = Math.floor((Math.random()*3));
    //     $scope.correctKana = $scope.kana[Math.floor((Math.random()*$scope.kana.length))]

    //     $scope.options[$scope.correctOption] = $scope.correctKana.romaji;
    //     $scope.currentKana = $scope.correctKana.character;
    //     //$scope.sound = "/res/audio/" + $scope.correctKana.romaji + ".mp3";
    //     $scope.sound = "res/audio/tsu.mp3";

    // }

    // $scope.response = function(opt) {
    //     console.log('clicked' + opt);
    //     if (opt == $scope.correctOption) {
    //         console.log('correct');
    //         $scope.totalCorrect++
    //         $scope.newKana();
    //     } else {
    //         $scope.incorrect();
    //     }    
    // }

    // $scope.incorrect = function() {
    //     console.log('incorrect');
    // }

    

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
