

angular.module('readGit')
.controller('loginController',
['$location','newsFeed','profileInfo','starred','credentials', 
function($location,newsFeed,profileInfo, starred, credentials) {
    var self = this;
    self.state = false
    if (credentials.isLoggedIn()) {
        $location.replace();
        $location.path('/app/home/news')
    }
    self.submit = function() {
        if (self.user) {
            self.state = true
            credentials.save(self.user)
            newsFeed.saveData(credentials.get().username, function(data) {
                $location.replace();
                $location.path('/app/home/news')
                self.state = false
            })
            profileInfo.saveData(credentials.get().username)
            starred.saveData(credentials.get().username)
        }
    }
}])
