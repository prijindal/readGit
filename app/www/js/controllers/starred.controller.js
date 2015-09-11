angular.module('readGit')
.controller('starredController', ['$location', 'starred','credentials', function($location, starred, credentials){
    var self = this;
    var getNewData = function() {
        console.log('Getting new data')
        starred.saveData(credentials.get().username, function(data) {
            self.starred = data
            console.log('new data loaded')
        })
    }

    if(credentials.isLoggedIn()) {
        console.log(credentials.get());
        self.starred = starred.getData()
        getNewData()
    }
    else {
        $location.path('/login')
    }
}])