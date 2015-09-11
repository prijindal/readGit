angular.module('readGit')
        .service('profileInfo',
        ['$localStorage','$http', 'starred', 
        function($localStorage,$http,starred){
            var details = {}
            var saveData = function(username, cb) {
               var url = 'https://api.github.com/users/'+username+''
               $http.get(url)
                    .success(function(data) {
                        console.log(data)
                        data.starred = starred.getData().length
                        details = data
                        $localStorage.profileInfo = details
                        if (typeof cb=='function') {
                            cb(data)
                        };
                    })
           }

           var getData = function() {
               if ($localStorage.profileInfo) {
                   details = $localStorage.profileInfo
               }
               return details
           }

           return {
               saveData:saveData,
               getData:getData
           }
        }])