
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
                abstract: true,
                templateUrl:'templates/home.html'
            })
            .state('home.news', {
                url:'/news',
                views:{
                    'news-feed':{
                        templateUrl:'templates/news.html',
                        controller:'newsController as news'
                    }
                }
            })

            .state('home.profile', {
                url:'/profile',
                views:{
                    'user-profile':{
                        templateUrl:'templates/profile.html',
                        controller:'profileController as profile'
                    }
                }
            })

            .state('home.repos', {
                url:'/repos',
                views:{
                    'user-repos':{
                        templateUrl:'templates/repos.html',
                        controller:'reposController as repos'
                    }
                }
            })

            .state('home.followers', {
                url:'/followers',
                views:{
                    'user-followers':{
                        templateUrl:'templates/followers.html',
                        controller:'followersController as followers'
                    }
                }
            })

            .state('home.following', {
                url:'/following',
                views:{
                    'user-following':{
                        templateUrl:'templates/following.html',
                        controller:'followingController as following'
                    }
                }
            })

            .state('home.starred', {
                url:'/starred',
                views:{
                    'user-starred':{
                        templateUrl:'templates/starred.html',
                        controller:'starredController as starred'
                    }
                }
            })


            $urlRouterProvider.otherwise('/home/news')
        }])
        .run(['$rootScope', '$location', 'credentials', function ($rootScope, $location, credentials) {
            $rootScope.$on('$routeChangeStart', function (event) {
                if (!credentials.isLoggedIn()) {
                    console.log('DENY');
                    event.preventDefault();
                    $location.path('/login');
                }
                else {
                    if($location.path() == '/login') {
                        $location.replace();
                      $location.path('/home/news');
                    }
                }
            });
        }]);





