console.log("connected");
var app = angular.module('myApp', ["ngRoute"]);


if(window.location.origin == "http://localhost:8000") {
  DB_URL = "http://localhost:3000";
}
else {
  DB_URL = "https://online-exam-app.herokuapp.com";
}


app.controller('mainController',['$http','$location', function($http, $location){
this.user = {};
this.selected_partial = 'index';
this.divToken = false;
this.hideDiv = false;
this.hideDiv = false;
var controller = this;
//=============================================================
//Login Function
this.login = function(userPass){
  $http({
    method: 'POST',
    url: DB_URL + '/users/login',
    data: {
      user:
      {
        username: userPass.username,
        password: userPass.password
      }
    }
  }).then(function(response){
    console.log(response);
          if (response.data.status == 401) {
          this.error = "Incorrect Username or Password, Try Again";
          userPass.username = "";
          userPass.password =  "";
        } else {
          this.user = response.data.user;
          localStorage.setItem('token', JSON.stringify(response.data.token));
          this.divToken = true;
            $location.path('/');
        }
}.bind(this));
    };
//=======================================================================
  this.getUsers = function() {
  $http({
    url: DB_URL + '/users',
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
    }
  }).then(function(response) {
    console.log(response);
    if (response.data.status == 401) {
        this.error = "Unauthorized";
    } else {

      this.users = response.data;
    }
  }.bind(this));
};
//=========================================================================
//logout
this.logout = function(){
  localStorage.clear('token');
  location.reload();
};

//======================================================================
//Create test
this.createTest = function(){
  $http({
    method: 'POST',
    url: DB_URL + '/tests',
    data: this.createFormData,
    headers: {
      'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
    }
  }).then(function(response){
    console.log(response);
    controller.tests = response.data;
    controller.createformdata = {};
    controller.getTest();

  });
};

//=======================================================================
this.getTest = function(){
  $http({
          method: 'GET',
          url: DB_URL + '/tests'
      }).then(function(response){
          console.log(response);
          controller.tests = response.data;
          console.log("===============");
          console.log(controller.tests);
      });
  };
this.getTest();
//=======================================================================

//get specific test
this.getSpecificTest = function(id){
  $http({
          method: 'GET',
          url: DB_URL + '/tests/' + id
      }).then(function(response){
          console.log(response);
          controller.specificTest = response.data;
          console.log("===============");
          console.log(controller.specificTest);

      });
  };

//======================================================================


//Edit test
this.updateTest = function(){
var id  = controller.specificTest.id;
console.log(id);
  $http({
          method: 'PUT',
          url: DB_URL + '/tests/' + id,
          data: this.editformdata
      }).then(function(result){
          console.log(result);
          controller.editformdata = {};
          controller.getTest();
      });
};
//======================================================================
//delete test
this.deleteTest = function(id) {
  console.log(id);
$http({
        method: 'DELETE',
        url: DB_URL + '/tests/' + id,
        data: this.deletedata
      }).then(function(result){
      console.log(result);
        controller.getTest();
          $location.path('/manage/test');
      });
  };


//======================================================================
this.editTest = function(id) {
  console.log(id);
  this.editableTest = id;
  controller.hideDiv = true;
};
//======================================================================
this.routeToManageTest = function(){
    $location.path('/manage/test');
};

}]);

//=====================================================================
//Router Page
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) { //.config just runs once on load
    $routeProvider.when("/", {
        templateUrl : "/partials/index-partials.html"
    }).when("/manage/test",{
      templateUrl : "/partials/manage-test.html"
    });
    $locationProvider.html5Mode({ enabled: true, requireBase: false }); // tell angular to use push state
}]);
