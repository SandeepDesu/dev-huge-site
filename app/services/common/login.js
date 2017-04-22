app.factory("loginService", ["$q",'$http','api','socketIoService','userInfo', function($q,$http,api,socketIoService,userInfo){
    var authenticate = function(source){
        var defer = $q.defer();
        $http({
            method:'POST',
            url:api.url+'/v1/auth/login',
            data:source,
            'Content-Type':'application/json'
        }).then(function(sucess){
            if(sucess.data && sucess.data._id){
                socketIoService.update(sucess.data);
                userInfo.save(sucess.data);
                defer.resolve(true);
            }else{
                defer.resolve(sucess.data);
            }

        },function(err){
            defer.resolve(null);
        });
        return defer.promise;
    };

    return {
        authenticate:authenticate
    }
}])
