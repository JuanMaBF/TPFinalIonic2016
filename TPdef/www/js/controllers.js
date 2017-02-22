angular.module('app.controllers', [])
  
.controller('menuCtrl', function ($scope, $stateParams, $ionicPopup, $timeout) {
  $scope.logout = function() {
    var myPopup = $ionicPopup.show({
      template: '<center> Sesión Cerrada! </center>',
      title: 'Logout'
    });
    $timeout(function(){
      myPopup.close();
    }, 1000);
    firebase.auth().signOut();
    var usuarios;
    firebase.database().ref('UsuariosOnline/').once('value').then(function(snapshot){
      usuarios = snapshot.val();
      var arrayObjetos = $.map(usuarios, function(value, index) {
        return [value];
      });
      var arrayIndex = $.map(usuarios, function(value, index) {
        return [index];
      });
      for(i=0; i<arrayObjetos.length; i++){
        if(arrayObjetos[i].email == firebase.User.email){
          firebase.database().ref('UsuariosOnline/' + arrayIndex[i]).set({
            email: null
          });
        }
      }
    });
    location.href="#/login";
  };
})
   
.controller('usuariosOnlineCtrl', function ($scope, $stateParams, $ionicPopup) {

  firebase.database().ref('UsuariosOnline/').on('value', function(snapshot){
    $('#usuariosOnline-list5').html('');
    usuarios = snapshot.val();
    var arrayObjetos = $.map(usuarios, function(value, index) {
      return [value];
    });
    var el = '';
    if(snapshot != null){
      var count = 0;
      arrayObjetos.forEach(function(element){
        el += "<ion-item id=\"usuariosOnline-list-item"+count+"\">";
        el += element.nombre.toString();
        el += "</ion-item>";
        count++;
      });
    }else{
      el = "<ion-item id=\"usuariosOnline-list-item11\">No hay usuarios online</ion-item>";
    }
    $('#usuariosOnline-list5').html(el);
    compilarElemento("#usuariosOnline-list5");
  });

})

.controller('desafiosCtrl', function ($scope, $stateParams, $ionicPopup) {
  firebase.database().ref('Desafios/').on('value', function(snapshot){
    $('#desafiosActuales').html('');
    desafios = snapshot.val();
    var arrayObjetos = $.map(desafios, function(value, index) {
      return [value];
    });
    var el = '';
    if(snapshot != null){
      var count = 0;
      arrayObjetos.forEach(function(element){
        el += "<div id=\"desafios-container"+count+"\">";
        el += "<div class=\"spacer\" style=\"width: 300px; height: 24px;\"></div>";
        el += "<ion-list id=\"desafios-list9\">";
        el += "<ion-item class=\"item-avatar\" id=\"desafios-list-item18\">";
        el += "<h2>" + element.nombre.toString() +"</h2>";
        el += "<p>Dura" + element.tiempoStr.toString() +".</p>";
        el += "</ion-item>";
        el += "<ion-radio id=\"desafios-radio5\">Aceptar por §" + element.dinero.toString() + "</ion-radio>";
        el += "</ion-list>";
        el += "</div>";
        count++;
      });
    }else{
      el = "<ion-item id=\"usuariosOnline-list-item11\">No hay usuarios online</ion-item>";
    }
    $('#usuariosOnline-list5').html(el);
    compilarElemento("#usuariosOnline-list5");
  });
})
   
