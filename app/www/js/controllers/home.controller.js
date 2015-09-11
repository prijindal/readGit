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
