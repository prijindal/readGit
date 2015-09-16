angular.module('readGit')
.service('userRepos', ['$localStorage','$http', function($localStorage,$http){
    var details = {}
    var saveData = function(username, cb) {
       var url = 'https://api.github.com/users/'+username+'/repos'
       $http.get(url)
            .success(function(data) {
                console.log(data)
                details = data
                $localStorage.userRepos = details
                if (typeof cb=='function') {
                    cb(data)
                };
            })
   }

   var getData = function() {
       if ($localStorage.userRepos) {
           details = $localStorage.userRepos
       }
       return details
   }

   return {
       saveData:saveData,
       getData:getData
   }
}])
