'use strict';


var login = require("login_page/login/login")
var app = angular.module('Login');
app.config(function ($stateProvider, $urlRouterProvider, $controllerProvider) {

    $urlRouterProvider.otherwise('/login');

    $stateProvider.state("login", login);

    app.register = {
        controller: $controllerProvider.register
    };


})