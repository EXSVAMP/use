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
var pollinventory = require("pages/pollinventory/pollinventory");
var manualinventory = require("pages/manualinventory/manualinventory");
var location = require("pages/location/location");
var storeSet=require("pages/storeSet/storeSet");
var statistics=require("pages/statistics/statistics");
var functionSet=require("pages/functionSet/functionSet");
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
        .state('user', user)
        .state('account', account)
        .state('eventlog', eventlog)
        .state('pollinventory', pollinventory)
        .state('manualinventory', manualinventory)
        .state('location', location)
        .state('storeSet',storeSet)
        .state('statistics',statistics)
        .state("functionSet",functionSet);
        // .state('reader', reader)


        // .state('imgs', imgs)
    app.register = {
        controller: $controllerProvider.register
    };
});