.controller('crearDesafioCtrl', function ($scope, $stateParams, $ionicPopup, $timeout) {
  $scope.crearDesafio = function(data){

    if(data == undefined || data.nombre == undefined || data.nombre == ''){
      var myPopup = $ionicPopup.show({
	      template: '<center>Ingrese un nombre</center>',
	      title: 'Nombre'
	    });
	    $timeout(function(){
	      myPopup.close();
	    }, 1000);
      return;
    }
    if(data.dinero == undefined || data.dinero == ''){
      var myPopup = $ionicPopup.show({
	      template: '<center>Seleccione una suma de dinero</center>',
	      title: 'Dinero'
	    });
	    $timeout(function(){
	      myPopup.close();
	    }, 1000);
      return;
    }
    if(data.tiempo == undefined || data.tiempo == ''){
      var myPopup = $ionicPopup.show({
	      template: '<center>Seleccion el tiempo deseado</center>',
	      title: 'Tiempo'
	    });
	    $timeout(function(){
	      myPopup.close();
	    }, 1000);
      return;
    }

    var nombre = data.nombre;
    var dinero = data.dinero.replace('§', '');
    var tiempo;
    var tiempoStr = data.tiempo;
    switch(data.tiempo){
      case "30 Segundos":
        tiempo = 30000;
        break;
      case "1 Minuto":
        tiempo = 60000;
        break;
      case "10 Minutos":
        tiempo = 600000;
        break;
      case "30 Minutos":
        tiempo = 1800000;
        break;
      case "1 Hora":
        tiempo = 3600000;
        break;
      case "2 Horas":
        tiempo = 7200000;
        break;
    }

    firebase.database().ref('Usuarios/').once('value').then(function(snapshot){
      
      var usuarios = snapshot.val();
      var dineroActual;
      var arrayObjetos = $.map(usuarios, function(value, index) {
        return [value];
      });
      arrayObjetos.forEach(usr => {
        if(usr.email == firebase.auth().currentUser.email){
          dineroActual = usr.dinero;
        }
      });

      if(dinero <= dineroActual){
        firebase.database().ref('Desafios/').push({
          nombre: nombre,
          dinero: dinero,
          tiempo: tiempo,
          tiempoStr: tiempoStr,
          creador: firebase.auth().currentUser.email,
          acepta1: "null",
          acepta2: "null",
          acepta3: "null"
        });
        location.href="#/desafioCreado";
      }else{
        var myPopup = $ionicPopup.show({
          template: '<center>Usted no posee dinero suficiente</center>',
          title: 'No hay fondos'
        });
        $timeout(function(){
          myPopup.close();
        }, 3000);
      }
    });
  }
})
   
