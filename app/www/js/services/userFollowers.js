angular.module('readGit')
.service('userFollowers', ['$localStorage','$http', function($localStorage,$http){
    var details = {}
    var saveData = function(username, cb) {
       var url = 'https://api.github.com/users/'+username+'/followers'
       $http.get(url)
            .success(function(data) {
                console.log(data)
                details = data
                $localStorage.userFollowers = details
                if (typeof cb=='function') {
                    cb(data)
                };
            })
   }

   var getData = function() {
       if ($localStorage.userFollowers) {
           details = $localStorage.userFollowers
       }
       return details
   }

   return {
       saveData:saveData,
       getData:getData
   }
}])