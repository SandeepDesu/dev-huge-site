app.factory('userInfo',["$localStorage",function($localStorage){
    var save = function(userInfo) {
        $localStorage.userInfo = JSON.stringify(userInfo);
    };

    var get = function(){
        if($localStorage.userInfo && $localStorage.userInfo !== null ){
            return JSON.parse($localStorage.userInfo);
        }else{
            return null;
        }

    };

    var token = function(tok){
        if(tok !== null && tok !== undefined){
            $localStorage.token = tok;
        }else{
            return $localStorage.token;
        }
    }
  return {
      save:save,
      get:get,
      token:token
  }
}]);
