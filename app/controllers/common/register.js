app.controller("registerController", ['$scope', 'registerService', '$state', function ($scope, registerService, $state) {
    $scope.register = function () {
        if ($scope.phoneNumber && $scope.password && $scope.username && $scope.dateOfBirth && $scope.lastName && $scope.firstName) {
            registerService.register({
                full_name: $scope.firstName + " " + $scope.lastName,
                date_of_birth: new Date($scope.dateOfBirth),
                email: $scope.username,
                password: $scope.password,
                phone_number: $scope.phoneNumber,
                address: $scope.address,
                socket_id: window.socket_connection.id
            }).then(function (sucess) {
                if (sucess === true) {
                    $scope.address = $scope.phoneNumber = $scope.password = $scope.username = $scope.dateOfBirth = $scope.lastName = $scope.firstName = " "
                    $state.go('sign-in');
                } else {
                    $scope.logMessage = sucess.message;
                }


            })
        }

    }
}]);
