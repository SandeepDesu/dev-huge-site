app.controller("mainController",['socketIoService','userInfo',function(socketIoService,userInfo){
    socketIoService.connection().then(function(socket){
        if(socket !== null){
            window.socket_connection = socket;
            var data = userInfo.get();
            if(data!== null){
                data.socket_id=window.socket_connection.id
                socketIoService.update(data);
                userInfo.save(data);
            }
        }

    });

}]);
