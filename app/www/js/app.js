
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
            .state('app', {
                url:'/app',
                abstract:true,
                templateUrl:'templates/app.html',
                controller:'appController as app'

            })

            .state('app.search', {
                url:'/search',
                templateUrl:'templates/app/search.html'
            })

            .state('app.search.result', {
                url:'/:query',
                templateUrl:'templates/app/search/result.html',
                controller:'searchController as search'
            })

            .state('app.search.result.users', {
                url:'/users',
                templateUrl:'templates/app/search/result/users.html',
                controller:'searchController as search'
            })

            .state('app.search.result.repos', {
                url:'/repos',
                templateUrl:'templates/app/search/result/repos.html',
                controller:'searchController as search'
            })

            .state('app.home', {
                url:'/home',
                abstract: true,
                templateUrl:'templates/app/home.html'
            })
            .state('app.home.news', {
                url:'/news',
                templateUrl:'templates/app/home/news.html',
                controller:'newsController as news'

            })

            .state('app.home.profile', {
                url:'/profile',
                templateUrl:'templates/app/home/profile.html',
                controller:'profileController as profile'
            })

            .state('app.home.repos', {
                url:'/repos',
                templateUrl:'templates/app/home/repos.html',
                controller:'reposController as repos'
            })

            .state('app.home.followers', {
                url:'/followers',
                templateUrl:'templates/app/home/followers.html',
                controller:'followersController as followers'
            })

            .state('app.home.following', {
                url:'/following',
                templateUrl:'templates/app/home/following.html',
                controller:'followingController as following'
            })

            .state('app.home.starred', {
                url:'/starred',
                templateUrl:'templates/app/home/starred.html',
                controller:'starredController as starred'
            })

            .state('app.user', {
                url:'/user',
                abstract:true,
                templateUrl:'templates/app/user.html'
            })

            .state('app.user.profile', {
                url:'/:username',
                templateUrl:'templates/app/user/profile.html',
                controller:'userProfileCtrl as profile'
            })

            .state('app.user.profile.followers', {
                url:'/followers',
                templateUrl:'templates/app/user/followers.html'
            })

            .state('app.user.profile.starred', {
                url:'/starred',
                templateUrl:'templates/app/user/starred.html'
            })

            .state('app.user.profile.following', {
                url:'/following',
                templateUrl:'templates/app/user/following.html'
            })

            .state('app.user.profile.repos', {
                url:'/repos',
                templateUrl:'templates/app/user/repos.html'
            })

            .state('app.repo', {
                url:'/repo',
                abstract:true,
                templateUrl:'templates/app/repo.html'
            })

            .state('app.repo.user', {
                url:'/:username',
                templateUrl:'templates/app/repo/user.html',
                controller:'userRepoController as repo'
            })

            .state('app.repo.user.repo', {
                url:'/:reponame',
                templateUrl:'templates/app/repo/repo.html',
                controller:'repoInfoController as repo'
            })

            .state('app.repo.user.repo.watchers', {
                url:'/watchers',
                templateUrl:'templates/app/repo/watchers.html'
            })

            .state('app.repo.user.repo.stargazers', {
                url:'/stargazers',
                templateUrl:'templates/app/repo/stargazers.html'
            })

            .state('app.repo.user.repo.forks', {
                url:'/forks',
                templateUrl:'templates/app/repo/forks.html'
            })

            .state('app.repo.user.repo.pulls', {
                url:'/pulls',
                templateUrl:'templates/app/repo/pulls.html'
            })

            .state('app.repo.user.repo.contributors', {
                url:'/contributors',
                templateUrl:'templates/app/repo/contributors.html'
            })

            .state('app.repo.user.repo.issues', {
                url:'/issues',
                templateUrl:'templates/app/repo/issues.html'
            })


            .state('app.repo.user.repo.issues.number', {
                url:'/:number',
                templateUrl:'templates/app/repo/issues/comments.html',
                controller:'issueController as issue'
            })


            $urlRouterProvider.otherwise('/app/home/news')
        }])
        .run(['$rootScope', '$location','$ionicPlatform','$window', 'credentials', function ($rootScope, $location,$ionicPlatform,$window, credentials) {
            $rootScope.$on('$routeChangeStart', function (event) {
                if (!credentials.isLoggedIn()) {
                    console.log('DENY');
                    event.preventDefault();
                    $location.path('/login');
                }
                else {
                    if($location.path() == '/login') {
                        $location.replace();
                      $location.path('/app/home/news');
                    }
                }
            });
            $ionicPlatform.registerBackButtonAction(function (event) {
                  $window.history.back();
              }, 100);
        }])


        .factory('httpRequestInterceptor', function () {
          return {
            request: function (config) {
                config.url =  URI(config.url).addSearch({'access_token':'1def2060e6e2e51f478f466309e04dfaf4dd3927'}).toString();
                return config;
            }
          };
        })
        .config(function ($httpProvider) {
          $httpProvider.interceptors.push('httpRequestInterceptor');
        })
