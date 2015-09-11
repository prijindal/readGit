

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
}])
