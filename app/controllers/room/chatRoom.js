app.controller('chatRoomController',['$scope','userInfo','socketIoService',function($scope,userInfo,socketIoService){
    $scope.userInfo = userInfo.get();
    $scope.friendsCount = $scope.userInfo.friends.length;
    $scope.friendRequestCount = $scope.userInfo.friend_requests.length;
    $scope.sentRequestCount = $scope.userInfo.sent_requests.length;
    $scope.groupCount = $scope.userInfo.group_list.length;
    $scope.search = function(){
        if($scope.searchFriend.length === 10 && $scope.userInfo.unique_id !== $scope.searchFriend) {
            socketIoService.searchFriend({unique_id:$scope.searchFriend,_id:$scope.userInfo._id,socket_id:$scope.userInfo.socket_id})
        }else{
            $scope.sentRequestStatus = "please check your friend id";
        }
    }
    var timerCancel = function() {
        if(window.socket_connection){
            window.socket_connection.on($scope.userInfo._id, function (mess) {
                if(mess.type === "friend-request") {
                    $scope.sentRequestStatus = mess.message;
                    if(mess.friend_request && $scope.userInfo.sent_request.indexOf(mess.friend_request) !== -1){
                            $scope.userInfo.sent_request.push(mess.friend_request);
                    }
                    if(mess.sent_request && $scope.userInfo.sent_request.indexOf(mess.sent_request) !== -1){
                            $scope.userInfo.sent_request.push(mess.sent_request);
                    }
                    userInfo.save($scope.userInfo);
                }

                if($scope.sentRequestStatus){
                    setTimeout(function(){
                        $scope.sentRequestStatus = "";
                        $scope.$apply();
                    },30000);
                }
                $scope.$apply();
            });
        }else {
            setTimeout(function(){
                timerCancel();
            },2000);
        }
    };

    timerCancel();

}]);
