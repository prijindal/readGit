
angular.module('readGit', ['ngRoute', 'ngAnimate'])
        .config(["$routeProvider", function($routeProvider) {
            $routeProvider
            .when('/login', {
                templateUrl:'templates/login.html',
                controller:'loginController',
                controllerAs:'login'
            })
            .when('/home', {
                templateUrl:'templates/home.html',
                controller:'homeController',
                controllerAs:'home'
            })

            $routeProvider.otherwise('/login')
        }])



angular.module('readGit').controller('loginController',['$location', function($location) {
    var self = this;
    self.submit = function() {
        console.log(self.user)
        $location.path('/home')
    }
    input_fix()
}])


angular.module('readGit').controller('homeController',['$location', function($location) {
    var self = this;
}])
