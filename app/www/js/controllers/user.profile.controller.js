angular.module('readGit')
.controller('userProfileCtrl', 
['$stateParams', 'userProfile','userStarred','userRepoInfo','userFollowersInfo','userFollowingInfo',
function($stateParams, userProfile, userStarred, userRepos, userFollowers, userFollowing){
    var self = this;
    self.profileInfo = {}
    var username = $stateParams.username
    console.log(username)
    userProfile.getData(username, function(data) {
        self.profileInfo = data
    })
    userStarred.getData(username, function(data) {
        self.profileInfo.starred = data.length
        self.profileInfo.starredInfo = data
    })
    userRepos.getData(username, function(data) {
        self.profileInfo.repoDetails = data
    })
    userFollowers.getData(username, function(data) {
        self.profileInfo.followersDetails = data
    })
    userFollowing.getData(username, function(data) {
        self.profileInfo.followingDetails = data
    })
}])