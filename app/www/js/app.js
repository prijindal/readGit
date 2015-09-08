
angular.module('readGit', [
        'ngRoute',
        'ngAnimate',
        'ngStorage',
        'yaru22.angular-timeago'
    ])
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





angular.module('readGit').controller('loginController',['$location','newsFeed','credentials', function($location,newsFeed, credentials) {
    var self = this;
    self.state = false
    if (credentials.isLoggedIn()) {
        $location.replace();
        $location.path('/home')
    }
    self.submit = function() {
        self.state = true
        credentials.save(self.user)
        newsFeed.saveData(credentials.get().username, function(data) {
            $location.replace();
            $location.path('/home')
            self.state = false
        })
    }
    input_fix()
}])


angular.module('readGit').controller('homeController',['$location', 'newsFeed','credentials', function($location, newsFeed, credentials) {
    var self = this;

    var getNewData = function() {
        console.log('Getting new data')
        self.loadingNew = true
        newsFeed.saveData(credentials.get().username, function(data) {
            self.newsfeed = data
            self.loadingNew = false
            console.log('new data loaded')
        })
    }

    if(credentials.isLoggedIn()) {
        console.log(credentials.get());
        self.newsfeed = newsFeed.getData()
        getNewData()
    }
    else {
        $location.path('/login')
    }

}])
