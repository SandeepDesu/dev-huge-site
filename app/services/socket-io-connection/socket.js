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
        window.socket_connection.emit("session", "sending-friend-request", data);
    };

    var getFriendRequests = function (data) {
        window.socket_connection.emit("session", "get-friend-requests", data);
    };

    var getFriendsSent = function (data) {
        window.socket_connection.emit("session", "get-friend-requests-sent", data);
    };

    var getGroups = function (data) {
        window.socket_connection.emit("session", "get-groups", data);
    };

    var friendRequestAccept = function (data) {
        window.socket_connection.emit("session", "friend-request-accepted", data);
    };

    var friendRequestDelete = function (data) {
        window.socket_connection.emit("session", "friend-request-deleted", data);
    };

    var textMessageService = function (data) {
        window.socket_connection.emit("session", "text-message", data);
    };

    var getMessages = function (data) {
        window.socket_connection.emit("session", "get-message", data);
    };

    var createGroup = function (data) {
        window.socket_connection.emit("session", "create-group", data);
    };

    var groupMessages = function (data) {
        window.socket_connection.emit("session", "group-messages", data);
    };

    var isTyping = function (data) {
        window.socket_connection.emit("session", "is-typing", data);
    };
    return {
        connection:connection,
        update : update,
        getFriends:getFriends,
        searchFriend: searchFriend,
        getFriendRequests: getFriendRequests,
        getFriendsSent: getFriendsSent,
        getGroups: getGroups,
        friendRequestAccept: friendRequestAccept,
        friendRequestDelete: friendRequestDelete,
        textMessageService: textMessageService,
        getMessages: getMessages,
        createGroup: createGroup,
        isTyping: isTyping
    }
}])
