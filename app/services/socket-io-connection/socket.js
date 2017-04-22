app.factory("socketIoService",['$q',function($q){
    var connection = function(){
        var defer = $q.defer();
        var socket = io.connect('https://dev.hugefantacy.in:3000');
        socket.on('app', function (data) {
            if (data === 'connected') {
                defer.resolve(socket);
            } else {
                window.socket_connection = null;
                defer.resolve(null);
            }
        });
        return defer.promise;
    };
    var update = function(data) {
        window.socket_connection.emit("session","update",data);
    };

    var getFriends = function(data) {
        window.socket_connection.emit("session","friends",data);
    };

    var searchFriend = function(data) {
        window.socket_connection.emit("session","search-friend",data);
    };

    return {
        connection:connection,
        update : update,
        getFriends:getFriends,
        searchFriend:searchFriend
    }
}])
