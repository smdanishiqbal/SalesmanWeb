/**
 * Created by SMD on 1/29/2016.
 */
angular.module('myApp', ['ngMaterial','firebase','ui.router'])

    .constant("myfirebaseAddress","https://salesmenapp15.firebaseio.com/")


  /////  Routes
    .config(function ($stateProvider,$urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');
        $stateProvider


            .state('SignUp',{
                url:"/SignUp",
                templateUrl:'Components/SignUp.html',
                controller:'SignUpCtrl'
            })
            .state('login',{
                url:"/login",
                templateUrl:'Components/login.html',
                controller:'login'

            })
            .state('details',{
                url:"/details",
                templateUrl:'Components/Details.html',
                controller:'detailsCtrl'

            })
            .state('Account',{
                url:"/Account",
                templateUrl:'Components/Account.html',
                controller:'AccountCtrl'

            });

    })



















    .controller('login', function($scope,myfirebaseAddress,$location) {

        var ref = new Firebase(myfirebaseAddress);

        $scope.user = {
            password : "",
            email : ""
        };
        var vm = this;
        $scope.login=function() {
            console.log($scope.user);
            ref.authWithPassword($scope.user, function (error, authData) {
                if (error) {
                    console.log("Login Failed!", error);
                } else {
                    console.log("Authenticated successfully with payload:", authData);
                    $scope.$apply(function() { $location.path("/Account"); });
                }
            });
        }



    })

    .controller('SignUpCtrl', function($scope,myfirebaseAddress,$location) {
        var ref = new Firebase(myfirebaseAddress);
        var vm = this;
        //Button for SignUP User
        $scope.submit=function()
        {


            ref.createUser({
                "email": $scope.email,
                password: $scope.password
            }, function(error, userData) {
                if (error) {
                    switch (error.code) {
                        case "EMAIL_TAKEN":
                            console.log("The new user account cannot be created because the email is already in use.");
                            break;
                        case "INVALID_EMAIL":
                            console.log("The specified email is not a valid email.");
                            break;
                        default:
                            console.log("Error creating user:", error);
                    }
                } else {
                    console.log("Successfully created user account with uid:", userData.uid);
                    $scope.$apply(function() { $location.path("/login"); });

                }
            });

        };





    })

    .controller('ChatDetailCtrl', function($scope,myfirebaseAddress,$location,$timeout) {
        var ref = new Firebase(myfirebaseAddress);
        $scope.messagesArray=[];

        ref.on("child_added", function(dataSnapshot){
            console.log(dataSnapshot.val());
            $timeout(function(){
                $scope.messagesArray.push(dataSnapshot.val());

            },0);
        });
    })

    .controller('detailsCtrl', function($scope,myfirebaseAddress,$location,$timeout) {
        var ref = new Firebase(myfirebaseAddress);

    })
    .controller('AccountCtrl', function($scope,myfirebaseAddress,$location, $http) {
        var ref = new Firebase(myfirebaseAddress);
        var vm = this;
        $scope.userData = {};

        $scope.saveData = function(){
            //action="/account" method="post"


            $http.post("/account",  $scope.userData)
                .success(function(config){
                    console.log(config);
                    console.log("Saved successfully");
                    //ref.push({Email:$scope.userData.email,Password:$scope.userData.pass,salesMen:$scope.userData.userName,Company:$scope.userData.Company,phone:$scope.userData.Phone});
                    ref.createUser({
                        "email": $scope.userData.email,
                        password: $scope.userData.password
                    }, function(error, userData) {
                        if (error) {
                            switch (error.code) {
                                case "EMAIL_TAKEN":
                                    console.log("The new user account cannot be created because the email is already in use.");
                                    break;
                                case "INVALID_EMAIL":
                                    console.log("The specified email is not a valid email.");
                                    break;
                                default:
                                    console.log("Error creating user:", error);
                            }
                        } else {
                            console.log("Successfully created user account with uid:", userData.uid);
                            $scope.$apply(function() { $location.path("/details"); });

                        }
                    });
                })
                .error(function(){
                    console.log("Error in saving");
                });
        };



    });
