/**
 * Created by tangjianfeng on 16/6/13.
 */
'use strict';

var login = require("login_page/login/login");
var register = require("login_page/register/register");

angular.module('Login').config(function ($stateProvider, $urlRouterProvider) {

    // For unmatched routes
    $urlRouterProvider.otherwise('/login');

    // Application routes
    $stateProvider
        .state('login', login)
        .state("register", register)
});