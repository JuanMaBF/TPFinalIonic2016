angular.module('app.controllers', [])
  
.controller('menuCtrl', function ($scope, $stateParams) {

})
   
.controller('usuariosOnlineCtrl', function ($scope, $stateParams) {


})
   
.controller('desafiosCtrl', function ($scope, $stateParams) {


})
   
.controller('crearDesafioCtrl', function ($scope, $stateParams) {


})
   
.controller('desafioCreadoCtrl', function ($scope, $stateParams) {


})
   
.controller('desafioAceptadoCtrl', function ($scope, $stateParams) {


})
      
.controller('loginCtrl', function ($scope, $stateParams, $ionicPopup, $timeout) {

    $scope.loginData = {};
	$scope.login = function(){
	    /*Validar datos de logueo*/
	    if($scope.loginData.email == null){ 
	      alert("Ingrese un email");
	      return -1;
	    }else if($scope.loginData.password == null){
	      alert("Ingrese un password");
	      return -1;
	    }
	    /*Crear variables con datos de logueo*/
	    var email = $scope.loginData.email;
	    var password = $scope.loginData.password;

	    /*Loguear con mail y password*/
	    firebase.auth().signInWithEmailAndPassword(email, password)
	      .then(function(usuario){ /*Logueo exitoso*/
	        firebase.User = usuario;
	        location.href="#/inicio/usuariosOnline"; //Redireccionamiento
	        var myPopup = $ionicPopup.show({
	           template: '<center> Bienvenido ' + firebase.auth().currentUser.displayName + "</center>",
	           title: 'Bienvenido'
	        });
	        $timeout(function(){
	          myPopup.close();

	        }, 3000);
	        
	      })
	      .catch(function(error) { /*Manejo de errores*/
	        var errorCode = error.code;
	        var errorMessage = error.message;
	        if (errorCode == 'auth/invalid-email') {
	          alert('El email ingresado no es válido.');
	        } 
	        else if (errorCode == 'auth/user-disabled') {
	          alert('El usuario ha sido deshabilitado.');
	        } 
	        else if (errorCode == 'auth/user-not-found') {
	          alert('El usuario ingresado no existe.');
	        } 
	        else if (errorCode == 'auth/wrong-password') {
	          alert('El password ingresado es incorrecto.');
	        } 
	        else {
	          alert(errorMessage); //Otro tipo de error
	        }
	        console.info(error);
		});
	}

})
   
.controller('registroCtrl', function ($scope, $stateParams, $ionicPopup, $timeout) {

  $scope.regData = {};
  // Hacer logueo
  $scope.registrar = function() {

    /*Validar datos de logueo*/
    if($scope.regData.nombre == null){ 
      alert("Ingrese un nombre.");
      return -1;
    } else if($scope.regData.email == null){ 
      alert("Ingrese un email.");
      return -1;
    } else if($scope.regData.password == null){
      alert("Ingrese un password.");
      return -1;
    } 

    /*Crear variables con datos de registro*/
    var nombre = $scope.regData.nombre;
    var email = $scope.regData.email;
    var password = $scope.regData.password;

    /*Registrar con mail y password*/
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function(usuario){ /*Registro exitoso*/
        firebase.User = usuario;
        usuario.updateProfile({
          displayName: nombre
        }).then(function() {
          var displayName = usuario.displayName;
        }, function(error) {
          console.info(error);
        });

        var myPopup = $ionicPopup.show({
           template: '<center> Bienvenido ' + firebase.auth().currentUser.displayName + "</center>",
           title: 'Bienvenido'
        });
        $timeout(function(){
          myPopup.close();

        }, 3000);
        location.href="#/inicio/usuariosOnline"; //Redireccionamiento
      })
      .catch(function(error) { /*Manejo de errores*/
        var errorCode = error.code;
        var errorMessage = error.message;

        if (errorCode == 'auth/email-already-in-use') {
          alert('El email ingresado ya se encuentra en uso.');
        } 
        else if (errorCode == 'auth/invalid-email') {
          alert('El email ingresado no es válido.');
        } 
        else if (errorCode == 'auth/operation-not-allowed') {
          alert('Esta operación se encuentra deshabilitada.');
        } 
        else if (errorCode == 'auth/weak-password') {
          alert('El password ingresado es muy debil.');
        } 
        else {
          alert(errorMessage); //Otro tipo de error
        }
        console.info(error);
      });

  }

})
 