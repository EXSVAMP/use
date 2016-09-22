var app = angular.module('RDash');
app.register.controller("contentCtrl", function ($scope, $http, $location, $uibModal, $cookieStore, baseUrl, $rootScope) {
  console.log("5678");
  $scope.queryParam={
    rfid_type_Id: undefined

  };
  var urlBase=baseUrl.getUrl();
  $scope.choice={};

  // $scope.state.name = {name:"weishiyong",flag:1};

$scope.rfid_type="-1";


  $http.get(urlBase + "/api/1/common/choices/?key=rfidcontent").success(function(data){
    $scope.rfid_type_Items=[];
    if(data.code==200){
      $scope.choice = data;
      // console.log($scope.choice.data.rfid_type);
      var dataTemp= $scope.choice.data.rfid_type;
      for(dataItem in dataTemp){
        $scope.rfid_type_Items.push({id:dataItem,name:dataTemp[dataItem]});
      }

      // console.log($scope.rfid_type_Items);
  $scope.pp="";
     


    }else{
      alert(data.message)
    }
  }).error(function(data,state){
       console.log("有点错误");
  });



  $scope.search=function () {
    console.log($scope.rfid_type_Items);
    alert($scope.queryParam.rfid_type_Id);
  }

$scope.change=function(sta){
  alert(sta);
}

  // $scope.test = [
  //   {
  //     id:2,
  //     name: 'a2'
  //   },
  //   {
  //     id:4,
  //     name: 'a4'
  //   },
  // ]








})