app.factory("registerService", ["$q",'$http','api', function($q,$http,api){
    var register = function(source){
        var defer = $q.defer();
        $http({
            method:'POST',
            url:api.url+'/v1/auth/register',
            data:source,
            'Content-Type':'application/json'
        }).then(function(sucess){
            if(sucess.data && sucess.data.unique_id){
                defer.resolve(true);
            }else{
                defer.resolve(sucess.data);
            }
        },function(err){
            defer.resolve({message:"some thing went wrong please try again later"});
        });

        return defer.promise;
    };

    return {
        register:register
    }
}])
