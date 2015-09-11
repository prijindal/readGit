angular.module('readGit')
.controller('followingController', ['$location', 'userFollowing','credentials', function($location, userFollowing, credentials){
    var self = this;
    var getNewData = function() {
        console.log('Getting new data')
        userFollowing.saveData(credentials.get().username, function(data) {
            self.userFollowing = data
            console.log('new data loaded')
        })
    }

    if(credentials.isLoggedIn()) {
        console.log(credentials.get());
        self.userFollowing = userFollowing.getData()
        getNewData()
    }
    else {
        $location.path('/login')
    }
}])