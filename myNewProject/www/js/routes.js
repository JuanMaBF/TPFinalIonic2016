angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

  .state('inicio.usuariosOnline', {
    url: '/usuariosOnline',
    views: {
      'tab3': {
        templateUrl: 'templates/usuariosOnline.html',
        controller: 'usuariosOnlineCtrl'
      }
    }
  })

  .state('inicio.desafios', {
    url: '/desafios',
    views: {
      'tab4': {
        templateUrl: 'templates/desafios.html',
        controller: 'desafiosCtrl'
      }
    }
  })

  .state('inicio.crearDesafio', {
    url: '/crearDesafio',
    views: {
      'tab5': {
        templateUrl: 'templates/crearDesafio.html',
        controller: 'crearDesafioCtrl'
      }
    }
  })

  .state('desafioCreado', {
    url: '/desafioCreado',
    templateUrl: 'templates/desafioCreado.html',
    controller: 'desafioCreadoCtrl'
  })

  .state('desafioAceptado', {
    url: '/desafioAceptado',
    templateUrl: 'templates/desafioAceptado.html',
    controller: 'desafioAceptadoCtrl'
  })

  .state('inicio', {
    url: '/inicio',
    templateUrl: 'templates/inicio.html',
    abstract:true
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('registro', {
    url: '/registro',
    templateUrl: 'templates/registro.html',
    controller: 'registroCtrl'
  })

$urlRouterProvider.otherwise('/login')

  

});