angular.module('readGit')
.service('userFollowing', ['$localStorage','$http', function($localStorage,$http){
    var details = {}
    var saveData = function(username, cb) {
       var url = 'https://api.github.com/users/'+username+'/following'
       $http.get(url)
            .success(function(data) {
                console.log(data)
                details = data
                $localStorage.userFollowing = details
                if (typeof cb=='function') {
                    cb(data)
                };
            })
   }

   var getData = function() {
       if ($localStorage.userFollowing) {
           details = $localStorage.userFollowing
       }
       return details
   }

   return {
       saveData:saveData,
       getData:getData
   }
}])