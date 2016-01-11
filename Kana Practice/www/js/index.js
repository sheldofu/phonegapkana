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
    //refactor to only call file once then store data
    var KanaList = {};
    
    var hiraganaSet = $http.get('res/kanalist.json')
                    .then(function(response) {
                      if (typeof response.data === 'object') {
                            return response.data;
                        }            
                    });

    var katakanaSet = $http.get('res/katakana.json')
                    .then(function(response) {
                      if (typeof response.data === 'object') {
                            return response.data;
                        }            
                    });

    KanaList.getKana = function(set) {
        if (set == 1) {
            kanaset = hiraganaSet;
        } else {
            kanaset = katakanaSet;
        }
        return kanaset;
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
    $scope.options = [];
    $scope.kana;
    $scope.correctKana;
    $scope.correct = false;
    $scope.kanaSet;
    $scope.sound = "res/audio/tsu.mp3";
    $scope.kanaRemoved = 0;
    $scope.kanaTotal = 0;

    $scope.isCorrect = function(selectedOption) {
        $scope.correct = ScoreKeeper.isCorrect(selectedOption, $scope.correctKana);
        if ($scope.correct == true) {
            $scope.$broadcast('questionCorrect',{
                correctId: $scope.correctKana.id
            });
            $scope.score = $scope.score +1;
            $scope.correct = false;
            $scope.kanaOptions();
            $scope.setCorrectKana();
        }
    }

    $scope.setKanaSet = function(set){
        $scope.$broadcast('gameStarted',{
                game: 'start'
            });
        $scope.kanaSet = set;
        KanaList.getKana($scope.kanaSet)
        .then(function (data){
            $scope.kana = data;
            for (var x = 0; x < $scope.kana.length; x++) {
                $scope.kana[x].used = false;
            }
            $scope.kanaTotal = data.length;
            $scope.kanaOptions();
            $scope.setCorrectKana();
        });
    }

    $scope.kanaOptions = function() {
        $scope.options = ScoreKeeper.newKana($scope.kana);
    }

    $scope.setCorrectKana = function() {
        //$scope.kanaRemoved = $scope.kanaRemoved+1;
        $scope.correctKana = ScoreKeeper.correctKana($scope.options);
        AudioService.play($scope.sound);
        console.log($scope.kana);
        console.log($scope.correctKana.id);
        console.log($scope.kanaRemoved);
        for (var x; x < $scope.kana.length; x++) {
            if ($scope.kana.id == $scope.correctKana.id) {
                $scope.kana[x].used = true;
            }
        }
        //$scope.kana.splice($scope.correctKana.id-$scope.kanaRemoved,1)
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
        var remainingKana = [];
        for (var x = 0; x < kana.length; x++) {
            if (kana[x].used == false) {
                remainingKana.push(kana[x]);
            }
        }

        var options = [];

        options[0] = remainingKana[Math.floor((Math.random()*remainingKana.length))];
        options[1] = remainingKana[Math.floor((Math.random()*remainingKana.length))];
        options[2] = remainingKana[Math.floor((Math.random()*remainingKana.length))];

        return options;
    }

    this.correctKana = function(options) {
        var correctOption = Math.floor((Math.random()*3));
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
        template: '<button class="btn-primary" ng-click="checkAnswer()">{{option.character}}</button>'
    }
});

kanaMod.controller('ScoreGrid', function(ScoreKeeper,KanaList,$scope,$interval,$timeout){

    $scope.kanascore;

    KanaList.getKana(1).then(function (data){
            for (var count=0;count<data.length;count++) {
                data[count].vis = false; 
            }
            $scope.kanascore = data;
        });

    $scope.$on('questionCorrect', function (event, data){
        for (x=0; x < $scope.kanascore.length; x++){
            if ($scope.kanascore[x].id == data.correctId){
                $scope.kanascore[x].vis = true; 
            }
        }
    });

    $scope.$on('gameStarted', function (event, data){
        $interval.cancel($scope.showKana);
        $interval.cancel($scope.hideKana);
        for (var x=0; x < $scope.kanascore.length; x++) {
            $scope.kanascore[x].vis = false;
        }
    });

    var timeCount = 0;
    var cancelTimeCount = 0;
    
    $scope.showKana = $interval(function(){  
         $scope.kanascore[timeCount].vis = true;
         timeCount++;
         //console.log(timeCount);
         if (timeCount==46) {
            // $interval.cancel(showKana);
            timeCount = 0;
         }
    },200)

    $timeout(function() {
        $scope.hideKana = $interval(function(){
            $scope.kanascore[cancelTimeCount].vis = false;
            cancelTimeCount++;
            //console.log(cancelTimeCount);
            if (cancelTimeCount==46) {
                // $interval.cancel(hideKana);
                cancelTimeCount = 0;
            }
        }, 200)
    }, 1200);
}); 

kanaMod.controller('ScoreGrid2', function(ScoreKeeper,KanaList,$scope,$interval,$timeout){

    $scope.kanascore2;

    KanaList.getKana(0).then(function (data){
            for (var count=0;count<data.length;count++) {
                data[count].vis = false; 
            }
            $scope.kanascore2 = data;
        });

    $scope.$on('questionCorrect', function (event, data){
        for (x=0; x < $scope.kanascore2.length; x++){
            if ($scope.kanascore2[x].id == data.correctId){
                $scope.kanascore2[x].vis = true; 
            }
        }
    });

    $scope.$on('gameStarted', function (event, data){
        $interval.cancel($scope.showKana);
        $interval.cancel($scope.hideKana);
        for (var x=0; x < $scope.kanascore2.length; x++) {
            $scope.kanascore2[x].vis = false;
        }
    });

    var timeCount = 0;
    var cancelTimeCount = 0;
    
    $scope.showKana = $interval(function(){  
         $scope.kanascore2[timeCount].vis = true;
         timeCount++;
         //console.log(timeCount);
         if (timeCount==46) {
            // $interval.cancel(showKana);
            timeCount = 0;
         }
    },200)

    $timeout(function() {
        $scope.hideKana= $interval(function(){
            $scope.kanascore2[cancelTimeCount].vis = false;
            cancelTimeCount++;
            //console.log(cancelTimeCount);
            if (cancelTimeCount==46) {
                // $interval.cancel(hideKana);
                cancelTimeCount = 0;
            }
        }, 200)
    }, 1200);
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
