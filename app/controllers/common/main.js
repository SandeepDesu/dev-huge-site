app.controller("mainController", ['$scope', 'socketIoService', 'userInfo', function ($scope, socketIoService, userInfo) {
    var data = userInfo.get();
    socketIoService.connection().then(function(socket){
        if(socket !== null){
            window.socket_connection = socket;
            if(data!== null){
                data.socket_id = window.socket_connection.id;
                setTimeout(function () {
                    userInfo.save(data);
                    socketIoService.update(data);
                    $scope.$apply();
                }, 500);
            }
        }
    });

}]);
