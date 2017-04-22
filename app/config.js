app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'views/public/home.html'
        }).state('sign-in', {
            url: '/sign-in',
            templateUrl: 'views/public/sign-in.html'
        }).state('sign-up', {
            url: '/sign-up',
            templateUrl: 'views/public/sign-up.html'
        }).state('change-password', {
            url: '/change-password',
            templateUrl: 'views/public/change-password.html'
        }).state('email-activation', {
            url: '/email-activation',
            templateUrl: 'views/public/email-activation.html'
        }).state('forget-password', {
            url: '/forget-password',
            templateUrl: 'views/public/forget-password.html'
        })

    $stateProvider.state('chat',{
        url: '/chat',
        template: '<div ui-view></div>'
    }).state('chat.new-room', {
        url: '/new-room',
        templateUrl: 'views/chat/new-room.html'
    }).state('chat.join-room', {
        url: '/join-room',
        templateUrl: 'views/chat/join-room.html'
    }).state("chat.user",{
        url:'/user',
        templateUrl:'views/chat/chat-room.html'
    })
});