.controller('desafioCreadoCtrl', function ($scope, $stateParams, $timeout) {

  firebase.database().ref('Desafios/').once('value').then(function(snapshot){
    var tiempo;
    var arrayDesafios = $.map(snapshot.val(), function(value, index) {
      return [value];
    });
    arrayDesafios.forEach(des => {
      if(des.creador == firebase.auth().currentUser.email){
        tiempo = des.tiempo;
      }
    });

    firebase.database().ref('Desafios/').on('value', function(snapshot){
      var desafioActual;
      var arrayDesafios = $.map(snapshot.val(), function(value, index) {
        return [value];
      });
      arrayDesafios.forEach(des => {
        if(des.creador == firebase.auth().currentUser.email){
          desafioActual = des;
        }
      });
      var el = '';
      if(desafioActual.acepta1 != "null"){
        el += "<ion-item id=\"desafioCreado-list-item25\">"+ desafioActual.acepta1 +"</ion-item>";
      }
      if(desafioActual.acepta2 != "null"){
        el += "<ion-item id=\"desafioCreado-list-item26\">"+ desafioActual.acepta2 +"</ion-item>";
      }
      if(desafioActual.acepta3 != "null"){
        el += "<ion-item id=\"desafioCreado-list-item27\">"+ desafioActual.acepta3 +"</ion-item>";
      }
      if(el == ''){
        el += "<ion-item id=\"desafioCreado-list-item27\">NADIE ACEPTA AUN EL DESAFIO</ion-item>";
      }
      $('#desafioCreado-list13').html(el);
      compilarElemento('#desafioCreado-list13');
    });    

    $timeout(function(){
      $("#gane-button").prop("disabled", false);
      $("#perdi-button").prop("disabled", false);
    }, tiempo);

  });

  $scope.resultado = function(resultado){
    firebase.database().ref('Desafios/').once('value').then(function(snapshot){
      var desafioActual;
      var arrayDesafios = $.map(snapshot.val(), function(value, index) {
        return [value];
      });
      arrayDesafios.forEach(des => {
        if(des.creador == firebase.auth().currentUser.email){
          desafioActual = des;
        }
      });

      var cantidadDeJugadores = 0;
      if(desafioActual.acepta1 != "null"){
        cantidadDeJugadores++;
      }
      if(desafioActual.acepta2 != "null"){
        cantidadDeJugadores++;
      }
      if(desafioActual.acepta3 != "null"){
        cantidadDeJugadores++;
      }

      var aCreador = 0;
      var aAcepta1 = 0;
      var aAcepta2 = 0;
      var aAcepta3 = 0;
      if(resultado == "gane"){
        aCreador += desafioActual.dinero * cantidadDeJugadores;
        aAcepta1 -= desafioActual.dinero;
        aAcepta2 -= desafioActual.dinero;
        aAcepta3 -= desafioActual.dinero;
      }else if(resultado == "perdi"){
        aCreador -= desafioActual.dinero;
        aAcepta1 += desafioActual / cantidadDeJugadores;
        aAcepta2 += desafioActual / cantidadDeJugadores;
        aAcepta3 += desafioActual / cantidadDeJugadores;
      }

      firebase.database().ref('Usuarios/').once('value').then(function(snapshot){
        usuarios = snapshot.val();
        var arrayObjetos = $.map(usuarios, function(value, index) {
          return [value];
        });
        var arrayIndex = $.map(usuarios, function(value, index) {
          return [index];
        });
        for(i=0; i<arrayObjetos.length; i++){
          if(arrayObjetos[i].email == firebase.auth().currentUser.email){
            var nuevoDinero = arrayObjetos[i].dinero + aCreador;
            console.log("A creador: " + aCreador);
            console.log("Nuevo dinero: " + nuevoDinero);
            firebase.database().ref('Usuarios/' + arrayIndex[i]).set({
              dinero: nuevoDinero,
              email: firebase.auth().currentUser.email,
              nombre: firebase.auth().currentUser.displayName
            });
          }
        }
      });

      firebase.database().ref('Desafios/').once('value').then(function(snapshot){
        var arrayObjetos = $.map(snapshot.val(), function(value, index) {
          return [value];
        });
        var arrayIndex = $.map(snapshot.val(), function(value, index) {
          return [index];
        });
        for(i=0; i<arrayObjetos.length; i++){
          if(arrayObjetos[i].creador == firebase.auth().currentUser.email){
            firebase.database().ref('Desafios/' + arrayIndex[i]).set({
              nombre: null,
              dinero: null,
              tiempo: null,
              creador: null,
              acepta1: null,
              acepta2: null,
              acepta3: null
            });
          }
        }
      });

    });
  }

})
   
.controller('desafioAceptadoCtrl', function ($scope, $stateParams) {})
      
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
        firebase.database().ref('UsuariosOnline/').push({
          nombre: firebase.auth().currentUser.displayName,
          email: email
        });          
	      location.href="#/inicio/usuariosOnline"; //Redireccionamiento
	      var myPopup = $ionicPopup.show({
	        template: '<center> Bienvenido ' + firebase.auth().currentUser.displayName + "</center>",
	        title: 'Bienvenido'
	      });
	      $timeout(function(){
	        myPopup.close();
	      }, 1000);  
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

        firebase.database().ref('UsuariosOnline/').push({
          nombre: $scope.regData.nombre,
          email: email
        });

        firebase.database().ref('Usuarios/').push({
          nombre: $scope.regData.nombre,
          email: email,
          dinero: 3000
        });

        var myPopup = $ionicPopup.show({
           template: '<center> Bienvenido ' + firebase.auth().currentUser.displayName + "</center>",
           title: 'Bienvenido'
        });
        $timeout(function(){
          myPopup.close();
        }, 1000);
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
});

function compilarElemento(elemento) {
  var elemento = (typeof elemento == "string") ? elemento : null;  
  if (elemento != null) {
    var div = $(elemento);
    var target = $("[ng-app]");
    angular.element(target).injector().invoke(["$compile", function ($compile) {
      var $scope = angular.element(target).scope();
      $compile(div)($scope);
    }]);
  }
}
 