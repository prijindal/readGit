
angular.module('readGit', [
        'ionic',
        'ngStorage',
        'yaru22.angular-timeago'
    ])
        .config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
            $stateProvider
            .state('login', {
                url:'/login',
                templateUrl:'templates/login.html',
                controller:'loginController',
                controllerAs:'login'
            })
            .state('home', {
                url:'/home',
                templateUrl:'templates/home.html',
                controller:'homeController',
                controllerAs:'home'
            })

            $urlRouterProvider.otherwise('/login')
        }])
        .run(['$rootScope', '$location', 'credentials', function ($rootScope, $location, credentials) {
            $rootScope.$on('$routeChangeStart', function (event) {
                if (!credentials.isLoggedIn()) {
                    console.log('DENY');
                    //event.preventDefault();
                    $location.path('/login');
                }
                else {
                    if($location.path() == '/login') {
                        $location.replace();
                      $location.path('/home');
                    }
                }
            });
        }]);





