angular.module('readGit')
        .controller('profileController', ['$location','profileInfo','credentials', function($location,profileInfo,credentials){
            var self = this;
            var getNewData = function() {
                console.log('Getting new Profile Info')
                profileInfo.saveData(credentials.get().username, function(data) {
                    self.profileInfo = data
                    console.log('new profile info loaded')
                })
            }

            if(credentials.isLoggedIn()) {
                console.log(credentials.get());
                self.profileInfo = profileInfo.getData()
                getNewData()
            }
            else {
                $location.path('/login')
            }

            self.logout = function() {
              credentials.logout()
              $location.path('/login')
            }
        }])