angular.module('readGit')
        .service('credentials',['$localStorage', function($localStorage) {
            var details = {}
            if ($localStorage.userCredentials) {
                details = $localStorage.userCredentials
            }
            var save = function(data) {
                details = data
                $localStorage.userCredentials = details
            }
            var get = function() {
                return details
            }
            var isLoggedIn = function() {
                return details.username != undefined
            }

            var logout = function() {
                $localStorage.$reset()
                details = {}
            }
            return {
                save:save,
                get:get,
                isLoggedIn:isLoggedIn,
                logout:logout
            }
        }])
