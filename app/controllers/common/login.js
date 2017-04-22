app.controller("loginController",['$scope','loginService','$state',function($scope,loginService,$state){
    $scope.login = function(){
        if($scope.username && $scope.password){
            loginService.authenticate({
                email:$scope.username,
                password:$scope.password,
                type:"custom",
                app:"hugefantacy",
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
    }

    $scope.authenticate = function(authenticator){

    }
}])
