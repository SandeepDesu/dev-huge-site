app.factory("loginService", ["$q", '$http', 'api', 'socketIoService', 'userInfo', '$auth', function ($q, $http, api, socketIoService, userInfo, $auth) {
    var authenticate = function(source){
        var defer = $q.defer();
        $http({
            method:'POST',
            url:api.url+'/v1/auth/login',
            data:source,
            'Content-Type':'application/json'
        }).then(function(sucess){
            console.log(sucess);
            if(sucess.data && sucess.data._id){
                socketIoService.update(sucess.data);
                userInfo.save(sucess.data);
                defer.resolve(true);
            }else{
                defer.resolve(sucess.data);
            }
        },function(err){
            console.log(err);
            defer.resolve({message: "some thing went wrong please try again later"});
        });
        return defer.promise;
    };
    var logout = function () {
        userInfo.save(null);
    };

    var social = function (name) {
        var defer = $q.defer();
        $auth.authenticate(name).then(function (response) {
            if (response.data && !response.data.message) {
                response.data.socket_id = window.socket_connection.id;
                socketIoService.update(response.data);
                userInfo.save(response.data);
                defer.resolve(true);
            } else {
                defer.resolve(response.data);
            }

        }).catch(function (response) {
            defer.resolve(response.data);
        });
        return defer.promise;
    };

    return {
        authenticate: authenticate,
        social: social,
        logout: logout
    }
}])
