app.controller("loginController", ['$scope', '$rootScope', 'loginService', '$state', 'userInfo', function ($scope, $rootScope, loginService, $state, userInfo) {
    var data = userInfo.get();
    if (data && data._id) {
        $rootScope.isLogin = true;
    } else {
        $rootScope.isLogin = false;
    }
    $scope.login = function(){
        if($scope.username && $scope.password){
            loginService.authenticate({
                email:$scope.username,
                password:$scope.password,
                type:"custom",
                socket_id:window.socket_connection.id
            }).then(function(response){
                if(response === true){
                    $state.go('chat.user');
                }else{
                    $scope.logMessage = response.message;
                    setTimeout(function(){
                        $scope.logMessage = "";
                    },30000)
                }
            });
        }
    };

    $scope.logout = function () {
        window.socket_connection.disconnect()
        loginService.logout();
        $state.go('sign-in');
    };

    $scope.authenticate = function (authenticator) {
        loginService.social(authenticator).then(function (response) {
            if (response) {
                $state.go('chat.user');
            } else {
                $scope.logMessage = response.message;
                setTimeout(function () {
                    $scope.logMessage = "";
                }, 30000)
            }
        });
    };
}])
