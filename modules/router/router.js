'use strict';


var card = require("pages/card/card");
var content = require("pages/content/content");
var eventlog = require("pages/eventlog/eventlog");
var camera = require("pages/camera/camera");
var warn = require("pages/warn/warn");
var warnDetail = require("pages/warn/warnDetail");
var reader = require("pages/reader/reader");
var user = require("pages/user/user");
var account = require("pages/account/account");
// var location = require("pages/location/location");
// var imgs = require("pages/imgs/imgs");

/**
 * Route configuration for the RDash module.
 */
var app = angular.module('RDash');
app.config(function ($stateProvider, $urlRouterProvider,$controllerProvider) {
    $urlRouterProvider.otherwise('/card');
    $stateProvider
        .state('card', card)
        .state('content', content)
        .state('warn', warn)
        .state('warnDetail', warnDetail)
        .state('camera', camera)

        // .state('eventlog', eventlog)
        .state('reader', reader)
<<<<<<< HEAD
        .state('user', user)
        .state('account', account);
=======
        .state('eventlog', eventlog);
        // .state('reader', reader)


>>>>>>> fc5ab57e4a52ab009a74180385159b584a5d8a1d
        // .state('location', location)

        // .state('imgs', imgs)
    app.register = {
        controller: $controllerProvider.register
    };
});