console.log("connected");
var app = angular.module('myApp', ["ngRoute"]);


if(window.location.origin == "http://localhost:8000") {
  DB_URL = "http://localhost:3000";
}
else {
  DB_URL = "https://online-exam-app.herokuapp.com";
}

app.controller('mainController',['$http','$location','$scope', function($http, $location, $scope){
this.user = {};
this.selected_partial = 'index';
this.divToken = false;
this.hideDiv = false;

var controller = this;
//=============================================================
//Create Account
this.createAccount = function() {

    $http({
       method: 'POST',
       url: DB_URL + '/users',
       data: {
         user: {
          username: this.username,
          password: this.password
          }
       },
     }).then(function(response) {//sucess
       console.log(response);
       this.user = response.data.user;
     }.bind(this));
  };
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
  this.divToken = true;
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
          controller.showTheForm = true;
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
this.editQuestion = function(id) {
  console.log(id);
  this.editableQuestion = id;
  controller.hideDiv = true;
};
//===================================================================
this.getQuestions = function(id){
console.log(id);
  $http({
          method: 'GET',
          url: DB_URL + '/tests/' + id + '/questions'
      }).then(function(response){
          console.log(response);
          controller.questions = response.data;

      });
};
this.getQuestions();
//==================================================================
this.getSpecificQuestion = function(id){

  $http({
          method: 'GET',
          url: DB_URL + '/tests/' + id + '/questions/' + id
      }).then(function(response){
          console.log(response);
          controller.specificQuestion = response.data;
          console.log("===============");
          console.log(controller.specificQuestion);


      });
  };

//==================================================================
this.createQuestion = function(id){
testId = this.test_id.id;
  $http({
    method:'POST',
    url: DB_URL + '/tests/' + testId + '/questions',
    data: {
      question:
      {
        user_id : this.user.id,
        test_id : this.test_id.id,
        name: this.name,
        option1: this.option1,
        option2: this.option2,
        option3: this.option3,
        option4: this.option4,
        correctanswer: this.correctanswer,
        score: this.score
    },
  },
  }).then(function(response){
    controller.questions = response.data;
      console.log(controller.questions);
      console.log("======================");
  });
};

//===================================================================
//edit question
this.updateQuestion = function(id){
 id = this.specificQuestion.id;
  $http({
          method: 'PUT',
          url: DB_URL + '/tests/' + id + '/questions/' + id,
          data: this.editformdata
      }).then(function(result){
          console.log(result);
           controller.getQuestions();
      });
};
//=====================================================================
//Delete question
this.deleteQuestion = function(id){
  console.log("here");
  console.log(id);
  $http({
          method: 'DELETE',
          url: DB_URL + '/tests/' + id + '/questions/' + id,
        }).then(function(result){
        console.log(result);
          controller.getQuestions();
            $location.path('/manage/question');
        });
};
//======================================================================
$scope.choices = [];
$scope.addNewQuestion = function(numberOfQuestions){
  console.log(numberOfQuestions);
  var newItem = $scope.choices;
   $scope.choices.push({newItem});
};
$scope.removeChoice = function() {
    var lastItem = $scope.choices.length-1;
    $scope.choices.splice(lastItem);
  };



//======================================================================
this.routeToManageTest = function(){
    $location.path('/manage/test');
};

this.routeToManageQuestion = function(){
      $location.path('/manage/question');
};

this.routeToSignUp = function(){
    this.divToken = true;
    $location.path('/register');
};

}]);

//=====================================================================
//Router Page
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) { //.config just runs once on load
    $routeProvider.when("/", {
        templateUrl : "/partials/index-partials.html"
    }).when("/manage/test",{
      templateUrl : "/partials/manage-test.html"
    }).when("/register",{
        templateUrl : "/partials/register.html"
    }).when("/manage/question",{
      templateUrl : "/partials/manage-question.html"
    });
    $locationProvider.html5Mode({ enabled: true, requireBase: false });
}]);
