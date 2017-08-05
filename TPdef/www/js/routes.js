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

  .state('inicio.listaDesafios', {
    url: '/listaDesafios',
    views: {
      'tab6': {
        templateUrl: 'templates/listaDesafios.html',
        controller: 'listaDesafiosCtrl'
      }
    }
  })

  .state('inicio.verDesafio', {
    url: '/verDesafio',
    views: {
      'tab7': {
        templateUrl: 'templates/verDesafio.html',
        controller: 'verDesafioCtrl'
      }
    }
  })

  .state('inicio.desafioActual', {
    url: '/desafioActual',
    views: {
      'tab7': {
        templateUrl: 'templates/desafioActual.html',
        controller: 'desafioActualCtrl'
      }
    }
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