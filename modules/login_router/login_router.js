'use strict';


var login = require("login_page/login/login");
var register = require("login_page/register/register");

var app = angular.module('Login');
app.config(function ($stateProvider, $urlRouterProvider, $controllerProvider) {
    $urlRouterProvider.otherwise('/login');

    $stateProvider.state("login", login)
    				.state("register", register);

    app.register = {
        controller: $controllerProvider.register
    };


})