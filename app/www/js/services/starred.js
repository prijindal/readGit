angular.module('readGit')
.service('starred', ['$localStorage','$http', function($localStorage,$http){
    var details = {}
    var saveData = function(username, cb) {
       var url = 'https://api.github.com/users/'+username+'/starred'
       $http.get(url)
            .success(function(data) {
                console.log(data)
                details = data
                $localStorage.starred = details
                if (typeof cb=='function') {
                    cb(data)
                };
            })
   }

   var getData = function() {
       if ($localStorage.starred) {
           details = $localStorage.starred
       }
       return details
   }

   return {
       saveData:saveData,
       getData:getData
   }
}])