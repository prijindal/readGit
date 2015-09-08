angular.module('readGit')
       .factory('newsFeed',['$http','eventString','$localStorage', function($http, eventString, $localStorage) {
           var details = {}
           var saveData = function(username, cb) {
               var url = 'https://api.github.com/users/'+username+'/received_events'
               $http.get(url)
                    .success(function(data) {
                        data.forEach(function(item) {
                            item.string = eventString.getString(item)
                        })
                        //console.log(data)
                        details = data
                        $localStorage.newsFeed = details
                        cb(data)
                    })
           }
           var getData = function() {
               if ($localStorage.newsFeed) {
                   details = $localStorage.newsFeed
               }
               return details
           }

           return {
               saveData:saveData,
               getData:getData
           }
       }])
