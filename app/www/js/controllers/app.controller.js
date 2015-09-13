angular.module('readGit')
.controller('appController', 
[ '$location',
function($location){
    var self = this;
    self.query = ''

    self.search = function(e) {
        var query = self.query
        var inputKey = e.keyCode
        
        if (
            (inputKey > 47 && inputKey < 91) || 
            (inputKey > 95 && inputKey < 112) ||
            (inputKey > 185 && inputKey < 222)
            ) {
                // Search
            }
        else if(inputKey == 13){
            // Redirect to search Page
            $location.path('/app/search/'+query)  
        };
        console.log(query)
    }


}])