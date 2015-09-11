angular.module('readGit')
.controller('newsController',['$location', 'newsFeed','credentials', function($location, newsFeed, credentials) {
    var self = this;
    var getNewData = function() {
        console.log('Getting new data')
        newsFeed.saveData(credentials.get().username, function(data) {
            self.newsfeed = data
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
