angular.module('readGit')
.controller('searchController', 
['$stateParams','search', 
function( $stateParams, search){
    var self = this;
    self.result = {}
    console.log($stateParams)
    var query = $stateParams.query
    self.result = search.getData(query)
    search.saveData(query, function(data) {
        console.log(data)
        self.result = data
    })
}])