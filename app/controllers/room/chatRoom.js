app.controller('chatRoomController', ['$scope', 'userInfo', 'socketIoService', function ($scope, userInfo, socketIoService) {
    $scope.userInfo = userInfo.get();
    $scope.isEditable = false;
    $scope.requestStatus = null;
    $scope.chatMessages = [];
    $scope.user = {selected: []};
    $scope.getFriends = function () {
        socketIoService.getFriends({
            socket_id: window.socket_connection.id,
            friends: $scope.userInfo.friends,
            _id: $scope.userInfo._id
        });
        $scope.displaySideMenu = "friends";
    };
    var timerCancel = function () {
        if (window.socket_connection) {
            setTimeout(function () {
                $scope.getFriends();
                $scope.$apply();
            }, 300);

            window.socket_connection.on($scope.userInfo._id, function (mess) {
                if (mess.type === "sending-friend-request") {
                    $scope.requestStatus = mess.message;
                    $scope.searchFriend = " ";
                    if (mess.friend_request && $scope.userInfo.friend_requests.indexOf(mess.friend_request) === -1) {
                        $scope.userInfo.friend_requests.push(mess.friend_request);
                        $scope.friendRequestCount = $scope.userInfo.friend_requests.length;
                    }
                    if (mess.sent_request && $scope.userInfo.sent_requests.indexOf(mess.sent_request) === -1) {
                        $scope.userInfo.sent_requests.push(mess.sent_request);
                        $scope.sentRequestCount = $scope.userInfo.sent_requests.length;
                    }
                    userInfo.save($scope.userInfo);
                    $scope.$apply();
                } else if (mess.type === "get-friend-requests") {
                    $scope.listFriendRequests = mess.list;
                    $scope.displaySideMenu = "friendRequests";
                    $scope.$apply();
                } else if (mess.type === "friend-request-accepted" || mess.type === "friend-request-deleted") {
                    $scope.userInfo = mess.me;
                    $scope.requestStatus = mess.message;
                    userInfo.save($scope.userInfo);
                    $scope.friendsCount = $scope.userInfo.friends.length;
                    $scope.friendRequestCount = $scope.userInfo.friend_requests.length;
                    $scope.sentRequestCount = $scope.userInfo.sent_requests.length;
                    $scope.groupCount = $scope.userInfo.groups.length;
                    $scope.displaySideMenu = null;
                    $scope.$apply();
                } else if (mess.type === "get-friend-requests-sent") {
                    $scope.listFriendRequestsSent = mess.list;
                    $scope.displaySideMenu = "sentRequests";
                    $scope.$apply();
                } else if (mess.type === "friends") {
                    $scope.friends = mess.list;
                    mess.list.forEach(function (v) {
                        $scope.user.selected.push({_id: v._id, full_name: v.full_name, status: false});
                    });
                    $scope.$apply();
                } else if (mess.type === 'text-message') {
                    if (mess.group_id === $scope.messengerId) {
                        $scope.chatMessages.push({
                            group_id: mess.group_id,
                            person_id: mess.person_id,
                            message: mess.message,
                            picture: mess.picture,
                            person_name: mess.person_name,
                            time: mess.time
                        });
                        $scope.$apply();
                    }

                } else if (mess.type === 'get-message') {
                    $scope.chatMessages = mess.messages;
                    $scope.$apply();
                }
                else if (mess.type === "create-group") {
                    $scope.userInfo = mess.user;
                    $scope.friendsCount = $scope.userInfo.friends.length;
                    $scope.friendRequestCount = $scope.userInfo.friend_requests.length;
                    $scope.sentRequestCount = $scope.userInfo.sent_requests.length;
                    $scope.groupCount = $scope.userInfo.groups.length;
                    userInfo.save($scope.userInfo);
                    $scope.$apply();
                }
                else if (mess.type === "get-groups") {
                    $scope.groups = mess.groups;
                    $scope.displaySideMenu = "get-groups";
                    $scope.$apply();
                } else if (mess.type === 'is-typing') {
                    if (mess.group_id === $scope.messengerId) {
                        $scope.isTypingPerson = mess.name + " is typing ..........";
                        $scope.$apply();
                        setTimeout(function () {
                            $scope.isTypingPerson = null;
                            $scope.$apply();
                        }, 3000)
                    }
                } else if (mess.type === 'is-online') {
                    if ($scope.friends && $scope.friends.length > 0) {
                        $scope.friends.forEach(function (v, k) {
                            if (mess.user._id == v._id) {
                                v.onLine = mess.user.onLine;
                            }
                        });
                        $scope.$apply();
                    }
                }
            });
            if ($scope.requestStatus) {
                setTimeout(function () {
                    $scope.requestStatus = null;
                    $scope.$apply();
                }, 30000)
            }

        } else {
            setTimeout(function () {
                timerCancel();
            }, 2000);
        }
    };
    timerCancel();
    $scope.friendsCount = $scope.userInfo.friends.length;
    $scope.friendRequestCount = $scope.userInfo.friend_requests.length;
    $scope.sentRequestCount = $scope.userInfo.sent_requests.length;
    $scope.groupCount = $scope.userInfo.groups.length;

    $scope.updateInfo = function () {
        $scope.isEditable = !$scope.isEditable;
        $scope.userInfo.date_of_birth = new Date($scope.userInfo.date_of_birth);
        userInfo.save($scope.userInfo);
        socketIoService.update($scope.userInfo);
    };

    $scope.search = function () {
        if ($scope.searchFriend.length === 10 && $scope.userInfo.unique_id !== $scope.searchFriend) {
            socketIoService.searchFriend({
                unique_id: $scope.searchFriend,
                _id: $scope.userInfo._id,
                socket_id: window.socket_connection.id
            })
        } else {
            $scope.sentRequestStatus = "please check your friend id";
        }
    };

    $scope.getFriendRequests = function () {
        socketIoService.getFriendRequests({socket_id: window.socket_connection.id, _id: $scope.userInfo._id});
    };

    $scope.getFriendsSent = function () {
        socketIoService.getFriendsSent({socket_id: window.socket_connection.id, _id: $scope.userInfo._id});
    };

    $scope.getGroups = function () {
        socketIoService.getGroups({
            socket_id: window.socket_connection.id,
            _id: $scope.userInfo._id,
            group_ids: $scope.userInfo.groups
        });
    };

    $scope.friendRequestAccept = function (_id) {
        socketIoService.friendRequestAccept({
            socket_id: window.socket_connection.id,
            _id: $scope.userInfo._id,
            friend_id: _id
        });
    };

    $scope.friendRequestDelete = function (_id) {
        socketIoService.friendRequestDelete({
            socket_id: window.socket_connection.id,
            _id: $scope.userInfo._id,
            friend_id: _id
        });
    };

    $scope.chatInit = function (friend) {
        $scope.userInfo.chats.forEach(function (v) {
            friend.chats.forEach(function (k) {
                if (v === k) {
                    $scope.chatMessages = [];
                    $scope.messengerId = v;
                    $scope.friendName = friend.full_name;
                    socketIoService.getMessages({group_id: v, _id: $scope.userInfo._id});
                }
            });
        });
    };

    $scope.sendMessage = function () {
        if ($scope.messengerId) {
            socketIoService.textMessageService({
                socket_id: window.socket_connection.id,
                person_id: $scope.userInfo._id,
                group_id: $scope.messengerId,
                message: $scope.textMessage
            });
            $scope.chatMessages.push({
                person_id: $scope.userInfo._id,
                message: $scope.textMessage,
                picture: $scope.userInfo.picture,
                time: new Date()
            });
            $scope.textMessage = "";
        }
    };

    $scope.createGroups = function () {
        $scope.displaySideMenu = 'create-group';
        if (!$scope.friends || $scope.friends.length === 0) {
            socketIoService.getFriends({
                socket_id: window.socket_connection.id,
                friends: $scope.userInfo.friends,
                _id: $scope.userInfo._id
            });
        }
    };

    $scope.addFriendsGroup = function () {
        var users = [];
        users.push($scope.userInfo._id);
        $scope.user.selected.forEach(function (v, k) {
            if (v.status) {
                users.push(v._id);
            }
            if (k === $scope.user.selected.length - 1) {
                socketIoService.createGroup({
                    socket_id: window.socket_connection.id,
                    users: users,
                    full_name: "sandy"
                });
            }
        });

    };

    $scope.groupInit = function (friend) {
        $scope.friendName = friend.full_name;
        $scope.messengerId = friend._id;
        socketIoService.getMessages({group_id: friend._id, _id: $scope.userInfo._id});
    };

    $scope.isTyping = function () {
        if ($scope.messengerId) {
            socketIoService.isTyping({
                group_id: $scope.messengerId,
                _id: $scope.userInfo._id,
                name: $scope.userInfo.full_name
            });
        }

    };

}])
